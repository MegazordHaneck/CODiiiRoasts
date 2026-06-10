export const SHARE_HASHTAGS = "#CODiii #Roasted #AIA2026";
export const SHARE_SITE_URL = "https://codiii.com/roasts";

/** Caption for social posts (image carries the visual; text complements it). */
export function buildShareCaption(roast: string): string {
  const trimmed = roast.trim();
  const quoted = trimmed.startsWith('"') ? trimmed : `"${trimmed}"`;

  return [
    "I just got Roasted by CODiii 🔥",
    "",
    quoted,
    "",
    SHARE_HASHTAGS,
    "",
    SHARE_SITE_URL,
  ].join("\n");
}

export type SharePlatform = "twitter" | "linkedin" | "facebook" | "instagram";

export const SHARE_PLATFORMS: {
  id: SharePlatform;
  label: string;
  hint: string;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    hint: "Share card image + caption — pick Instagram in the menu",
  },
  { id: "linkedin", label: "LinkedIn", hint: "Share card image + caption — pick LinkedIn in the menu" },
  { id: "facebook", label: "Facebook", hint: "Share card image + caption — pick Facebook in the menu" },
  { id: "twitter", label: "X / Twitter", hint: "Share card image + caption — pick X in the menu" },
];

/** Booth phone flow — Instagram, LinkedIn, Facebook only. */
export const PHONE_SHARE_PLATFORMS = SHARE_PLATFORMS.filter((p) =>
  (["instagram", "linkedin", "facebook"] as SharePlatform[]).includes(p.id),
);
