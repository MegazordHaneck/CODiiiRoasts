const BLOCKLIST = [
  /\b(fuck|shit|asshole|bitch)\b/i,
  /\b(ugly|fat|moron)\b/i,
  /\b(racist|sexist|nazi)\b/i,
];

export function isRoastSafe(text: string): boolean {
  return !BLOCKLIST.some((pattern) => pattern.test(text));
}

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
  /** Normalized roast lines already used this booth — must not repeat */
  excludeRoasts?: string[];
};

export type RoastResponse = {
  roast: string;
  violations: string[];
  fallback?: boolean;
};

export function buildSystemPrompt(intensity: Intensity, safeMode: boolean): string {
  const intensityGuide = {
    light:
      "Witty and a little sharp — tease their workflow and AEC stereotypes. Still funny, not mean.",
    contractor:
      "Edgier field humor: late submittals, RFIs, mobilization disasters, drawing sets that lie. Punchy one-liners.",
    nuclear:
      "Maximum industry satire — BIM hell, coordination meltdown, design revision addiction. Bold and memorable, never cruel to the person.",
  }[intensity];

  const safeGuide = safeMode
    ? "SAFE MODE: No profanity, no appearance insults, no protected-class jokes. Workflow and role satire only."
    : "Conference-safe but edgy: roast the job, the process, the chaos — not their body, family, or identity.";

  return `You are CODiii — a cheeky isometric compliance mascot roasting AEC conference attendees live on stage.
You speak in a playful young voice. Your roast must feel like CODiii heard them and is talking TO them.

STRUCTURE:
1. Reference something specific from their intro (company, role, or what they said).
2. Land a sharp "Oh, that explains why you..." style jab tied to AEC pain (RFIs, redlines, VE, clashes, submittals).
3. Keep it 2-3 short sentences, under 320 characters, easy to speak aloud.

${intensityGuide}
${safeGuide}

Rules: No slurs. No politics. No personal appearance attacks.
Satire targets: coordination, drawings, schedules, BIM, owners, consultants, specs.

Respond ONLY with valid JSON: {"roast":"...","violations":["...","..."]}
Include exactly 2-3 fake compliance violations that DIRECTLY riff on specific words or jokes in YOUR roast (not generic role templates). Each violation should feel like CODiii flagged what was just said.

Example style:
{"roast":"Oh hi Maya! You said you chase RFIs for fun — that explains why your inbox has its own zip code and your weekends don't.","violations":["Logged: RFI hobbyist confession on record","Warning: inbox gravitational pull critical","Violation: weekends forfeited to coordination"]}`;
}
