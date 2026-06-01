import type { Intensity } from "../types";
import type { RolePoolKey } from "./roast-pools";

/** Long-form mean mode — vivid, 3-beat, share-safe profanity */
export const MEAN_MODE_CREATIVE: {
  universal: string[];
  byRole: Partial<Record<RolePoolKey, string[]>>;
} = {
  universal: [
    `{name}, your drawing set is a Choose Your Own Adventure where every path ends at an RFI. Your coordination call is three disciplines discovering they hate each other in 4K. And your closeout? That's not a milestone — that's where PDFs go to die of old age.`,
    `{name}, you treat "for construction" like a suggestion and the field treats your email like a threat. Your lookahead is horoscope with a logo. And your issue log is just the word SH!T in different fonts.`,
    `{name}, your permit comments read like a passive-aggressive novel from the city. Your VE deck deletes beauty and keeps liability. And your superintendent's eye twitch? You built that.`,
    `{name}, your BIM model is a religion — the field is atheist. Your submittal review is where good products go to become "or equal." And your Friday transmittal? Emotional damage with tracking.`,
    `{name}, your entitlement timeline is fan fiction. Your AHJ meeting is the boss fight you didn't grind for. And your as-built set? Aspirational literature with a cover sheet.`,
    `{name}, you export IFC like you're exporting trauma to the trades. Your OAC is four people circling who touched the ceiling height last. And your "minor" sketch? That was someone's will to live.`,
    `{name}, your Procore notifications sound like a horror podcast. Your buyout tab is optimism in Excel cosplay. And your temp fence? Permanent — like your RFIs, like your coping.`,
    `{name}, your design review is where hope enters and dignity leaves. Your coordination matrix is blame in Pantone. And your punch list is fan mail from reality — mostly hate mail.`,
    `{name}, you schedule a charrette like it's spa day for egos. Your redlines are polite; your impact on morale is not. And your sheet index? A Wikipedia rabbit hole with no answers.`,
    `{name}, your model update says "resolved" — the ceiling says "lol no." Your spec says contractor shall verify — that's the industry's goodbye kiss. And your warranty binder? Fiction with tabs.`,
    `{name}, you built a career in the gap between render, model, and nail gun. Your meetings create meetings like a franchise. And your budget narrative? Stand-up comedy for accountants.`,
    `{name}, your RFI thread has more plot than the project. Your crane pick plan is art; your communication plan is a myth. And your closeout meeting? Gaslighting with catering.`,
    `{name}, you treat coordination like jazz — nobody knows the key and everyone's soloing. Your AHJ reviewer remembers you — unfortunately. And your team's Slack? Screaming in GIF, professionally.`,
    `{name}, your submittal log is a dating app where every match is wrong. Your concrete pour sequence is poetry; your dimensions are vandalism. And your issue resolution? Delay with confidence.`,
    `{name}, you promise clarity — you deliver a scavenger hunt. Your Navisworks view is a crime scene with section boxes. And your BEP? A promise even you didn't believe.`,
    `{name}, your owner's "quick question" is twelve bullets and a new wing. Your superintendent nods like they're absorbing trauma. And your schedule recovery? Audiobook fiction.`,
    `{name}, you treat shop drawings like fan fiction you don't read. Your inspection report is a love letter to finding problems. And your handoff email? Hot garbage with a signature block.`,
    `{name}, your LEED slide is saving the planet; your details are killing the trades. Your survey is truth — everyone ignores it until lien season. And your lien waiver stack? Jenga with feelings.`,
    `{name}, you call it agile — the field calls it improv with concrete. Your lien period is longer than your attention span. And your final FINAL sheet? A superstition.`,
    `{name}, your commissioning plan is vibes; your functional test is panic. Your owner's rep smile hides six weeks. And your turnover package? A cry for help in three-ring binders.`,
    `{name}, you treat the AHJ like a surprise villain every time. Your utility coordination is a phone tree of despair. And your as-constructed photos? Evidence.`,
  ],
  byRole: {
    architect: [
      `{name}, your schematic is a vibe — your construction set is a war. You hide MEP in the ceiling like a smuggler. And your door hardware schedule? A rumor with aspirations.`,
      `{name}, you want "timeless architecture" — the trades want a dimension that works. Your site photo has golden hour; your section has zero headroom. And your waterproofing detail? A ghost.`,
      `{name}, your facade detail is museum quality — your back-of-house is where souls go missing. You named the building something Latin. And the superintendent named you something not printable — we censored it.`,
      `{name}, your design narrative is poetry — your dimension strings are "see model" like that's a personality. You love a reveal; the framer loves a wall that exists. And your RFI answers? Haiku that hurts.`,
      `{name}, you're why "design intent" is a phrase people say through gritted teeth. Your reflected ceiling plan is a magic trick — structure vanished. And your value engineering? You VE'd the part that kept water out.`,
      `{name}, your render shows happy humans on the roof — your life safety plan shows them trapped. You visit site once for content. And the ironworkers visit your details for revenge.`,
      `{name}, your black turtleneck energy is strong — your flashing detail energy is missing. You want a cantilever because gravity is a suggestion. And your revision cloud? Weather on the sheet — emotional damage on the job.`,
      `{name}, your curtain wall meeting is glass, hope, and leakage. Your stair is sculptural — the handrail is theoretical. And when they replace you with AI? They'll call it #AI'sB#@$H and mean it lovingly.`,
      `{name}, your ceiling plan is where MEP goes to fight for air. Your wall section is two lines and a prayer. And your constructability review? You scheduled it — you didn't attend it.`,
      `{name}, you sell "clarity of vision" — you deliver a scavenger hunt in PDF. Your door swing conflicts with reality. And your punch list comments? "Accept as design intent" — the industry's middle finger.`,
    ],
    engineer: [
      `{name}, your calcs are church — your details are fan fiction. You love a pin connection like it's a hobby. And your note "by others" is the coward's flourish.`,
      `{name}, you stamp it like you're closing a bar tab — Monday inherits physics. Your detail 3/S-501 says SEE STRUCTURAL — the structural answer is "good luck, king."`,
      `{name}, you design bridges — the field builds piers of RFIs under them. Your load path is clear in your heart and missing on the sheet. And your peer review? Trauma bonding with math.`,
      `{name}, your factor of safety is generous — your communication safety factor is zero. You detail the easy connections; the hard ones get "verify in field." And verify in field is Latin for "we blame the ironworkers."`,
      `{name}, your beam grew two sizes when the architect moved a column — you call that adaptation. Your sketch on the PDF is art; your dimensions are a suggestion. And your Friday stamp? A curse with a seal.`,
      `{name}, you're the reason supers say "that's what engineering wanted" like it's a threat. Your connection detail is a novel; the built connection is a improvisation. And your RFI response time? Geological.`,
      `{name}, your seismic notes are thorough — your dimension strings are a desert. You treat torsion like a personality trait. And your deferred submittals? A ticking gift to the GC.`,
    ],
    contractor: [
      `I see you are a contractor, {name}. Your project would get done on time if you didn't swing your hammer like a F@#%N red squirrel. Your superintendent's patience is a non-renewable resource you're mining.`,
      `{name}, you mobilized on optimism and a sheet that was wrong in the printer. Your daily report is "waiting on design" — that's not status, that's religion. And your change order smile? Finance still has nightmares.`,
      `{name}, you don't read drawings — you negotiate with them. Your RFI photos are art titled "Lies on A-101." And your toolbox talk is half OSHA, half therapy for people who trusted the model.`,
      `{name}, your temp shoring is permanent — like your RFIs, like your grudges. You measure twice, cut once, RFI always. And your as-built? A creative writing exercise.`,
      `{name}, you treat tolerances like suggestions from someone you dislike. Your crane pick is ballet; your coordination with design is MMA. And your pour card? Optimism laminated.`,
      `{name}, you're why the spec has "contractor shall verify" — you verify with a tape measure and spite. Your buyout assumed people stop changing their mind — adorable. And your punch list closeout? A myth you tell the owner.`,
      `{name}, your crew trusts you — the drawings don't trust anybody. You found the clash in the field because that's where clashes retire. And your daily huddle? Stand-up comedy about architects.`,
      `{name}, you schedule trades like Tetris — the architect keeps adding L-shaped pieces. Your safety meeting doubles as group therapy. And your invoice attachments? Photos of hope dying.`,
      `{name}, you call it "minor field adjustment" — the owner's wallet calls it "major." Your superintendent speaks fluent sarcasm. And your relationship with the BIM model? It's complicated.`,
    ],
    gc: [
      `{name}, you promised float — float changed its name and moved out. Your master schedule is fan fiction with subcontractor fanfic in the comments. And your weekly recovery speech? Brother, you were never on the track.`,
      `{name}, you herd subs like cats — the cats bill overtime and union rules apply. Your blame matrix is a rainbow of accountability avoiding you. And your OAC deck? RFIs wearing business casual.`,
      `{name}, you don't run jobs — you host interventions with concrete and lawyers. Your buyout optimism could power a small city — incorrectly. And your lookahead? Astrology with logos.`,
      `{name}, your pre-install meeting is theater — the install is tragedy. You say "we're back on track" like a mantra. And the track? The track is a rumor.`,
      `{name}, your coordination meeting has an agenda and a body count. You treat the architect's revision like weather — unpredictable, expensive. And your lien waiver stack? Jenga with consequences.`,
      `{name}, you're the human version of "we'll figure it out in the field" — spoken confidently. Your superintendent roster is a support group. And your closeout? A season finale nobody ordered.`,
    ],
    "bim manager": [
      `{name}, your LOD 500 slide is a fairy tale — your ceiling is LOD "we'll fix it in the field." You don't federate models — you federate panic. And your clash report? A horror anthology with grid lines.`,
      `{name}, your clash names are funnier than your last vacation — "Pipe 47 vs Beam of Regret." You run coordination like CSI where every suspect is the architect. And the model didn't lie — you believed it, which is worse.`,
      `{name}, your Navisworks session is group therapy with section boxes. You ask design to model door hardware — they model hope. And your BEP? A document everyone signed and nobody read.`,
      `{name}, you treat the federated model like a democracy — everyone votes wrong. Your coordination report is 400 pages; the solution is "meeting." And your Revit crash log? A memoir.`,
      `{name}, your 4D simulation is poetry — day 1 on site is prose written by chaos. You color-code blame beautifully. And your issue tracker? Screaming, but organized.`,
    ],
    pm: [
      `{name}, your risk register just says DESIGN in red — refreshingly honest. Your meetings breed meetings — it's meetings all the way down. And your Gantt green? That's paint, not progress.`,
      `{name}, you sell certainty like a timeshare — you deliver suspense with coffee. Your RAID log is screaming in columns. And your action items? They breed — you're basically a project manager of action items.`,
      `{name}, you minutes the meeting — the meeting minutes you. Your lookahead is astrology with a company font. And your stakeholder update? Fiction for optimists.`,
      `{name}, your standup could've been an email — instead it's three workshops and a survey. You track float the way historians track Atlantis. And your closeout plan? A fairy tale with milestones.`,
      `{name}, you're why "project controls" sounds like an oxymoron at happy hour. Your issue log has issues. And your budget forecast? Stand-up for people who love pain.`,
    ],
    owner: [
      `{name}, you want Tadao Ando on a strip-mall budget — bold. Your "quick question" email has twelve bullets and a new program wing. And your VE smile? That's the smile of someone who deleted the facade and kept the render.`,
      `{name}, you treat scope like a buffet — everyone's plate is full, budget is empty. Your approval process is performance art. And your move-in date? A suggestion you enforce like law.`,
      `{name}, you want certainty from an industry that sells suspense. Your change order signature is cheerful — the GC's soul left the body. And your owner's rep? A chaos accelerator with a badge.`,
      `{name}, you funded design through "next never." Your champagne taste and soda budget had a beautiful wedding. And your turnover walk? A scavenger hunt for things that were never installed.`,
    ],
    specifier: [
      `{name}, your spec is War and Peace — Division 08 still loses. You wrote "or equal" like it's gymnastics — subs read "cheapest." And your substitution clause? An escape hatch with landscaping.`,
      `{name}, you specify the Ferrari — you get the kart with ambition. Your master spec vs addenda is a custody battle. And your door hardware section? A religion with schisms.`,
      `{name}, three pages to say "use the good one" — art. Your contractor shall verify note is the industry's breakup text. And your submittal review? Where hope goes to become "approved as noted."`,
      `{name}, your Division 01 is a novel — the trades read the cover. You love a performance spec — the field loves a product that exists. And your closeout spec? Fiction.`,
    ],
  },
};

/** Shorter creative burns for light / contractor / nuclear pools */
export const STEREOTYPE_CREATIVE: {
  universal: Record<Intensity, string[]>;
  byRole: Partial<Record<RolePoolKey, Partial<Record<Intensity, string[]>>>>;
} = {
  universal: {
    light: [
      "Hi {name}! Your AHJ reviewer has you on speed-dial — not in a good way.",
      "Hi {name}! You treat the entitlement set like it'll approve itself — cute.",
      "Hi {name}! Your Bluebeam session at 2 AM is 'work-life balance.'",
      "Hi {name}! You call it a 'quick pass' — the model calls it cardiac arrest.",
      "Hi {name}! Your lien waiver stack is Jenga with consequences.",
      "Hi {name}! You hide behind 'not in contract' like it's a superhero cape.",
      "Hi {name}! Your utility coordination is a phone tree of despair.",
      "Hi {name}! You treat the survey like a suggestion until something doesn't fit.",
      "Hi {name}! Your commissioning is vibes; your functional test is panic.",
      "Hi {name}! Your owner's walkthrough is a scavenger hunt for missing stuff.",
    ],
    contractor: [
      "Hi {name}! Your crane chart is modern art — your nerves are not.",
      "Hi {name}! You trust the laser until the laser trusts the wrong benchmark.",
      "Hi {name}! Your concrete truck count is a mood ring for the schedule.",
      "Hi {name}! You treat the architect's sketch like a dare.",
      "Hi {name}! Your superintendent's side-eye could power the temp panels.",
      "Hi {name}! You mobilized on 50% DD — that's not bold, that's a lifestyle.",
      "Hi {name}! Your RFI photo captions should win awards — wrong awards.",
      "Hi {name}! You schedule pours around design's feelings.",
      "Hi {name}! Your temp heat is permanent — industry tradition.",
      "Hi {name}! You read the spec like it's optional fiction.",
    ],
    nuclear: [
      "Hi {name}! You're the reason 'as indicated' means nothing is indicated.",
      "Hi {name}! Your design team sells poetry — your field team sells bandages.",
      "Hi {name}! Your IFC drop is a jump scare with a transmittal number.",
      "Hi {name}! You built a career where 'minor' does Olympic-level damage.",
      "Hi {name}! Your coordination meeting is passive-aggression in 3D.",
      "Hi {name}! Your AHJ comments are a novel — your responses are fan fiction.",
      "Hi {name}! You treat the GMP like a piñata full of blame.",
      "Hi {name}! Your model and reality aren't on speaking terms.",
      "Hi {name}! Your closeout binder is where grudges go to age.",
      "Hi {name}! You export problems faster than you export PDFs.",
      "Hi {name}! Your superintendent's group chat has a nickname for you.",
      "Hi {name}! Your VE session deleted the soul and kept the shell.",
      "Hi {name}! You promise handoffs — you deliver hot potatoes.",
      "Hi {name}! Your issue log is screaming in professional font.",
      "Hi {name}! Your legacy is RFIs that outlive the building.",
    ],
    nsfw: [],
  },
  byRole: {
    architect: {
      light: [
        "Hi {name}! Your material board is chef's kiss — your flashing detail is missing.",
        "Hi {name}! You love a cantilever — physics sends its regards.",
      ],
      contractor: [
        "Hi {name}! Your ceiling height on paper is a joke MEP didn't laugh at.",
        "Hi {name}! Your door swing diagram is a philosophical debate.",
      ],
      nuclear: [
        "Hi {name}! Your revision cloud is weather — the budget is a hurricane.",
        "Hi {name}! You want minimalism — the trades want a dimension.",
        "Hi {name}! Your render is lying — the section is confessing.",
      ],
    },
    engineer: {
      light: [
        "Hi {name}! Your connection detail is a novel — the built connection is improv.",
      ],
      contractor: [
        "Hi {name}! You stamp Friday — Monday inherits deflection and regret.",
      ],
      nuclear: [
        "Hi {name}! 'Verify in field' is your autobiography in three words.",
        "Hi {name}! Your calcs are fine — your dimensions are cosplay.",
      ],
    },
    contractor: {
      light: [
        "Hi {name}! Your truck sticker energy is strong — your drawing trust energy is not.",
      ],
      nuclear: [
        "Hi {name}! You swing that hammer like a F@#%N red squirrel — respectfully.",
        "Hi {name}! Your daily report is a religion called Waiting on Design.",
      ],
    },
    "bim manager": {
      nuclear: [
        "Hi {name}! Your clash report is a binge-worthy tragedy.",
        "Hi {name}! LOD 500 on the slide — LOD panic in the plenum.",
      ],
    },
    gc: {
      nuclear: [
        "Hi {name}! Float ghosted you — you still send it flowers.",
        "Hi {name}! Your blame matrix is a rainbow of avoiding you.",
      ],
    },
    owner: {
      nuclear: [
        "Hi {name}! Landmark vision, strip-mall budget — iconic combo.",
        "Hi {name}! Your VE deleted the pretty — kept the lawsuit.",
      ],
    },
  },
};

export function mergeMeanModeCreative(
  roleKey: RolePoolKey,
  base: string[],
): string[] {
  const role = MEAN_MODE_CREATIVE.byRole[roleKey] ?? [];
  return [...new Set([...base, ...role, ...MEAN_MODE_CREATIVE.universal])];
}

export function mergeStereotypeCreative(
  roleKey: RolePoolKey,
  intensity: Intensity,
  base: string[],
): string[] {
  const role = STEREOTYPE_CREATIVE.byRole[roleKey]?.[intensity] ?? [];
  const universal = STEREOTYPE_CREATIVE.universal[intensity] ?? [];
  return [...new Set([...base, ...role, ...universal])];
}
