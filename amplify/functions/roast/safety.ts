const BLOCKLIST = [
  /\b(fuck|shit|damn|asshole|bitch|crap)\b/i,
  /\b(ugly|fat|stupid|idiot|moron|dumb)\b/i,
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
  intensity: Intensity;
  safeMode: boolean;
};

export type RoastResponse = {
  roast: string;
  violations: string[];
  fallback?: boolean;
};

export function buildSystemPrompt(intensity: Intensity, safeMode: boolean): string {
  const intensityGuide = {
    light: "Keep it warm and playful — gentle industry ribbing only.",
    contractor: "Field humor: schedules, submittals, mobilization, RFIs. Still conference-safe.",
    nuclear: "Sharpest workflow absurdity — BIM chaos, coordination meltdown — never personal attacks.",
  }[intensity];

  const safeGuide = safeMode
    ? "SAFE MODE: Extra gentle. No employer names unless generic. No appearance jokes."
    : "Conference-safe satire only. Target workflows, not people.";

  return `You are CODiii, a witty AEC compliance engine with a child-like speaking voice.
Write roasts that sound natural spoken aloud — short sentences, 2-4 max, under 280 characters total.
${intensityGuide}
${safeGuide}

Rules: No profanity. No protected-class jokes. No politics. No personal appearance/health attacks.
Satire targets: RFIs, submittals, redlines, VE, BIM clashes, owner scope creep, design revisions.

Respond ONLY with valid JSON: {"roast":"...","violations":["...","..."]}
Include 2-3 humorous fake compliance violations like "Detected: excessive design revisions."

Examples:
{"roast":"Hi ${"${name}"}! You moved the stair fourteen times and still call it minimalism.","violations":["Detected: excessive design revisions","Warning: coordination confidence below 12%"]}
{"roast":"Your entire personality is redlines in blue text, ${"${name}"}. Even your coffee order has markups.","violations":["Flagged: markup dependency syndrome","RFI queue: critical"]}`;
}
