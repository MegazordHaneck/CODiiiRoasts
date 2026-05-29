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

export const ROLE_OPTIONS = [
  "Architect",
  "Engineer",
  "Contractor",
  "General Contractor",
  "Owner",
  "Project Manager",
  "BIM Manager",
  "Specifier",
  "Other",
] as const;

export const INTENSITY_OPTIONS: { id: Intensity; label: string; desc: string }[] = [
  { id: "light", label: "Light roast", desc: "Gentle industry ribbing" },
  { id: "contractor", label: "Contractor mode", desc: "Field & submittal humor" },
  { id: "nuclear", label: "Nuclear BIM", desc: "Coordination chaos satire" },
];
