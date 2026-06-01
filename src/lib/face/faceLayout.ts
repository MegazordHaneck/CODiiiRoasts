export type MouthState = "smile" | "closed" | "mid" | "open";

/** Speech energy 0–1 from frequency bins */
export function speechEnergyToOpenness(energy: number): number {
  const boosted = Math.pow(Math.min(1, Math.max(0, energy)), 0.72);
  return Math.min(1, boosted * 1.15);
}

export function opennessToMouthState(openness: number): MouthState {
  if (openness < 0.12) return "closed";
  if (openness < 0.45) return "mid";
  return "open";
}

/** Face screen coords in viewBox 0 0 200 200 (isometric CODiii head) */
export const FACE = {
  viewBox: "0 0 200 200",
  panel: { x: 62, y: 78, w: 76, h: 52, rx: 4 },
  eyeL: { cx: 82, cy: 98, r: 7 },
  eyeR: { cx: 118, cy: 98, r: 7 },
  mouth: { cx: 100, cy: 118, w: 36 },
} as const;
