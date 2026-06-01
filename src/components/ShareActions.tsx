import { useCallback, useState } from "react";
import {
  buildShareCaption,
  getShareUrl,
  SHARE_PLATFORMS,
  type SharePlatform,
} from "../lib/shareCaption";
import styles from "./ShareActions.module.css";

type Props = {
  roast: string;
  getPngBlob: () => Promise<Blob | null>;
  fileName: string;
  compact?: boolean;
};

export function ShareActions({ roast, getPngBlob, fileName, compact = false }: Props) {
  const caption = buildShareCaption(roast);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showCaption, setShowCaption] = useState(false);

  const copyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setStatus("Caption copied!");
      window.setTimeout(() => {
        setCopied(false);
        setStatus(null);
      }, 2500);
    } catch {
      setStatus("Copy failed — use “Show caption”.");
    }
  }, [caption]);

  const downloadImage = useCallback(async () => {
    const blob = await getPngBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    return blob;
  }, [getPngBlob, fileName]);

  const shareNative = useCallback(async () => {
    const blob = await getPngBlob();
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "Roasted by CODiii",
          text: caption,
          files: [file],
        });
        return;
      } catch {
        /* cancelled */
      }
    }
    await downloadImage();
    await copyCaption();
    setStatus("Saved — paste in your app.");
  }, [caption, downloadImage, copyCaption, getPngBlob, fileName]);

  const openPlatform = useCallback(
    async (platform: SharePlatform) => {
      setStatus(null);

      if (platform === "instagram") {
        await downloadImage();
        await copyCaption();
        setStatus("Saved for Instagram");
        return;
      }

      const url = getShareUrl(platform, caption);
      if (!url) return;

      if (platform === "facebook") await copyCaption();

      window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
    },
    [caption, downloadImage, copyCaption],
  );

  return (
    <div className={`${styles.wrap} ${compact ? styles.wrapCompact : ""}`}>
      <p className={styles.heading}>Post to</p>
      <div className={`${styles.platforms} ${compact ? styles.platformsCompact : ""}`}>
        {SHARE_PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.platformBtn} ${styles[p.id]}`}
            onClick={() => void openPlatform(p.id)}
            title={p.hint}
          >
            {compact ? p.label.split(" / ")[0] : p.label}
          </button>
        ))}
      </div>

      <div className={`${styles.secondary} ${compact ? styles.secondaryCompact : ""}`}>
        <button type="button" className={styles.ghostBtn} onClick={() => void shareNative()}>
          Share
        </button>
        <button type="button" className={styles.ghostBtn} onClick={() => void downloadImage()}>
          Save
        </button>
        <button type="button" className={styles.ghostBtn} onClick={() => void copyCaption()}>
          {copied ? "Copied" : "Caption"}
        </button>
        {compact && (
          <button
            type="button"
            className={styles.ghostBtn}
            onClick={() => setShowCaption((v) => !v)}
          >
            {showCaption ? "Hide" : "Text"}
          </button>
        )}
      </div>

      {(!compact || showCaption) && (
        <div className={`${styles.captionPreview} ${compact ? styles.captionCompact : ""}`}>
          {!compact && <span className={styles.captionLabel}>Your post text</span>}
          <pre className={styles.captionText}>{caption}</pre>
        </div>
      )}

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
