import type { Intensity } from "../types";
import { parseIntro } from "./parseIntro";
import { isVerbPhraseRole, professionFromDesignWork, cleanAttendeeName } from "./rolePhrase";

/** Soft length targets for prompts — delivery never chops a landed punchline to hit these. */
export const TARGET_ROAST_CHARS: Record<Intensity, number> = {
  light: 120,
  contractor: 150,
  nuclear: 180,
  nsfw: 200,
};

/** Safety valve for runaway API ramble only — well above normal one-liners. */
const ABSOLUTE_ROAST_CHARS = 360;

export type RoastDeliveryContext = {
  name: string;
  role: string;
  company?: string;
  introTranscript?: string;
  intensity: Intensity;
};

export function cleanProfession(role: string): string {
  let r = role.trim().replace(/^from,?\s*/i, "").trim();
  if (isVerbPhraseRole(r)) {
    const m = r.match(/^(\w+)\s+(.+)$/i);
    if (m) r = professionFromDesignWork(m[1], m[2]);
  }
  return r;
}

type AttendeeFacts = {
  name: string;
  role: string;
  company?: string;
};

function resolveFacts(ctx: RoastDeliveryContext): AttendeeFacts {
  const parsed = ctx.introTranscript?.trim() ? parseIntro(ctx.introTranscript) : null;
  return {
    name: cleanAttendeeName(parsed?.name ?? ctx.name),
    role: cleanProfession(parsed?.role ?? ctx.role),
    company: parsed?.company ?? ctx.company,
  };
}

/** Deterministic copy fixes — no LLM retry loop. */
export function normalizeRoastDelivery(roast: string, ctx: RoastDeliveryContext): string {
  const facts = resolveFacts(ctx);
  let text = roast.trim();
  if (!text) return text;

  const badNameVariants = new Set<string>();
  for (const raw of [ctx.name.trim(), facts.name]) {
    const cleaned = cleanAttendeeName(raw);
    if (cleaned.length >= 2) badNameVariants.add(cleaned);
  }
  for (const raw of ctx.name.split(/\s+/)) {
    if (/^from$/i.test(raw)) badNameVariants.add(raw);
  }

  for (const bad of badNameVariants) {
    if (!bad || bad.length < 2) continue;
    const escaped = bad.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`\\b${escaped}\\b`, "gi"), facts.name);
  }

  text = fixNameCompanyPhrase(text, facts);

  text = text
    .replace(/\bfrom,\s*/gi, "")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+,/g, ",")
    .trim();

  text = text.replace(
    new RegExp(`\\b${escapeRe(facts.name)}\\s*,\\s*${escapeRe(facts.role)}\\s+at\\s+${escapeRe(facts.company ?? "")}`, "i"),
    `${facts.name}, ${facts.role} at ${facts.company}`,
  );

  if (facts.company) {
    const co = escapeRe(facts.company);
    text = text.replace(new RegExp(`\\bat\\s+${co}\\s+at\\s+${co}`, "gi"), `at ${facts.company}`);
  }

  text = fixVerbPhraseProfession(text, facts.role);

  if (ctx.intensity !== "nsfw") {
    text = softenProfanityForIntensity(text);
  }

  text = ensureSpeakableOpener(text, facts);
  text = clampToOneSentence(text, ctx.intensity);

  return text.trim();
}

/** Keep roasts to a single speakable line — trims API ramble, never mid-burn. */
export function clampToOneSentence(text: string, _intensity: Intensity = "contractor"): string {
  let t = text.trim();
  if (!t) return t;

  if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1).trim();

  const sentenceEnd = t.search(/[.!?](?:\s|$|")/);
  if (sentenceEnd >= 0) {
    const after = t.slice(sentenceEnd + 1).trim();
    if (after.length > 0) {
      t = t.slice(0, sentenceEnd + 1).trim();
    }
  }

  if (t.length > ABSOLUTE_ROAST_CHARS) {
    t = trimRunawayRoast(t, ABSOLUTE_ROAST_CHARS);
  }

  return t;
}

/** Last resort when the API returns a paragraph-sized single line. */
function trimRunawayRoast(text: string, max: number): string {
  let bestEnd = -1;
  for (const m of text.matchAll(/[.!?](?:\s|$|")/g)) {
    const end = (m.index ?? 0) + 1;
    if (end <= max) bestEnd = end;
    else break;
  }
  if (bestEnd > 0) return text.slice(0, bestEnd).trim();

  for (const sep of [" — ", " – ", "; "]) {
    const idx = text.lastIndexOf(sep, max - 1);
    if (idx > max * 0.45) {
      const chunk = text.slice(0, idx).trim();
      return /[.!?]$/.test(chunk) ? chunk : `${chunk}.`;
    }
  }

  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim();
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fixVerbPhraseProfession(text: string, profession: string): string {
  return text
    .replace(/\b(a|an)\s+(designs|builds|manages|engineers)\s+/gi, `$1 ${profession} — `)
    .replace(/\bYou're a (designs|builds|manages|engineers)\s+/gi, `You're a ${profession} — `)
    .replace(/\b(you're|you are)\s+(designs|builds|manages|engineers)\s+/gi, `$1 a ${profession} — `);
}

function softenProfanityForIntensity(text: string): string {
  return text
    .replace(/F@#%NG?/gi, "freaking")
    .replace(/F@#%/gi, "freaking")
    .replace(/SH!T/gi, "stuff")
    .replace(/B#@\\$H/gi, "mess");
}

function attendeeCallout(facts: AttendeeFacts): string {
  return facts.company?.trim() ? `${facts.name} from ${facts.company.trim()}` : facts.name;
}

/** "Dennis OQULi" → "Dennis from OQULi" when company is known. */
function fixNameCompanyPhrase(text: string, facts: AttendeeFacts): string {
  const company = facts.company?.trim();
  if (!company) return text;
  const name = escapeRe(facts.name);
  const co = escapeRe(company);
  return text.replace(
    new RegExp(`\\b(${name})\\s+(?!from\\s)(${co})\\b`, "gi"),
    `$1 from $2`,
  );
}

function ensureSpeakableOpener(text: string, facts: AttendeeFacts): string {
  const callout = attendeeCallout(facts);
  const firstName = facts.name.split(/\s+/)[0] ?? facts.name;
  const lower = text.toLowerCase();
  if (
    lower.includes(callout.toLowerCase()) ||
    lower.includes(firstName.toLowerCase()) ||
    lower.includes(facts.name.toLowerCase())
  ) {
    return text;
  }

  const rest = text.charAt(0).toLowerCase() + text.slice(1);
  return `${callout}, ${rest}`;
}

/** Quick sanity flags for admin/debug — not used to regenerate. */
export function deliveryIssues(roast: string, ctx: RoastDeliveryContext): string[] {
  const issues: string[] = [];
  const facts = resolveFacts(ctx);
  if (/\bfrom,\s/i.test(roast)) issues.push("stray-from-comma");
  if (/\b(designs|builds|manages)\s+\w/i.test(roast) && !facts.role.includes("designer")) {
    issues.push("verb-phrase-role");
  }
  if (facts.company && new RegExp(`\\b${escapeRe(facts.name)}\\s+${escapeRe(facts.company)}\\b`, "i").test(roast)) {
    issues.push("name-company-missing-from");
  }
  return issues;
}
