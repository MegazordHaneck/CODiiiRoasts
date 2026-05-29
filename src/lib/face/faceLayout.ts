export type MouthState = "smile" | "closed" | "mid" | "open";

export function rmsToMouthState(rms: number): MouthState {
  if (rms < 0.02) return "closed";
  if (rms < 0.08) return "mid";
  if (rms < 0.18) return "open";
  return "open";
}

export const FACE_LAYOUT = {
  panelLeft: 0.28,
  panelTop: 0.32,
  panelWidth: 0.44,
  panelHeight: 0.36,
  eyeLeft: 0.38,
  eyeRight: 0.62,
  eyeTop: 0.42,
  eyeRadius: 0.055,
  mouthCenterX: 0.5,
  mouthCenterY: 0.58,
  mouthWidth: 0.22,
  mouthHeight: 0.12,
} as const;
