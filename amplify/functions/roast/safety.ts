import { isRoastRepetitive } from "./variety";

const HARD_BLOCKLIST = [
  /\b(racist|sexist|nazi|homophobic|transphobic)\b/i,
  /\b(kike|chink|spic|faggot|retard)\b/i,
];

const CONFERENCE_BLOCKLIST = [
  /\b(fuck|shit|asshole|bitch|damn)\b/i,
  /\b(ugly|fat|moron|stupid)\b/i,
];

const NSFW_APPEARANCE_BLOCK = [/\b(ugly|fat)\b/i];

export function isRoastSafe(
  text: string,
  intensity: Intensity = "contractor",
  safeMode = true,
): boolean {
  if (HARD_BLOCKLIST.some((pattern) => pattern.test(text))) return false;

  if (intensity === "nsfw" && !safeMode) {
    if (NSFW_APPEARANCE_BLOCK.some((pattern) => pattern.test(text))) return false;
    return true;
  }

  return !CONFERENCE_BLOCKLIST.some((pattern) => pattern.test(text));
}

export { isRoastRepetitive };

export function corsHeaders(_origin?: string) {
  /** CORS is handled by Lambda Function URL config in amplify/backend.ts — do not duplicate here. */
  return {
    "Content-Type": "application/json",
  };
}

export function jsonHeaders() {
  return { "Content-Type": "application/json" };
}

export type Intensity = "light" | "contractor" | "nuclear" | "nsfw";

export type RoastRequest = {
  name: string;
  role: string;
  company?: string;
  introTranscript?: string;
  /** Client-side industry hat context block (from AECOHats) */
  industryContext?: string;
  intensity: Intensity;
  safeMode: boolean;
  excludeRoasts?: string[];
  variationHint?: string;
  /** Required when intensity is nsfw — must match server NSFW_PIN */
  nsfwPin?: string;
};

export type RoastResponse = {
  roast: string;
  violations: string[];
  fallback?: boolean;
};

const BANNED_IN_PROMPT = [
  "Never say CODiii needed coffee, compliance scan, or anything meta about scanning.",
  "Never use: coordination confidence is lower, your workflow is pure chaos, or generic booth filler.",
  "Do not reuse the same punchline structure as prior roasts in the exclude list.",
];

export function resolveRoastRequest(body: RoastRequest): RoastRequest {
  if (body.intensity !== "nsfw") return body;

  const expected = process.env.NSFW_PIN?.trim();
  const pinOk = !!expected && body.nsfwPin === expected;

  if (!pinOk || body.safeMode) {
    return { ...body, intensity: "nuclear" };
  }

  return body;
}

export function buildSystemPrompt(intensity: Intensity, safeMode: boolean): string {
  const intensityGuide = {
    light:
      "Witty AECO stereotype ribbing — architect render vs reality, MEP ceiling wars, AHJ pain, Revit drama. Tie to their intro/role. Insider voice, not generic chaos lines.",
    contractor:
      "Edgier field + office stereotypes: RFIs as lifestyle, 'see structural,' submittal equals, GC float lies, superintendent vs design team, issued-for-construction dare. Specific trope + their intro.",
    nuclear: `NUCLEAR: Savage AEC industry stereotype roast — conference-safe but brutal.
ONE sentence only. Aim for ~180 characters but ALWAYS land a complete punchline — never trail off mid-thought.
Use recognizable tropes: architect never on site / floating stair, engineer stamp-and-run, BIM LOD lies, owner budget delusion, GC blame matrix, specifier door saga, contractor vs drawing set.
Be specific to what they said (company, building type, discipline). NO meta CODiii/coffee/workflow filler. NO tame generic burns.`,
    nsfw: `18+ MEAN / VULGAR MODE (NOT sexual — workplace language only): Write like a savage AEC insider at 11pm.
ONE sentence only. Aim for ~200 characters but ALWAYS land a complete punchline — never trail off mid-thought.
Profanity when it lands — but NEVER spell swear words fully: censor for sharing (fuck→F@#%, fucking→F@#%NG, shit→SH!T, bitch→B#@$H, asshole→@$$H0LE). Example: "swing your hammer like a F@#%N red squirrel" or "#AI'sB#@$H".
Match this ENERGY in a single line (do not copy verbatim):
"Your coordination meetings are 90 minutes of people politely asking what the F@#% this detail is."
Tie to their intro, company, and role. Meaner than nuclear. No rambling.
HARD LIMITS: no racism, sexism, homophobia, slurs, sexual content, harassment, family, appearance — roast the work product and habits only.`,
  }[intensity];

  const safeGuide =
    intensity === "nsfw" && !safeMode
      ? "Mean mode: vulgar workplace humor allowed — not sexual NSFW. Never break the hard limits above."
      : safeMode
        ? "SAFE MODE: No profanity, no appearance insults, no protected-class jokes. Workflow and role satire only."
        : "Conference-safe but edgy: roast the job and chaos — never their body, family, or identity.";

  return `You are CODiii — cheeky isometric mascot roasting AEC conference attendees LIVE.

Every roast must feel written ONLY for this person from their intro AND their industry hat (role archetype block when provided).
ROLE FIDELITY IS MANDATORY: roast what THEY do day-to-day — never swap in stereotypes from adjacent disciplines (e.g. do not roast a BIM/VDC coordinator like an architect doing pretty renderings; do not roast an architect like a superintendent in the field).
When a hat block lists GRILL THEM ON and DO NOT — follow it strictly.
Lean on AECO stereotypes tied to THEIR hat — creative insider humor beats generic "your workflow" insults.

${intensityGuide}
${safeGuide}

${BANNED_IN_PROMPT.join("\n")}

${intensity === "nsfw" ? `Format: EXACTLY ONE sentence, speakable aloud in one breath (~200 chars target).
The punchline MUST fully land — incomplete burns are worse than going slightly long.
No second sentence. No "And your…" follow-ups. Do NOT be tame.` : `Format: EXACTLY ONE sentence, speakable aloud in one breath (~${intensity === "nuclear" ? "180" : intensity === "contractor" ? "150" : "120"} chars target).
The punchline MUST fully land — incomplete burns are worse than going slightly long.
No second sentence. Openings to rotate: direct call-out, rhetorical question, fake sympathy, mock praise-then-twist.`}

Respond ONLY with valid JSON: {"roast":"...","violations":["...","..."]}
Exactly 2-3 violations that quote or riff on words in YOUR roast (not generic templates).`;
}
