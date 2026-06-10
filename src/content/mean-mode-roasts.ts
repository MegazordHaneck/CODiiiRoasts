import { ARCHITECT_MEAN_LINES } from "./industry/architectVariety";
import { mergeMeanModeCreative } from "./creative-burns-expansion";
import type { RolePoolKey } from "./roast-pools";

/** Reference voice for live API — vulgar, vivid, one-line AEC punch (not sexual). */
export const MEAN_MODE_STYLE_EXAMPLE = `Your coordination meetings are just 90 minutes of people politely asking "what the F@#% is this?" in increasingly creative ways.`;

const UNIVERSAL: string[] = [
  `{name}, your RFIs don't get answered — they get adopted. Your submittals come back wrong with the confidence of a horoscope. And your schedule? It's a fairy tale you read to subs so they'll mobilize one more time.`,
  `{name}, your BIM clash report isn't coordination — it's a horror anthology with grid lines. Your meetings are where three disciplines learn they all drew a different building. And your "minor" revision? That was someone's quarter, but sure, keep calling it minor.`,
  `{name}, your permit set weighs more than your accountability. Your AHJ comments read like a breakup letter from bureaucracy. And your closeout binder? That's not documentation — that's where hope goes to ferment.`,
  `{name}, your OAC calls are four trades in a circle asking who F@#%d the ceiling height. Your lookahead is astrology with a company logo. And your issue log? That's just screaming, organized by date.`,
  `{name}, you treat "issued for construction" like a prank on people with nail guns. Your IFC drop on Friday is a hate crime with a transmittal number. And your coordination matrix? That's blame, color-coded, with a legend nobody reads.`,
  `{name}, your Procore wall is subs asking which lie is current. Your VE session deleted the one thing the owner could pronounce. And your entitlement timeline? Fiction — the planner is the editor and they're petty.`,
  `{name}, your model says one thing, your section says another, and the field builds a third thing out of spite. Your Navisworks session is group therapy with section boxes. And your BEP? A promise nobody believed, including you.`,
  `{name}, your buyout spreadsheet is optimism in Excel drag. Your superintendent's face during design review should be in a museum. And your temp stairs? Permanent — like your RFIs, like your excuses.`,
];

const BY_ROLE: Partial<Record<RolePoolKey, string[]>> = {
  architect: ARCHITECT_MEAN_LINES,
  engineer: [
    `{name}, your calcs are a love letter to factor of safety. Your drawings are a breakup letter to the field. Every connection is nominally pinned — reality is nominally pissed.`,
    `{name}, you stamp Friday at 4:58 like you're speed-running liability. Your detail bubble says SEE STRUCTURAL — the structural answer is "good luck." And your note "verify in field"? That's the industry's collective middle finger.`,
    `{name}, your load path is clear in your heart and missing on the sheet. You detail everything except the thing the contractor will actually build wrong. And Monday? Monday inherits deflection, RFIs, and regret.`,
  ],
  "bim manager": [
    `{name}, your LOD slide deck is a fantasy novel. Your ceiling model is a crime scene. You don't federate models — you federate panic and bill hourly for the therapy.`,
    `{name}, your clash names are funnier than your vacation photos. You run coordination like a detective show where every suspect is the architect. And the model didn't lie — you just believed it, which is somehow worse.`,
  ],
  gc: [
    `{name}, you promised float — float left the project and changed its number. Your master schedule is fan fiction with logos. And your weekly "we're back on track" speech? Brother, you were never on the track.`,
    `{name}, you herd subs like cats — the cats bill overtime and hate you politely. Your blame matrix has more colors than the elevation. And your buyout optimism could power a city — incorrectly.`,
  ],
  contractor: [
    `I see you are a contractor, {name}. Your project would probably get done on time if you didn't swing your hammer like a F@#%N red squirrel. Your daily report still says "waiting on design" — that's not a status, that's a lifestyle.`,
    `{name}, you mobilized on drawings that were wrong before the ink dried. Your daily report is "waiting on design" in bold, every day, like a religion. And your change order log? That's your autobiography — plot twist every week.`,
    `{name}, you don't read drawings — you negotiate with them like a union rep. Your RFI attachments are photos of lies on Sheet A-101. And your toolbox talk is half safety, half roasting people who've never worn mud on their boots.`,
  ],
  pm: [
    `{name}, your risk register just says DESIGN in red — honest, at least. Your meetings breed meetings like rabbits with action items. And your Gantt chart is green the way a haunted house is "occupied."`,
    `{name}, you sell certainty like a timeshare. You deliver suspense with catering. And your RAID log? That's screaming in columns — very professional screaming, but still.`,
  ],
  owner: [
    `{name}, you want landmark architecture on a budget that screams strip mall. Your "quick question" email has twelve bullets and a new program. And your VE smile? That's the smile of someone who just deleted the facade and kept the render.`,
  ],
  specifier: [
    `{name}, your spec is War and Peace and Division 08 is still wrong. You wrote three pages on "or equal" — subs read "cheapest, fastest, pray." And your substitution clause? An escape hatch with landscaping.`,
  ],
};

export function getMeanModePool(roleKey: RolePoolKey): string[] {
  const role = BY_ROLE[roleKey] ?? [];
  const base = [...new Set([...role, ...UNIVERSAL])];
  return mergeMeanModeCreative(roleKey, base);
}

export function pickMeanModeRoast(name: string, roleKey: RolePoolKey, seed: number): string {
  const pool = getMeanModePool(roleKey);
  const template = pool[((seed % pool.length) + pool.length) % pool.length];
  return template.replace(/\{name\}/g, name);
}
