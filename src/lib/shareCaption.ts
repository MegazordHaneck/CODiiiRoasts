export const SHARE_HASHTAGS = "#CODiii #Roasted #AIA2026";
export const SHARE_SITE_URL = "https://codiii.com";

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

export function getShareUrl(platform: SharePlatform, caption: string): string | null {
  const encoded = encodeURIComponent(caption);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encoded}`;
    case "linkedin":
      return `https://www.linkedin.com/feed/?shareActive=true&text=${encoded}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_SITE_URL)}&hashtag=${encodeURIComponent("CODiii")}`;
    case "instagram":
      return null;
    default:
      return null;
  }
}

export const SHARE_PLATFORMS: {
  id: SharePlatform;
  label: string;
  hint: string;
}[] = [
  {
    id: "instagram",
    label: "Instagram",
    hint: "Share sheet or save — then paste in Stories or feed",
  },
  { id: "linkedin", label: "LinkedIn", hint: "Opens LinkedIn with your caption ready" },
  { id: "facebook", label: "Facebook", hint: "Opens Facebook — caption copied for you" },
  { id: "twitter", label: "X / Twitter", hint: "Opens with your caption ready to post" },
];

/** Booth phone flow — Instagram, LinkedIn, Facebook only. */
export const PHONE_SHARE_PLATFORMS = SHARE_PLATFORMS.filter((p) =>
  (["instagram", "linkedin", "facebook"] as SharePlatform[]).includes(p.id),
);
