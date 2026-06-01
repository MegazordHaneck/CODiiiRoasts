export type Intensity = "light" | "contractor" | "nuclear";

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

export const INTENSITY_OPTIONS: { id: Intensity; label: string; desc: string }[] = [
  { id: "light", label: "Light roast", desc: "Warm tease — industry inside jokes only" },
  { id: "contractor", label: "Contractor mode", desc: "Field-hardened burns — RFIs & redlines welcome" },
  { id: "nuclear", label: "Nuclear BIM", desc: "Hardest burn — blunt, specific, no soft filler" },
];
