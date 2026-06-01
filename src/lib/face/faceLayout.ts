export type MouthState = "smile" | "closed" | "mid" | "open";

/** Mouth openness 0–1 from smoothed audio RMS */
export function rmsToOpenness(rms: number): number {
  const normalized = Math.min(1, Math.max(0, (rms - 0.015) / 0.14));
  return normalized;
}

export function opennessToMouthState(openness: number): MouthState {
  if (openness < 0.08) return "closed";
  if (openness < 0.35) return "mid";
  if (openness < 0.65) return "open";
  return "open";
}

/** Face screen coords in viewBox 0 0 200 200 (isometric CODiii head) */
export const FACE = {
  viewBox: "0 0 200 200",
  /** Black display panel on front face */
  panel: { x: 62, y: 78, w: 76, h: 52, rx: 4 },
  eyeL: { cx: 82, cy: 98, r: 7 },
  eyeR: { cx: 118, cy: 98, r: 7 },
  mouth: { cx: 100, cy: 118, w: 36 },
} as const;
