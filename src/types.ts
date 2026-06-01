export type Intensity = "light" | "contractor" | "nuclear" | "nsfw";

export type Screen =
  | "attract"
  | "intake"
  | "intensity"
  | "scan"
  | "roast"
  | "violations"
  | "pitch"
  | "share";

export type Attendee = {
  name: string;
  role: string;
  company?: string;
  /** Raw voice intro for personalized roast */
  introTranscript?: string;
  /** Matched from public/industryContext/AECOHats.mjs */
  industryHatId?: string;
  industryHatLabel?: string;
};

export type RoastResult = {
  roast: string;
  violations: string[];
  fallback?: boolean;
};

export type SessionRecord = {
  id: string;
  timestamp: string;
  name: string;
  role: string;
  intensity: Intensity;
  fallback: boolean;
  latencyMs: number;
};

/** Public booth intensities (no password) */
export const INTENSITY_OPTIONS: { id: Intensity; label: string; desc: string }[] = [
  { id: "light", label: "Light roast", desc: "Warm tease — industry inside jokes only" },
  { id: "contractor", label: "Contractor mode", desc: "Field-hardened burns — RFIs & redlines welcome" },
  { id: "nuclear", label: "Nuclear BIM", desc: "Hardest conference burn — blunt, specific, no soft filler" },
];

/** Staff-only — requires PIN on intensity screen */
export const NSFW_INTENSITY_OPTION: { id: Intensity; label: string; desc: string } = {
  id: "nsfw",
  label: "18+ Mean mode",
  desc: "Vulgar, vivid AEC roasts — profanity & brutal detail (not sexual). PIN + disclaimer.",
};
