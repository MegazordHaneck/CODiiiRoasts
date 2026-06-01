import type { Intensity } from "../../types";
import { dimensionalOutputsForHatGroup, type IndustryHat } from "./loadHats";
import { getIndustryHat } from "./matchHat";

function pick<T>(arr: T[], seed: number): T {
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

function jargonSnippet(hat: IndustryHat, seed: number): string {
  const dims = dimensionalOutputsForHatGroup(hat.hatGroup);
  const kw = hat.keywords.filter((k) => k.length > 2);
  const fromDim = dims.length ? pick(dims, seed) : null;
  const fromKw = kw.length ? pick(kw, seed + 3) : hat.label;
  return fromDim ?? fromKw;
}

const GROUP_MEAN: Record<string, string[]> = {
  design_consultant: [
    `{name}, as a {label}, your revision clouds have revision clouds. Your coordination meetings are people politely asking "what the F@#% is this?" about your {jargon}. And your details? Less constructible intent, more interpretive dance.`,
    `{name}, you sell design intent on slides — the field buys RFIs. Your {jargon} package is pretty; your dimension strings are "see model." And when we replace you with AI? #AI'sB#@$H energy.`,
  ],
  engineering_consultant: [
    `{name}, your calcs are church — your {jargon} on the sheet is fan fiction. You stamp Friday; Monday inherits physics and profanity. And "verify in field" is your entire personality in three words.`,
    `{name}, as {label}, you love a pin connection and a SEE STRUCTURAL bubble. Your load path is clear in your heart and missing in the PDF. The ironworkers send their regards — and their RFIs.`,
  ],
  specialty_consultant: [
    `{name}, you're the {label} everyone invites late and pays early. Your report on {jargon} is 200 pages; the detail on the sheet is a shrug. And the trades? Still building the previous revision.`,
  ],
  stakeholder: [
    `{name}, you want iconic on a budget that whispers strip mall. Your "quick question" email has twelve bullets and a new wing. And your VE smile deleted the only thing you could pronounce.`,
  ],
  regulatory: [
    `{name}, you're the {label} — petty, undefeated, and holding the permit. Your comments on {jargon} read like a breakup letter from bureaucracy. And the design team calls you "final boss" without laughing.`,
  ],
  preconstruction: [
    `{name}, your buyout on {jargon} is optimism in Excel. Your precon meeting is where subs learn the drawings lie. And your "we assumed" folder? It's legendary.`,
  ],
  gc_field: [
    `{name}, you promised float — float ghosted everyone. Your OAC on {jargon} is RFIs wearing a tie. And your weekly recovery speech? Fiction with logos.`,
  ],
  structural_site_trade: [
    `{name}, you mobilized on drawings that were wrong in the printer. Your {jargon} install is art; your coordination with design is MMA. And your daily report still says waiting on design — religion.`,
  ],
  envelope_trade: [
    `{name}, your air barrier continuity is a rumor. Your {jargon} detail is jewelry; your field laps are a cry for help. And water? Water found the gap and sent a thank-you note.`,
  ],
  interior_trade: [
    `{name}, your drywall scope on {jargon} is "as shown" — nothing is shown. Your ceiling grid is level; your ceiling height wasn't. And the architect? On a roof somewhere, laughing.`,
  ],
  mep_trade: [
    `{name}, your {jargon} rough-in fought the structure and lost. Your coordination meeting is MEP, architect, and regret in one room. And your TAB report? That's the epilogue.`,
  ],
  mep_subtrade: [
    `{name}, you're the {label} who shows up after everyone else picked the plenum. Your {jargon} submittal is "or equal" cosplay. And the controls integrator blames you — correctly.`,
  ],
  fire_protection_trade: [
    `{name}, your sprinkler head layout is poetry; your access panels are a joke. Your {jargon} hydraulic calc is fine — the ceiling isn't. And the AHJ? Smiling. Dangerously.`,
  ],
  conveyance_specialty: [
    `{name}, your elevator shop drawings are late and vertical. Your {jargon} pit dimensions were "coordinated" — in a dream. And the architect discovered the shaft last Tuesday.`,
  ],
  site_civil_trade: [
    `{name}, your grading on {jargon} is right until it rains. Your invert spot lied; the camera doesn't. And the landscape architect says it's "mostly planting."`,
  ],
  demolition_abatement: [
    `{name}, you swing a hammer like a F@#%N red squirrel — respectfully, {label}. Your abatement report is thorough; your surprises are not. And design? Still on sheet A-101.`,
  ],
  operations: [
    `{name}, you run the building — you inherit every design sin in {jargon}. Your O&M manual is a novel; your Monday is a fire drill. And the warranty? A suggestion.`,
  ],
};

const GROUP_SHORT: Record<string, Record<Intensity, string[]>> = {
  design_consultant: {
    light: ["Hi {name}! As {label}, your {jargon} drawing set has more clouds than weather radar."],
    contractor: ["Hi {name}! Your {jargon} issue for construction is a dare with a title block."],
    nuclear: ["Hi {name}! You sell minimalism — your {jargon} revisions are maximalist trauma."],
    nsfw: [],
  },
  gc_field: {
    light: ["Hi {name}! As {label}, your lookahead on {jargon} is astrology with logos."],
    contractor: ["Hi {name}! Your buyout assumed the architect would stop — cute."],
    nuclear: ["Hi {name}! You don't run jobs — you host blame festivals with concrete."],
    nsfw: [],
  },
  mep_trade: {
    light: ["Hi {name}! Your {jargon} coordination call is three trades and one ceiling height lie."],
    contractor: ["Hi {name}! Your rough-in on {jargon} is where plenum dreams go to die."],
    nuclear: ["Hi {name}! Your TAB report is the truth — your coordination was fiction."],
    nsfw: [],
  },
  regulatory: {
    light: ["Hi {name}! As {label}, your comment letter on {jargon} is the real schedule driver."],
    contractor: ["Hi {name}! Your plan check on {jargon} is petty — and undefeated."],
    nuclear: ["Hi {name}! You're the final boss of {jargon} — and you know it."],
    nsfw: [],
  },
};

function fillTemplate(template: string, name: string, hat: IndustryHat, seed: number): string {
  return template
    .replace(/\{name\}/g, name)
    .replace(/\{label\}/g, hat.label)
    .replace(/\{jargon\}/g, jargonSnippet(hat, seed));
}

/** Burns keyed to AECOHats — every matched hat gets group + label-specific lines. */
export function getIndustryHatBurns(hatId: string, intensity: Intensity, name = "{name}", seed = 0): string[] {
  const hat = getIndustryHat(hatId);
  if (!hat) return [];

  const out: string[] = [];
  const group = hat.hatGroup;

  const mean = GROUP_MEAN[group];
  if (mean?.length && (intensity === "nsfw" || intensity === "nuclear")) {
    for (let i = 0; i < mean.length; i++) {
      out.push(fillTemplate(mean[i], name, hat, seed + i));
    }
  }

  const short = GROUP_SHORT[group]?.[intensity] ?? [];
  for (let i = 0; i < short.length; i++) {
    out.push(fillTemplate(short[i], name, hat, seed + i + 10));
  }

  // Label-specific one-liner for every hat
  out.push(
    `Hi {name}! You're a ${hat.label} — so of course your ${jargonSnippet(hat, seed + 99)} story is never boring.`.replace(
      /\{name\}/g,
      name,
    ),
  );

  return out;
}

export function formatIndustryContextForPrompt(hatId: string | undefined): string {
  const hat = getIndustryHat(hatId);
  if (!hat) return "";
  const jargon = [
    ...hat.keywords.slice(0, 10),
    ...dimensionalOutputsForHatGroup(hat.hatGroup).slice(0, 6),
  ].slice(0, 14);
  return [
    `Industry role (hat): ${hat.label} [${hat.id} / ${hat.hatGroup}].`,
    hat.description ? `Role context: ${hat.description}` : "",
    `Weave in real jargon where natural: ${jargon.join(", ")}.`,
    `Doc focus: ${(hat.docClassFocus ?? []).join(", ")}.`,
  ]
    .filter(Boolean)
    .join("\n");
}
