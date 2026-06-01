import type { Intensity } from "../types";

/** Phrases that read as “same roast again” — block in API + client */
export const BANNED_ROAST_PHRASES = [
  "compliance scan needed a coffee",
  "codiii's compliance scan",
  "codiii compliance scan",
  "needed a coffee after your workflow",
  "coordination confidence is lower",
  "even codiii",
  "your workflow is pure chaos",
  "back-to-back coordination meetings and crying in navisworks",
];

const OPENERS = [
  (who: string, role: string, tail: string) =>
    `Oh hi ${who}! You're a ${role} — so ${tail}`,
  (who: string, role: string, tail: string) =>
    `${who}, a ${role}? That tracks — ${tail}`,
  (who: string, _role: string, tail: string) =>
    `Hey ${who} — honestly, ${tail}`,
  (who: string, role: string, tail: string) =>
    `So ${who} does ${role} work? ${tail.charAt(0).toUpperCase()}${tail.slice(1)}`,
  (who: string, role: string, tail: string) =>
    `${who}, ${role} — which explains why ${tail}`,
  (who: string, _role: string, tail: string) =>
    `Listen ${who}: ${tail.charAt(0).toUpperCase()}${tail.slice(1)}`,
  (who: string, role: string, tail: string) =>
    `Quick one, ${who} — as a ${role}, ${tail}`,
];

const COMBO_NUCLEAR = {
  hooks: [
    "{name}, your {noun}",
    "{name} — your {noun}",
    "So {name}, the {noun}",
    "{name}, that {noun}",
  ],
  nouns: [
    "RFI queue",
    "submittal log",
    "coordination plan",
    "drawing set",
    "Friday email",
    "lookahead",
    "clash report",
    "VE session",
    "site logistics plan",
    "closeout binder",
    "buyout spreadsheet",
    "punch list",
    "OAC agenda",
    "BIM execution plan",
    "permit set",
  ],
  punches: [
    "isn't a plan — it's a threat letter to productivity.",
    "has more drama than the project budget.",
    "is why the field drinks on Tuesdays.",
    "should be studied by future civilizations.",
    "is proof optimism can be hazardous.",
    "just became someone's entire quarter.",
    "is how you turn peace into paperwork.",
    "could tank a stock portfolio.",
    "is the reason subs don't answer the phone.",
    "reads like a roast already — so here we are.",
    "is structural — the building isn't.",
    "is why 'minor' is doing heavy lifting.",
  ],
};

const COMBO_CONTRACTOR = {
  hooks: ["Hi {name}! Your {noun}", "{name}, your {noun}"],
  nouns: [
    "mobilization date",
    "daily report",
    "toolbox talk",
    "as-built sketch",
    "temp power plan",
    "concrete pour sequence",
    "RFI thread",
    "schedule update",
  ],
  punches: [
    "is optimistic — the drawings are not.",
    "is basically 'waiting on design' with confidence.",
    "could win an award for creative patience.",
    "is why the superintendent side-eyes you.",
    "has more revisions than the architectural set.",
    "is field code for 'we'll figure it out.'",
  ],
};

const COMBO_LIGHT = {
  hooks: ["Hi {name}! Your {noun}", "Hey {name} — your {noun}"],
  nouns: [
    "inbox",
    "meeting cadence",
    "file naming",
    "coordination call",
    "markup style",
    "calendar",
  ],
  punches: [
    "is giving 'we'll circle back' energy.",
    "needs its own project manager.",
    "is why PDF stands for Pretty Frustrating Document.",
    "is a lifestyle at this point.",
    "could be a sitcom.",
  ],
};

export function normalizeRoast(roast: string): string {
  return roast.trim().toLowerCase().replace(/\s+/g, " ");
}

export function isRoastRepetitive(roast: string, usedRoasts: string[]): boolean {
  const n = normalizeRoast(roast);
  if (!n) return true;

  for (const banned of BANNED_ROAST_PHRASES) {
    if (n.includes(banned)) return true;
  }

  for (const prev of usedRoasts) {
    if (tooSimilar(n, normalizeRoast(prev))) return true;
  }

  return false;
}

function tooSimilar(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length > 20 && b.length > 20 && (a.includes(b) || b.includes(a))) return true;

  const wordsA = tokenSet(a);
  const wordsB = tokenSet(b);
  if (wordsA.size === 0 || wordsB.size === 0) return false;

  let overlap = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) overlap += 1;
  }
  const ratio = overlap / Math.min(wordsA.size, wordsB.size);
  return ratio >= 0.58;
}

function tokenSet(text: string): Set<string> {
  return new Set(
    text
      .split(/\W+/)
      .filter((w) => w.length > 3)
      .map((w) => w.replace(/s$/, "")),
  );
}

function pick<T>(arr: T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

/** Infinite-ish offline variety when template pool is exhausted */
export function generateCombinatorialRoast(
  name: string,
  intensity: Intensity,
  seed: number,
): string {
  const combo =
    intensity === "nuclear"
      ? COMBO_NUCLEAR
      : intensity === "contractor"
        ? COMBO_CONTRACTOR
        : COMBO_LIGHT;

  const hook = pick(combo.hooks, seed)
    .replace(/\{name\}/g, name)
    .replace(/\{noun\}/g, pick(combo.nouns, seed + 7));
  const punch = pick(combo.punches, seed + 13);
  return `${hook} ${punch}`;
}

export function wrapIntroRoast(
  who: string,
  role: string,
  punchline: string,
  salt = 0,
): string {
  const tail = punchline.replace(/^Hi [^!]+!\s*/i, "");
  const normalized =
    tail.length > 0
      ? `${tail.charAt(0).toLowerCase()}${tail.slice(1)}`
      : "the trades have formed a support group because of you.";
  const opener = OPENERS[salt % OPENERS.length];
  return opener(who, role, normalized);
}

export const CREATIVE_ANGLES = [
  "Compare their habit to a specific AEC document (RFI log, submittal, clash report, OAC deck).",
  "Roast the gap between what they said in intro and what the field actually sees.",
  "Use one construction-site metaphor — steel, mud, crane, pour, then the insult.",
  "Punch schedule fantasy vs reality — no CODiii meta jokes.",
  "Call out a painfully specific deliverable they'd send Friday at 4:58 PM.",
  "Mock an overconfident email they definitely sent this week.",
  "Reference their company or role if mentioned — make it feel personal.",
  "Fake sympathy, then twist the knife — conference tone.",
  "Pretend to praise their process, then reveal why it's chaos.",
  "Compare their workflow to a bad subcontractor habit.",
  "Roast coordination theater — meetings, matrices, color-coded blame.",
  "Target BIM/drawing/submittal pain matching their discipline.",
  "Use a one-liner opener, not always 'that explains why'.",
  "If nuclear intensity: be blunt, memorable, no soft landing.",
  "Reference something they literally said in the intro transcript.",
  "Invent a fake metric ('RFI velocity', 'redline G-force') and roast it.",
  "Roast handoffs between design and field — who's losing.",
  "Mock their version control or file naming if implied.",
  "Compare their project to a reality show — specific episode energy.",
  "End on a punchy sentence under 12 words.",
];
