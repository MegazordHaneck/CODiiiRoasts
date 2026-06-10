import type { Intensity } from "../types";
import { AEC_STEREOTYPE_TROPES } from "../content/aec-stereotypes";

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
    "{name} — classic {noun}",
    "So {name}, the {noun}",
    "{name}, that {noun}",
    "Every {role} has a {noun} — yours is special, {name}.",
  ],
  nouns: [
    "render-to-field gap",
    "LOD slide deck",
    "AHJ review",
    "IFC Friday drop",
    "floating stair detail",
    "see-structural note",
    "or-equal submittal",
    "blame matrix",
    "entitlement timeline",
    "Revit recovery file",
    "OAC roundtable",
    "clash report",
    "VE that killed the facade",
    "permit set",
    "superintendent side-eye",
  ],
  punches: [
    "is the whole AEC industry in one PDF.",
    "is why design-bid-build should be design-bid-blame.",
    "is structural — your story isn't.",
    "just became a case study in coping.",
    "is why the trades have a group chat without you.",
    "reads like a stereotype — because it is.",
    "is MEP losing the ceiling war again.",
    "is architect site-visit cosplay in document form.",
    "is GC schedule fiction with better fonts.",
    "is proof the model and reality broke up.",
    "is why 'contractor shall verify' exists.",
    "could tank morale faster than concrete.",
  ],
};

const COMBO_CONTRACTOR = {
  hooks: ["Hi {name}! Your {noun}", "{name}, your {noun}", "Field truth, {name}: your {noun}"],
  nouns: [
    "mobilization on 50% DD",
    "RFI photo attachment",
    "issued-for-construction dare",
    "change order smile",
    "daily 'waiting on design'",
    "as-built fiction",
    "temp shoring",
    "buyout optimism",
  ],
  punches: [
    "is why supers trust tape measures more than architects.",
    "is design-bid-blame in hi-vis.",
    "is field code for 'we'll fight it out in the trench.'",
    "has more revisions than your patience.",
    "is the subcontractor stereotype come true.",
    "is why the spec is a novel nobody finished.",
  ],
};

const COMBO_NSFW = {
  hooks: [
    "{name}, your {noun}",
    "{name} — damn, your {noun}",
    "Mean AEC roast for {name}: your {noun}",
    "{name}, that {noun}",
    "Stereotype check, {name}: your {noun}",
    "I see you, {name} — your {noun}",
    "Late-night roast for {name}: your {noun}",
    "{name}, the trades are talking about your {noun}",
  ],
  nouns: [
    "architect render",
    "black-turtleneck schematic",
    "structural stamp-and-run",
    "MEP plenum surrender",
    "BIM LOD lie",
    "GC float ghost",
    "owner iconic-on-a-budget brief",
    "600-page door spec",
    "Navisworks divorce",
    "Friday IFC drop",
    "see-structural shrug",
    "Procore screaming wall",
    "revision cloud weather system",
    "coordination WTF meeting",
    "interpretive dance detail",
    "hammer-swing red-squirrel energy",
    "AI replacement slide",
    "AHJ boss fight",
    "entitlement fan fiction",
    "punch list hate mail",
    "floating stair delusion",
    "or-equal submittal trap",
  ],
  punches: [
    "is the whole conference laughing at your discipline.",
    "is why ironworkers drink and models cry.",
    "is design vs field beef in one PDF.",
    "is AHJ energy — petty and undefeated.",
    "is aggressively AEC and meaner than nuclear.",
    "is why subs put you on mute.",
    "is entitlement astrology with a stamp.",
    "is VE deleting the only thing the owner could spell.",
    "is floating-stair physics rage.",
    "is specifier door-swing mythology.",
    "is superintendent therapy in document form.",
    "is three beats of polite 'what the F@#% is this?'",
    "is #AI'sB#@$H energy with a title block.",
    "is constructibility's villain origin story.",
    "is why 'minor' needs a support group.",
  ],
};

const COMBO_LIGHT = {
  hooks: ["Hi {name}! Your {noun}", "Hey {name} — your {noun}", "{name}, classic {noun}"],
  nouns: [
    "Revit hiccup excuse",
    "coordination call with no model",
    "FINAL folder",
    "AHJ comment letter",
    "sheet index",
    "VE option",
    "Teams 'available' status",
    "markup cloud",
  ],
  punches: [
    "is peak AEC cosplay.",
    "is why PDF means Pretty Frustrating Document.",
    "is design-bid-blame waiting to happen.",
    "is giving architect-never-on-site energy.",
    "could be a sitcom pilot.",
    "is MEP losing the ceiling war again.",
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
  role = "AEC professional",
): string {
  const combo =
    intensity === "nsfw"
      ? COMBO_NSFW
      : intensity === "nuclear"
        ? COMBO_NUCLEAR
        : intensity === "contractor"
          ? COMBO_CONTRACTOR
          : COMBO_LIGHT;

  const hook = pick(combo.hooks, seed)
    .replace(/\{name\}/g, name)
    .replace(/\{role\}/g, role)
    .replace(/\{noun\}/g, pick(combo.nouns, seed + 7));
  const punch = pick(combo.punches, seed + 13);
  const trope = pick(AEC_STEREOTYPE_TROPES, seed + 19);
  if (seed % 5 === 0) {
    return `${hook} ${punch} (${trope} energy.)`;
  }
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
  ...AEC_STEREOTYPE_TROPES.map((t) => `Lean into stereotype: ${t}.`),
  "Architect: render people on roof, no headroom in section, Horizon/Nexus project name.",
  "Architect: curtain wall jewelry, waterproofing rumor, floating stair, VE killed flashing.",
  "Structural: pin connection religion, stamp Friday, calcs vs sheet fiction.",
  "Structural: SEE STRUCTURAL shrug, verify in field autobiography, Friday stamp Monday deflection.",
  "MEP design: plenum war lost, Copy of Copy of Duct family, ceiling height lie.",
  "MEP design: NOT FOR CONSTRUCTION honesty, equipment schedule vs field measure.",
  "BIM/VDC: LOD 500 slide LOD 200 ceiling, clash names as comedy, federated model divorce.",
  "BIM/VDC: BEP folklore, issue tracker screaming, Navisworks group therapy.",
  "Superintendent: daily report waiting on design, tape measure vs sketch, RFI photo A-101 wrong.",
  "Superintendent: mobilized on wrong sheet, field sketch art, sequence vs weather.",
  "PM/CM: meeting breeds meeting, RAID screams DESIGN, Gantt astrology.",
  "PM/CM: lookahead fiction, float ghosted, recovery narrative with catering.",
  "GC: float ghosted, blame matrix, recovery narrative audiobook.",
  "Civil: invert spot lied camera didn't, grading poetry as-built mud, utility phone tree.",
  "Envelope: air barrier rumor at laps, mockup passed field failed, water left review.",
  "Regulatory: petty redlines undefeated, plan check is real schedule, final boss.",
  "Commissioning: functional test surfaces sins, Cx checklist epic, decommission optimism.",
  "Sustainability: LEED slides vs meter prose, credit treadmill, VE killed envelope.",
  "Estimator: takeoff assumes truth, bid art buyout tragedy, assumptions folklore.",
  "MEP trade: own the plenum, TAB truth coordination fiction, last in plenum first in blame.",
  "Owner: iconic vision, strip-mall budget, owner directive curse.",
  "Contractor: RFI lifestyle, mobilized on wrong sheet, supers vs design.",
  "Specifier: door hardware religion, or-equal trap, 600 pages of pain.",
  "Contrast intro vs superintendent reality.",
  "AHJ / permit / entitlement final boss.",
  "Friday 4:58 transmittal damage.",
  "Company name + discipline cliché in one punch.",
  "If nuclear: one trope, one brutal line — single sentence.",
  "No generic workflow chaos — insider AEC only.",
];
