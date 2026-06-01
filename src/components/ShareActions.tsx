import { useCallback, useState } from "react";
import {
  buildShareCaption,
  getShareUrl,
  PHONE_SHARE_PLATFORMS,
  SHARE_PLATFORMS,
  type SharePlatform,
} from "../lib/shareCaption";
import { isMobileDevice } from "../lib/isMobile";
import styles from "./ShareActions.module.css";

type Props = {
  roast: string;
  getPngBlob: () => Promise<Blob | null>;
  fileName: string;
  compact?: boolean;
  /** Phone landing page after camera QR scan */
  phone?: boolean;
};

export function ShareActions({ roast, getPngBlob, fileName, compact = false, phone = false }: Props) {
  const caption = buildShareCaption(roast);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showCaption, setShowCaption] = useState(phone);
  const platforms = phone ? PHONE_SHARE_PLATFORMS : SHARE_PLATFORMS;
  const mobile = phone || isMobileDevice();

  const copyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setStatus("Caption copied — paste when you post.");
      window.setTimeout(() => {
        setCopied(false);
        setStatus(null);
      }, 3000);
    } catch {
      setStatus("Tap and hold the caption below to copy.");
    }
  }, [caption]);

  const downloadImage = useCallback(async () => {
    const blob = await getPngBlob();
    if (!blob) return null;
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
    if (!blob) return false;
    const file = new File([blob], fileName, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "Roasted by CODiii",
          text: caption,
          files: [file],
        });
        return true;
      } catch {
        /* cancelled or unsupported */
      }
    }
    return false;
  }, [caption, getPngBlob, fileName]);

  const shareNativeOrSave = useCallback(async () => {
    const shared = await shareNative();
    if (shared) return;
    await downloadImage();
    await copyCaption();
    setStatus("Card saved — caption copied. Open Instagram, LinkedIn, or Facebook to post.");
  }, [shareNative, downloadImage, copyCaption]);

  const openPlatform = useCallback(
    async (platform: SharePlatform) => {
      setStatus(null);

      if (platform === "instagram") {
        const shared = await shareNative();
        if (!shared) {
          await downloadImage();
          await copyCaption();
        }
        setStatus(
          shared
            ? "Pick Instagram in the share menu."
            : "Card saved + caption copied — open Instagram to post.",
        );
        return;
      }

      const shared = await shareNative();
      if (shared) {
        setStatus("Pick your app in the share menu.");
        return;
      }

      await copyCaption();

      const url = getShareUrl(platform, caption);
      if (!url) return;

      if (mobile) {
        window.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
      }
    },
    [caption, copyCaption, downloadImage, mobile, shareNative],
  );

  return (
    <div className={`${styles.wrap} ${compact ? styles.wrapCompact : ""} ${phone ? styles.wrapPhone : ""}`}>
      <p className={styles.heading}>{phone ? "Share to your socials" : "Post to"}</p>

      <div
        className={`${styles.platforms} ${compact ? styles.platformsCompact : ""} ${phone ? styles.platformsPhone : ""}`}
      >
        {platforms.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.platformBtn} ${styles[p.id]} ${phone ? styles.platformBtnPhone : ""}`}
            onClick={() => void openPlatform(p.id)}
            title={p.hint}
          >
            {phone ? p.label : compact ? p.label.split(" / ")[0] : p.label}
          </button>
        ))}
      </div>

      {!compact && (
        <button type="button" className={styles.sharePrimary} onClick={() => void shareNativeOrSave()}>
          {phone ? "Share card + caption" : "Share to socials"}
        </button>
      )}

      <div className={`${styles.secondary} ${compact ? styles.secondaryCompact : ""}`}>
        {compact && (
          <button type="button" className={styles.ghostBtn} onClick={() => void shareNativeOrSave()}>
            Share
          </button>
        )}
        <button type="button" className={styles.ghostBtn} onClick={() => void downloadImage()}>
          Save image
        </button>
        <button type="button" className={styles.ghostBtn} onClick={() => void copyCaption()}>
          {copied ? "Copied!" : "Copy caption"}
        </button>
        {compact && !phone && (
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
        <div className={`${styles.captionPreview} ${compact ? styles.captionCompact : ""} ${phone ? styles.captionPhone : ""}`}>
          <span className={styles.captionLabel}>
            {phone ? "Your post text (copied when you tap a network above)" : "Your post text"}
          </span>
          <pre className={styles.captionText}>{caption}</pre>
        </div>
      )}

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
