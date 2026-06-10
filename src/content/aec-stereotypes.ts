import type { Intensity } from "../types";
import { ARCHITECT_ROAST_LINES } from "./industry/architectVariety";
import type { RolePoolKey } from "./roast-pools";

/**
 * AECO stereotype burns — inside jokes by discipline.
 * Merged into offline pools + guides live prompt tone via shared angles.
 */
export const AEC_STEREOTYPE_BURNS: {
  universal: Record<Intensity, string[]>;
  byRole: Partial<Record<RolePoolKey, Partial<Record<Intensity, string[]>>>>;
} = {
  universal: {
    light: [
      "Hi {name}! You treat the permit set like a suggestion until the AHJ gets petty.",
      "Hi {name}! Your coordination meeting is design, MEP, and GC passive-aggressing in 3D.",
      "Hi {name}! You say 'Revit hiccup' — the model didn't hiccup, it flatlined.",
      "Hi {name}! Your Procore inbox is just subs saying 'where's the answer.'",
      "Hi {name}! You call it design-bid-build — the field calls it design-bid-blame.",
      "Hi {name}! Your entitlement timeline is astrology with a planner's stamp.",
      "Hi {name}! You hide behind 'for review only' like it's a force field.",
      "Hi {name}! Your sheet index has more tabs than the project has decisions.",
      "Hi {name}! You treat the AHJ like a boss fight you didn't spec points for.",
      "Hi {name}! Your VE option always starts with 'delete the architect's favorite part.'",
      "Hi {name}! You schedule a coordination call — nobody brings the coordinated model.",
      "Hi {name}! Your as-built is a future archaeological dig labeled 'closeout.'",
    ],
    contractor: [
      "Hi {name}! You mobilized on the 50% DD set — bold for someone who likes lawsuits.",
      "Hi {name}! Your RFI asks which drawing lies least — classic AEC trust fall.",
      "Hi {name}! You treat 'issued for construction' like a dare from design.",
      "Hi {name}! Your superintendent speaks fluent sarcasm and broken BIM.",
      "Hi {name}! You found the clash in the field — where coordination goes to retire.",
      "Hi {name}! Your buyout assumes the architect stops revising — adorable.",
      "Hi {name}! You say 'that's in the spec' — the spec is a war novel nobody read.",
      "Hi {name}! Your temp power plan has more drama than the electrical one-line.",
      "Hi {name}! You coordinate concrete around design's last-minute radius change — hero?",
      "Hi {name}! Your daily report translation: still waiting on the people who don't visit site.",
    ],
    nuclear: [
      "Hi {name}! You're the reason 'contractor shall verify' exists — industry trauma in one clause.",
      "Hi {name}! Your design team draws beauty; your field team draws blood pressure.",
      "Hi {name}! You treat the GMP like a piñata — everyone's swinging, nothing falls out.",
      "Hi {name}! Your BIM execution plan is fiction — the federated model is a divorce.",
      "Hi {name}! You promise one more coordination pass — Navisworks files for bankruptcy.",
      "Hi {name}! Your OAC deck is four trades explaining why the architect isn't here.",
      "Hi {name}! You export IFC like you're exporting problems to future you.",
      "Hi {name}! Your permit set weight could qualify as structural load.",
      "Hi {name}! You built a career on gaps between render, model, and nail gun.",
      "Hi {name}! Your closeout is where warranties and grudges go to age together.",
    ],
    nsfw: [],
  },
  byRole: {
    architect: {
      light: ARCHITECT_ROAST_LINES.light,
      contractor: ARCHITECT_ROAST_LINES.contractor,
      nuclear: ARCHITECT_ROAST_LINES.nuclear,
      nsfw: ARCHITECT_ROAST_LINES.nsfw,
    },
    engineer: {
      light: [
        "Hi {name}! Your detail bubble says SEE STRUCTURAL — the field sees confusion.",
        "Hi {name}! You love a pin connection — gravity loves a lawsuit.",
        "Hi {name}! Your calc package is beautiful — your sketch on Sheet S-301 is the truth.",
      ],
      contractor: [
        "Hi {name}! You sized the beam for the load — not for the architect moving the column.",
        "Hi {name}! You stamp Friday at 4:58 — Monday inherits deflection and regret.",
        "Hi {name}! Your note 'verify in field' is the industry's collective shrug emoji.",
      ],
      nuclear: [
        "Hi {name}! Your factor of safety is fine — your communication safety factor is zero.",
        "Hi {name}! You detail every connection except the one the contractor actually builds wrong.",
        "Hi {name}! You're the reason RFIs ask if steel can be 'more structural.'",
      ],
      nsfw: [
        "Hi {name}! You stamp it like you're speed-running liability.",
        "Hi {name}! Your calcs are gospel — your dimensions on the sheet are fan fiction.",
      ],
    },
    contractor: {
      light: [
        "Hi {name}! Your truck sticker says 'Let us know when you're done designing.'",
        "Hi {name}! You measure with tape, laser, and pure spite when drawings disagree.",
        "Hi {name}! Your RFI attachment is a photo of the lie on Sheet A-101.",
      ],
      contractor: [
        "Hi {name}! You mobilized before the addendum — respect for chaos.",
        "Hi {name}! Your change order log is your autobiography.",
        "Hi {name}! You trust the survey until the survey disagrees with the architect's curb.",
      ],
      nuclear: [
        "Hi {name}! You don't read drawings — you negotiate with them like a union rep.",
        "Hi {name}! Your schedule says complete — your punch list says limited series.",
        "Hi {name}! You're why 'or equal' in the spec is a trap door.",
      ],
      nsfw: [
        "Hi {name}! Your toolbox talk is half safety, half roasting the design team.",
        "Hi {name}! You build reality — design keeps shipping alternate realities.",
      ],
    },
    gc: {
      light: [
        "Hi {name}! Your master schedule is a prayer circle with logos.",
        "Hi {name}! You run OAC like a talk show — everyone's a guest, nobody's accountable.",
        "Hi {name}! Your lookahead is fiction — your weekly recovery narrative is poetry.",
      ],
      contractor: [
        "Hi {name}! You promised float — float left the project in 2019.",
        "Hi {name}! Your blame matrix has more colors than the elevation.",
        "Hi {name}! You herd subs the way cats herd humans — they ignore you politely.",
      ],
      nuclear: [
        "Hi {name}! You don't build buildings — you host recurring blame with concrete.",
        "Hi {name}! Your buyout optimism could power a small city — incorrectly.",
        "Hi {name}! You're the human version of 'we're back on track' — never true.",
      ],
      nsfw: [
        "Hi {name}! You schedule trades like Tetris — the architect keeps adding L-shaped pieces.",
        "Hi {name}! Your job log is RFIs wearing a hard hat.",
      ],
    },
    owner: {
      light: [
        "Hi {name}! You want landmark architecture on a strip-mall budget — iconic behavior.",
        "Hi {name}! Your 'quick question' email has twelve bullet points and a new program.",
        "Hi {name}! You treat VE like a game show — everyone's prize is less scope.",
      ],
      contractor: [
        "Hi {name}! You approved the render — not the VE that removed the facade.",
        "Hi {name}! Your approval chain is longer than the entitlement process.",
        "Hi {name}! You want TCO certainty — you fund change orders like subscriptions.",
      ],
      nuclear: [
        "Hi {name}! You want certainty from an industry that sells suspense.",
        "Hi {name}! Your change order smile hides six weeks — the GC hides twelve.",
        "Hi {name}! You're why the team whispers 'owner directive' like it's a curse.",
      ],
      nsfw: [
        "Hi {name}! You want it open Tuesday — you funded design through next never.",
        "Hi {name}! Your budget is a mood — your expectations are a lifestyle.",
      ],
    },
    "bim manager": {
      light: [
        "Hi {name}! Your LOD slide says 400 — your model says 200 with confidence issues.",
        "Hi {name}! You federate models the way families federate drama — loudly.",
        "Hi {name}! Your clash test found 9,000 issues — you named three and prayed.",
      ],
      contractor: [
        "Hi {name}! Your coordination report is a horror anthology in isometric.",
        "Hi {name}! You ask architects to model door hardware — they model hope.",
        "Hi {name}! Your Navisworks session is group therapy with section boxes.",
      ],
      nuclear: [
        "Hi {name}! You don't coordinate — you document chaos in 3D with timestamps.",
        "Hi {name}! Your BEP promised peace — your clash matrix promised overtime.",
        "Hi {name}! You're why 'model-based' means 'based on coping.'",
      ],
      nsfw: [
        "Hi {name}! Your clash names are funnier than your last vacation.",
        "Hi {name}! LOD 500 on the deck, LOD 'we'll fix it' in the ceiling.",
      ],
    },
    pm: {
      light: [
        "Hi {name}! Your risk register just says DESIGN in red — honest at least.",
        "Hi {name}! You minutes the meeting — the meeting minutes you.",
        "Hi {name}! Your action items breed action items — productivity cosplay.",
      ],
      contractor: [
        "Hi {name}! Your Gantt is green — the superintendent's face is not.",
        "Hi {name}! You schedule a pre-install for the pre-coordination of the coordination.",
        "Hi {name}! Your RAID log is screaming organized into columns.",
      ],
      nuclear: [
        "Hi {name}! You sell certainty — you deliver meetings about uncertainty.",
        "Hi {name}! Your lookahead is astrology with a company logo.",
        "Hi {name}! You're why 'project controls' feels like an oxymoron.",
      ],
      nsfw: [
        "Hi {name}! Your standup could've been an email — it became three workshops.",
        "Hi {name}! You track float the way historians track Atlantis — fondly.",
      ],
    },
    specifier: {
      light: [
        "Hi {name}! Your spec is War and Peace — Division 08 is still wrong.",
        "Hi {name}! You wrote three pages on 'or equal' — subs read 'cheapest.'",
        "Hi {name}! Your master spec vs addenda — custody battle in PDF.",
      ],
      contractor: [
        "Hi {name}! You specify the good manufacturer — subs submit the brave one.",
        "Hi {name}! Your substitution clause is an escape hatch with landscaping.",
        "Hi {name}! You love 'contractor shall verify' — it's your love language.",
      ],
      nuclear: [
        "Hi {name}! Your spec section reads like you don't trust humanity — correct.",
        "Hi {name}! You built a maze — the submittal reviewer is Theseus without a map.",
        "Hi {name}! You're why door hardware has its own religion and still fails.",
      ],
      nsfw: [
        "Hi {name}! Your 600-page spec still won't tell you which way the door swings.",
        "Hi {name}! You specify like you're paid per conflicting requirement.",
      ],
    },
  },
};

/** Stereotype tropes for combinatorial / API angle hints */
export const AEC_STEREOTYPE_TROPES = [
  "architect render vs field reality",
  "structural stamp-and-run",
  "MEP ceiling height war",
  "GC schedule recovery lie",
  "BIM LOD slide vs model truth",
  "owner champagne vision / beer budget",
  "contractor RFI lifestyle",
  "specifier 400-page door",
  "AHJ as final boss",
  "Revit crash / model corruption",
  "design-bid-blame",
  "Friday 4:58 PM issue for construction",
  "VE deleting the pretty part",
  "superintendent vs never-on-site design",
  "Procore notification hell",
  "entitlement timeline fantasy",
  "floating stair / physics beef",
  "see structural / verify in field shrug",
  "submittal equals-or-cheaper",
  "OAC passive-aggressive roundtable",
  "revision clouds on revision clouds",
  "coordination meeting polite WTF",
  "detail section interpretive dance",
  "hammer like a F@#%N red squirrel",
  "replace architect with #AI'sB#@$H",
  "black turtleneck schematic energy",
  "Navisworks group therapy",
  "lien waiver Jenga",
  "commissioning vibes vs panic",
  "survey ignored until lien season",
  "temp shoring permanent tradition",
  "change order autobiography",
  "clash names as dark comedy",
  "door hardware religion",
  "Gantt chart astrology",
  "RAID log screaming DESIGN",
];
