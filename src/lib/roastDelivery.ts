import type { Intensity } from "../types";
import { parseIntro } from "./parseIntro";
import { isVerbPhraseRole, professionFromDesignWork, cleanAttendeeName } from "./rolePhrase";

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
  badNameVariants.add(ctx.name.trim());
  badNameVariants.add(facts.name);
  badNameVariants.add(`${facts.name} from`);
  badNameVariants.add(`${ctx.name.trim()} from`);
  for (const raw of ctx.name.split(/\s+/)) {
    if (/^from$/i.test(raw)) badNameVariants.add(raw);
  }

  for (const bad of badNameVariants) {
    if (!bad || bad.length < 2) continue;
    const escaped = bad.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`\\b${escaped}\\b`, "gi"), facts.name);
  }

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

  return text.trim();
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

function ensureSpeakableOpener(text: string, facts: AttendeeFacts): string {
  const lower = text.toLowerCase();
  const nameOk = lower.includes(facts.name.toLowerCase().split(" ")[0]);
  if (nameOk) return text;

  if (facts.company) {
    return `${facts.name}, ${facts.role} at ${facts.company} — ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
  }
  return `${facts.name}, ${facts.role} — ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
}

/** Quick sanity flags for admin/debug — not used to regenerate. */
export function deliveryIssues(roast: string, ctx: RoastDeliveryContext): string[] {
  const issues: string[] = [];
  const facts = resolveFacts(ctx);
  if (/\bfrom,\s/i.test(roast)) issues.push("stray-from-comma");
  if (/\b(designs|builds|manages)\s+\w/i.test(roast) && !facts.role.includes("designer")) {
    issues.push("verb-phrase-role");
  }
  if (roast.includes(`${facts.name} from`)) issues.push("name-includes-from");
  return issues;
}
