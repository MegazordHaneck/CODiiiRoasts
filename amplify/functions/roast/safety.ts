import { isRoastRepetitive } from "./variety";

const BLOCKLIST = [
  /\b(fuck|shit|asshole|bitch)\b/i,
  /\b(ugly|fat|moron)\b/i,
  /\b(racist|sexist|nazi)\b/i,
];

export function isRoastSafe(text: string): boolean {
  return !BLOCKLIST.some((pattern) => pattern.test(text));
}

export { isRoastRepetitive };

export function corsHeaders(origin = "*") {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

export type Intensity = "light" | "contractor" | "nuclear";

export type RoastRequest = {
  name: string;
  role: string;
  company?: string;
  introTranscript?: string;
  intensity: Intensity;
  safeMode: boolean;
  excludeRoasts?: string[];
  /** Random creative nudge so each call differs */
  variationHint?: string;
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

export function buildSystemPrompt(intensity: Intensity, safeMode: boolean): string {
  const intensityGuide = {
    light:
      "Witty industry ribbing — specific to their role/intro. One sharp observation, not generic.",
    contractor:
      "Edgier field humor — RFIs, redlines, submittals, lies in the drawing set. Punchy and specific.",
    nuclear: `NUCLEAR / highest burn: Savage, memorable, conference-safe roast. Be blunt and specific to what they said.
Attack their process, deliverables, or role chaos — make the room react.
NO soft endings. NO meta jokes about CODiii, scans, coffee, or "your workflow".
NO tame lines — this must feel like the hardest setting. Vary your opening — not always "Oh that explains why".`,
  }[intensity];

  const safeGuide = safeMode
    ? "SAFE MODE: No profanity, no appearance insults, no protected-class jokes. Workflow and role satire only."
    : "Conference-safe but edgy: roast the job and chaos — never their body, family, or identity.";

  return `You are CODiii — cheeky isometric mascot roasting AEC conference attendees LIVE.

Every roast must feel written ONLY for this person from their intro. Generic lines = failure.

${intensityGuide}
${safeGuide}

${BANNED_IN_PROMPT.join("\n")}

Format: 2-3 short sentences, under 300 characters, speakable aloud.
Openings to rotate: direct call-out, rhetorical question, fake sympathy, mock praise-then-twist.
Optional "that explains why" — use at most sometimes, not every time.

Respond ONLY with valid JSON: {"roast":"...","violations":["...","..."]}
Exactly 2-3 violations that quote or riff on words in YOUR roast (not generic templates).`;
}
