import type { Intensity } from "../types";
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
    light: [
      "Hi {name}! 'Final' is your favorite suggestion.",
      "Hi {name}! Minimalism is your aesthetic — revisions are your hobby.",
      "Hi {name}! Your stair details have more plot twists than HBO.",
    ],
    contractor: [
      "Hi {name}! The stair moved again — the field felt it spiritually.",
      "Hi {name}! Your design intent is clear — the dimensions are optional.",
      "Hi {name}! You sketch beauty — someone else owns constructability.",
    ],
    nuclear: [
      "Hi {name}! Fourteen stair revisions and you still call it minimal.",
      "Hi {name}! Your sheet index is a novel — the building is a footnote.",
      "Hi {name}! You don't value engineer — you value surprise everyone.",
      "Hi {name}! Your renderings are flawless — your details are fan fiction.",
      "Hi {name}! You treat door swings like a philosophical debate.",
      "Hi {name}! Your ceiling plan is where hope goes to die.",
      "Hi {name}! You design landmarks — the budget designs reality checks.",
      "Hi {name}! Your revision cloud is basically weather on the sheet.",
    ],
  },
  engineer: {
    light: [
      "Hi {name}! Your redlines have redlines — it's turtles all the way down.",
      "Hi {name}! Blue text is your love language.",
    ],
    contractor: [
      "Hi {name}! The drawings were wrong eight minutes after mobilization.",
      "Hi {name}! You found the error — after the concrete did.",
    ],
    nuclear: [
      "Hi {name}! Your calcs are fine — the drawings are cosplaying as calcs.",
      "Hi {name}! You stamp Friday — Monday inherits physics.",
      "Hi {name}! 'Verify in field' is your autobiography.",
      "Hi {name}! Your detail calls out everything except the actual problem.",
      "Hi {name}! You treat load paths like suggestions.",
      "Hi {name}! Your peer review is just trauma bonding with math.",
    ],
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
    light: [
      "Hi {name}! Your coordination meeting has a pre-game show.",
      "Hi {name}! Your submittal log is a lifestyle.",
    ],
    contractor: [
      "Hi {name}! Float is a concept you mention fondly in the past tense.",
      "Hi {name}! Your OAC deck is RFIs wearing business casual.",
    ],
    nuclear: [
      "Hi {name}! You promised float — float ghosted everyone.",
      "Hi {name}! You herd cats — the cats are licensed trades.",
      "Hi {name}! Your master schedule is fan fiction with logos.",
      "Hi {name}! You don't run jobs — you host ongoing interventions.",
      "Hi {name}! Your buyout is brave — your lookahead is poetry.",
    ],
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
    light: [
      "Hi {name}! Navisworks clashes are your social circle.",
      "Hi {name}! Your federated model is a soap opera.",
    ],
    contractor: [
      "Hi {name}! LOD on slides vs LOD in model — classic.",
      "Hi {name}! Your clash report is a cry for help in 3D.",
    ],
    nuclear: [
      "Hi {name}! LOD 400 on the deck, LOD 200 in the model.",
      "Hi {name}! You don't coordinate — you host panic in 3D.",
      "Hi {name}! Your clash names are funnier than the comedy channel.",
      "Hi {name}! The model lied — you're still surprised, adorable.",
    ],
  },
  pm: {
    light: [
      "Hi {name}! Action items breeding action items — nature is beautiful.",
      "Hi {name}! Your risk register is just 'design' highlighted.",
    ],
    contractor: [
      "Hi {name}! Gantt is green — field citations needed.",
      "Hi {name}! You minutes meetings — the meetings minute you.",
    ],
    nuclear: [
      "Hi {name}! Meetings about meetings — structural irony.",
      "Hi {name}! Your lookahead is astrology with logos.",
      "Hi {name}! You sell certainty — you deliver suspense.",
      "Hi {name}! Your RAID log is just screaming in columns.",
    ],
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
    light: [
      "Hi {name}! Your grading plan is poetry — your invert spot is a lie.",
      "Hi {name}! You treat the survey like a suggestion until something doesn't fit.",
    ],
    contractor: [
      "Hi {name}! Your utility coordination is a phone tree of despair.",
      "Hi {name}! Your paving section shows smooth — the pothole shows truth.",
    ],
    nuclear: [
      "Hi {name}! Your entitlement timeline is fan fiction with a stamp.",
      "Hi {name}! You call it sitework — the AHJ calls it content.",
    ],
  },
  mep: {
    light: [
      "Hi {name}! Your reflected ceiling plan is where MEP goes to hide.",
      "Hi {name}! You love a plenum — the plenum doesn't love you back.",
    ],
    contractor: [
      "Hi {name}! Your equipment submittal is 'or equal' gymnastics.",
      "Hi {name}! Your coordination on ceiling height is a war crime — professionally.",
    ],
    nuclear: [
      "Hi {name}! Your design drawings start with NOT FOR CONSTRUCTION — honest.",
      "Hi {name}! You coordinate MEP like jazz — nobody knows the key.",
    ],
  },
  mep_trade: {
    light: ["Hi {name}! Your rough-in is where design dreams go to die."],
    contractor: ["Hi {name}! Your TAB report is truth — your coordination was fiction."],
    nuclear: ["Hi {name}! You own the plenum — the architect thought it was decorative."],
  },
  envelope: {
    light: ["Hi {name}! Your air barrier detail is a rumor at the laps."],
    contractor: ["Hi {name}! Your cladding mock-up passed — the field failed."],
    nuclear: ["Hi {name}! Water found the gap — it left a review."],
  },
  regulatory: {
    light: ["Hi {name}! Your plan check comment is the real schedule."],
    contractor: ["Hi {name}! You are the AHJ — fear is justified."],
    nuclear: ["Hi {name}! Your redlines are petty — and undefeated."],
  },
  superintendent: {
    light: ["Hi {name}! Your daily huddle is stand-up about design."],
    contractor: ["Hi {name}! You trust the tape measure more than the architect."],
    nuclear: ["Hi {name}! You swing that hammer like a F@#%N red squirrel — respect."],
  },
  commissioning: {
    light: ["Hi {name}! Your functional test is where design sins surface."],
    contractor: ["Hi {name}! Your Cx checklist is longer than the O&M manual."],
    nuclear: ["Hi {name}! You commission systems — you decommission optimism."],
  },
  sustainability: {
    light: ["Hi {name}! Your LEED score is high — your envelope isn't."],
    contractor: ["Hi {name}! Your energy model is poetry — the meter is prose."],
    nuclear: ["Hi {name}! You sell carbon — you deliver RFIs."],
  },
  estimator: {
    light: ["Hi {name}! Your takeoff assumes the drawing is telling the truth."],
    contractor: ["Hi {name}! Your allowance for design revisions is cute."],
    nuclear: ["Hi {name}! Your bid is art — the buyout is tragedy."],
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
