import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSharePayload, type SharePayload } from "../lib/shareLinkApi";
import { getShareUrl, type SharePlatform } from "../lib/shareCaption";
import styles from "./ShareMobileScreen.module.css";

const PLATFORMS: { id: SharePlatform; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "twitter", label: "X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "facebook", label: "Facebook" },
];

export function ShareMobileScreen() {
  const { shareId } = useParams<{ shareId: string }>();
  const [data, setData] = useState<SharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!shareId) {
      setError("Invalid share link.");
      return;
    }
    void fetchSharePayload(shareId).then((payload) => {
      if (payload) setData(payload);
      else setError("This roast link expired or could not be loaded.");
    });
  }, [shareId]);

  const copyCaption = useCallback(async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.caption);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Tap and hold the caption below to copy.");
    }
  }, [data]);

  const saveImage = useCallback(async () => {
    if (!data?.imageUrl) return;
    try {
      const res = await fetch(data.imageUrl);
      const blob = await res.blob();
      const file = new File([blob], "codiii-roast.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "My CODiii Roast",
          text: data.caption,
          files: [file],
        });
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "codiii-roast.png";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(data.imageUrl, "_blank");
    }
  }, [data]);

  const openPlatform = useCallback(
    async (platform: SharePlatform) => {
      if (!data) return;
      if (platform === "instagram") {
        await saveImage();
        await copyCaption();
        return;
      }
      const url = getShareUrl(platform, data.caption);
      if (url) window.location.href = url;
    },
    [data, saveImage, copyCaption],
  );

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <p className={styles.loading}>Loading your roast…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>You got Roasted</h1>
      <p className={styles.name}>{data.name}</p>
      <img src={data.imageUrl} alt="Your CODiii roast card" className={styles.card} />
      <p className={styles.hint}>Save the card, copy the caption, then post.</p>

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => void saveImage()}>
          Save roast card
        </button>
        <button type="button" className={styles.secondary} onClick={() => void copyCaption()}>
          {copied ? "Caption copied!" : "Copy caption"}
        </button>
      </div>

      <div className={styles.platforms}>
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={styles.platform}
            onClick={() => void openPlatform(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <pre className={styles.caption}>{data.caption}</pre>
    </div>
  );
}
