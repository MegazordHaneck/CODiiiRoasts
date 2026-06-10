import type { Intensity } from "../types";
import { ARCHITECT_ROAST_LINES } from "./industry/architectVariety";
import { BIM_ROAST_LINES } from "./industry/bimVariety";
import { MEP_ROAST_LINES } from "./industry/mepVariety";
import { PM_ROAST_LINES } from "./industry/pmVariety";
import { STRUCTURAL_ROAST_LINES } from "./industry/structuralVariety";
import { SUPERINTENDENT_ROAST_LINES } from "./industry/superintendentVariety";
import {
  CIVIL_ROAST_LINES,
  COMMISSIONING_ROAST_LINES,
  ENVELOPE_ROAST_LINES,
  ESTIMATOR_ROAST_LINES,
  MEP_TRADE_ROAST_LINES,
  REGULATORY_ROAST_LINES,
  SUSTAINABILITY_ROAST_LINES,
} from "./industry/tradeVariety";
import { getBurnExtensions } from "./burn-extensions";

export type RolePoolKey =
  | "architect"
  | "engineer"
  | "contractor"
  | "gc"
  | "owner"
  | "bim manager"
  | "pm"
  | "specifier"
  | "civil"
  | "mep"
  | "mep_trade"
  | "envelope"
  | "regulatory"
  | "superintendent"
  | "commissioning"
  | "sustainability"
  | "estimator"
  | "default";

/** Universal lines work for any role — largest pool for expo volume */
const UNIVERSAL: Record<Intensity, string[]> = {
  light: [
    "Hi {name}! Your calendar is just RFIs in a trench coat.",
    "Hi {name}! You treat 'quick sync' like it legally binds the trades.",
    "Hi {name}! Your inbox has more versions than the drawing set.",
    "Hi {name}! You say 'one more review' the way others say 'goodnight.'",
    "Hi {name}! Your coordination style is cc everyone and pray.",
    "Hi {name}! You rename files like it's a coping mechanism.",
    "Hi {name}! Your team's alignment is mostly vibes and shared trauma.",
    "Hi {name}! You schedule meetings the way casinos schedule hope.",
    "Hi {name}! Your redlines are polite — your deadlines are not.",
    "Hi {name}! You treat shop drawings like fan fiction.",
    "Hi {name}! Your project folder is where PDFs go to argue.",
    "Hi {name}! You call it agile — the field calls it improvisation.",
    "Hi {name}! Your spec says 'as indicated' — nothing is indicated.",
    "Hi {name}! You trust the model until the model betrays you beautifully.",
    "Hi {name}! Your closeout binder is a future archaeological dig.",
    "Hi {name}! You send 'final' emails with the confidence of a lottery winner.",
    "Hi {name}! Your punch list is basically fan mail from reality.",
    "Hi {name}! You negotiate extensions like it's a professional sport.",
    "Hi {name}! Your site photos always include one mysterious bucket.",
    "Hi {name}! You treat VE like a personality test for the team.",
  ],
  contractor: [
    "Hi {name}! You mobilized on optimism and a drawing from 2019.",
    "Hi {name}! Your RFI subject lines read like horror titles.",
    "Hi {name}! You found the clash in the field — where it always lives.",
    "Hi {name}! Your daily report is 'waiting on design' in bold.",
    "Hi {name}! You treat concrete pours like weather — unpredictable.",
    "Hi {name}! Your submittal log has its own zip code.",
    "Hi {name}! You schedule trades like Tetris — with feelings.",
    "Hi {name}! Your safety meeting doubles as group therapy.",
    "Hi {name}! You measure twice, curse once, RFI always.",
    "Hi {name}! Your as-builts are aspirational literature.",
    "Hi {name}! You call it minor — the invoice calls it heritage.",
    "Hi {name}! Your crane picks are planned; your nerves are not.",
    "Hi {name}! You trust the survey until the survey laughs back.",
    "Hi {name}! Your temp heat is permanent — like your RFIs.",
    "Hi {name}! You coordinate subs the way cats coordinate — suddenly.",
    "Hi {name}! Your permit wall is decorative at this point.",
    "Hi {name}! You say 'we're close' — close to what, exactly?",
    "Hi {name}! Your tool box talk includes passive aggression training.",
    "Hi {name}! You treat rain days like plot twists in a novel.",
    "Hi {name}! Your field sketch is art — wrong, but art.",
  ],
  nuclear: [
    "Hi {name}! You don't manage chaos — you franchise it.",
    "Hi {name}! Your schedule is fiction with a Gantt accent.",
    "Hi {name}! You export problems faster than CAD exports PDFs.",
    "Hi {name}! Your 'minor revision' just became someone's quarter.",
    "Hi {name}! You treat coordination like jazz — nobody knows the key.",
    "Hi {name}! Your deliverable is late and somehow still wrong.",
    "Hi {name}! You promise clarity — the drawing set promises drama.",
    "Hi {name}! Your team's coping strategy is dark humor and redlines.",
    "Hi {name}! You don't close loops — you tie them in knots.",
    "Hi {name}! Your budget optimism should be studied in labs.",
    "Hi {name}! You call it value engineering — they call it sabotage.",
    "Hi {name}! Your model and reality broke up — messy divorce.",
    "Hi {name}! You lead meetings that create more meetings — inception.",
    "Hi {name}! Your closeout is a myth told to children.",
    "Hi {name}! You treat RFIs like collectible cards.",
    "Hi {name}! Your Friday email at 4:59 PM is a war crime.",
    "Hi {name}! You don't do handoffs — you do hot potatoes.",
    "Hi {name}! Your standards are high — your timing is criminal.",
    "Hi {name}! You built a career on 'we'll sort it in the field.'",
    "Hi {name}! Your coordination matrix is just blame, color-coded.",
    "Hi {name}! You say 'approved' — the field hears 'good luck.'",
    "Hi {name}! Your project's theme song is sirens and sighing.",
    "Hi {name}! You treat deadlines like suggestions from a hat.",
    "Hi {name}! Your whole workflow is a cautionary tale.",
    "Hi {name}! You don't resolve clashes — you adopt them.",
    "Hi {name}! Your optimism is structural — the building is not.",
    "Hi {name}! You deliver surprises — none of them are fun.",
    "Hi {name}! Your team's Slack is just screaming in emoji.",
    "Hi {name}! You call it done — reality files an appeal.",
    "Hi {name}! Your legacy is RFIs that outlive us all.",
  ],
  nsfw: [],
};

const ROLE_POOLS: Record<RolePoolKey, Partial<Record<Intensity, string[]>>> = {
  architect: {
    light: ARCHITECT_ROAST_LINES.light,
    contractor: ARCHITECT_ROAST_LINES.contractor,
    nuclear: ARCHITECT_ROAST_LINES.nuclear,
    nsfw: ARCHITECT_ROAST_LINES.nsfw,
  },
  engineer: {
    light: STRUCTURAL_ROAST_LINES.light,
    contractor: STRUCTURAL_ROAST_LINES.contractor,
    nuclear: STRUCTURAL_ROAST_LINES.nuclear,
    nsfw: [],
  },
  contractor: {
    light: [
      "Hi {name}! Every RFI is personal — respect.",
      "Hi {name}! You treat change orders like greeting cards.",
    ],
    contractor: [
      "Hi {name}! You mobilized before the ink dried.",
      "Hi {name}! Your crew trusts you — the drawings don't.",
    ],
    nuclear: [
      "Hi {name}! Your schedule says done — punch list says Netflix series.",
      "Hi {name}! You don't read drawings — you negotiate with them.",
      "Hi {name}! Your daily report: still waiting on design, still heroic.",
      "Hi {name}! You build fast — design builds mysteries.",
      "Hi {name}! Your temp shoring is permanent — like your RFIs.",
      "Hi {name}! You treat tolerances like suggestions from a friend.",
    ],
  },
  gc: {
    light: PM_ROAST_LINES.light,
    contractor: PM_ROAST_LINES.contractor,
    nuclear: PM_ROAST_LINES.nuclear,
    nsfw: [],
  },
  owner: {
    light: [
      "Hi {name}! Champagne taste, soda budget — iconic.",
      "Hi {name}! Your 'quick question' is never quick.",
    ],
    contractor: [
      "Hi {name}! Scope creep is your cardio.",
      "Hi {name}! VE is your plot twist — everyone's the victim.",
    ],
    nuclear: [
      "Hi {name}! Landmark vision, strip-mall budget — bold.",
      "Hi {name}! Your change order smile hides six weeks of pain.",
      "Hi {name}! You want certainty — you fund chaos beautifully.",
      "Hi {name}! Your approval process is performance art.",
    ],
  },
  "bim manager": {
    light: BIM_ROAST_LINES.light,
    contractor: BIM_ROAST_LINES.contractor,
    nuclear: BIM_ROAST_LINES.nuclear,
    nsfw: [],
  },
  pm: {
    light: PM_ROAST_LINES.light,
    contractor: PM_ROAST_LINES.contractor,
    nuclear: PM_ROAST_LINES.nuclear,
    nsfw: [],
  },
  specifier: {
    light: [
      "Hi {name}! Your spec has more addenda than chapters.",
      "Hi {name}! 'Or equal' is doing gymnastics in Division 08.",
    ],
    contractor: [
      "Hi {name}! Three pages to say use the good one — art.",
      "Hi {name}! Subs read 'or equal' as 'cheapest wins.'",
    ],
    nuclear: [
      "Hi {name}! Master spec vs addenda — custody battle.",
      "Hi {name}! 'Contractor shall verify' — the industry's goodbye.",
      "Hi {name}! Your substitution clause is a escape hatch factory.",
    ],
  },
  civil: {
    light: CIVIL_ROAST_LINES.light,
    contractor: CIVIL_ROAST_LINES.contractor,
    nuclear: CIVIL_ROAST_LINES.nuclear,
    nsfw: [],
  },
  mep: {
    light: MEP_ROAST_LINES.light,
    contractor: MEP_ROAST_LINES.contractor,
    nuclear: MEP_ROAST_LINES.nuclear,
    nsfw: [],
  },
  mep_trade: {
    light: MEP_TRADE_ROAST_LINES.light,
    contractor: MEP_TRADE_ROAST_LINES.contractor,
    nuclear: MEP_TRADE_ROAST_LINES.nuclear,
    nsfw: [],
  },
  envelope: {
    light: ENVELOPE_ROAST_LINES.light,
    contractor: ENVELOPE_ROAST_LINES.contractor,
    nuclear: ENVELOPE_ROAST_LINES.nuclear,
    nsfw: [],
  },
  regulatory: {
    light: REGULATORY_ROAST_LINES.light,
    contractor: REGULATORY_ROAST_LINES.contractor,
    nuclear: REGULATORY_ROAST_LINES.nuclear,
    nsfw: [],
  },
  superintendent: {
    light: SUPERINTENDENT_ROAST_LINES.light,
    contractor: SUPERINTENDENT_ROAST_LINES.contractor,
    nuclear: SUPERINTENDENT_ROAST_LINES.nuclear,
    nsfw: [],
  },
  commissioning: {
    light: COMMISSIONING_ROAST_LINES.light,
    contractor: COMMISSIONING_ROAST_LINES.contractor,
    nuclear: COMMISSIONING_ROAST_LINES.nuclear,
    nsfw: [],
  },
  sustainability: {
    light: SUSTAINABILITY_ROAST_LINES.light,
    contractor: SUSTAINABILITY_ROAST_LINES.contractor,
    nuclear: SUSTAINABILITY_ROAST_LINES.nuclear,
    nsfw: [],
  },
  estimator: {
    light: ESTIMATOR_ROAST_LINES.light,
    contractor: ESTIMATOR_ROAST_LINES.contractor,
    nuclear: ESTIMATOR_ROAST_LINES.nuclear,
    nsfw: [],
  },
  default: {
    light: UNIVERSAL.light,
    contractor: UNIVERSAL.contractor,
    nuclear: UNIVERSAL.nuclear,
    nsfw: [],
  },
};

const INTENSITIES: Intensity[] = ["light", "contractor", "nuclear", "nsfw"];

export function getTemplatePool(
  roleKey: RolePoolKey,
  intensity: Intensity,
  industryHatId?: string,
): string[] {
  const roleLines = ROLE_POOLS[roleKey]?.[intensity] ?? [];
  const universal = UNIVERSAL[intensity] ?? [];
  const extra = getBurnExtensions(roleKey, intensity, industryHatId);
  return [...new Set([...roleLines, ...universal, ...extra])];
}

export function countTemplates(roleKey: RolePoolKey): number {
  return INTENSITIES.reduce((sum, i) => sum + getTemplatePool(roleKey, i).length, 0);
}
