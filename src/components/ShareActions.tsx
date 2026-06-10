import { useCallback, useState } from "react";
import {
  buildShareCaption,
  PHONE_SHARE_PLATFORMS,
  SHARE_PLATFORMS,
  type SharePlatform,
} from "../lib/shareCaption";
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

  const copyCaptionToClipboard = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(caption);
      return true;
    } catch {
      return false;
    }
  }, [caption]);

  const copyCaption = useCallback(async () => {
    const ok = await copyCaptionToClipboard();
    if (ok) {
      setCopied(true);
      setStatus("Caption copied — paste when you post.");
      window.setTimeout(() => {
        setCopied(false);
        setStatus(null);
      }, 3000);
    } else {
      setStatus("Tap and hold the caption below to copy.");
    }
  }, [copyCaptionToClipboard]);

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

  /** Card PNG + caption via the system share sheet — same flow for every network. */
  const shareCardReady = useCallback(
    async (platformLabel?: string) => {
      setStatus(null);
      await copyCaptionToClipboard();

      const blob = await getPngBlob();
      if (!blob) {
        setStatus("Could not load your card. Try again in a moment.");
        return;
      }

      const file = new File([blob], fileName, { type: "image/png" });
      const shareData: ShareData = {
        title: "Roasted by CODiii",
        text: caption,
        files: [file],
      };

      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        try {
          await navigator.share(shareData);
          setStatus(
            platformLabel
              ? `Choose ${platformLabel} — your card and caption are ready. Review and post.`
              : "Choose your app — your card and caption are ready. Review and post.",
          );
          return;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            setStatus(null);
            return;
          }
        }
      }

      await downloadImage();
      setStatus(
        platformLabel
          ? `Card saved and caption copied. Open ${platformLabel}, add the image, paste the caption, and post.`
          : "Card saved and caption copied. Open your social app, add the image, paste the caption, and post.",
      );
    },
    [caption, copyCaptionToClipboard, downloadImage, fileName, getPngBlob],
  );

  const openPlatform = useCallback(
    (platform: SharePlatform) => {
      const meta = platforms.find((p) => p.id === platform);
      void shareCardReady(meta?.label);
    },
    [platforms, shareCardReady],
  );

  return (
    <div className={`${styles.wrap} ${compact ? styles.wrapCompact : ""} ${phone ? styles.wrapPhone : ""}`}>
      <p className={styles.heading}>{phone ? "Share to your socials" : "Post to"}</p>
      {phone && (
        <p className={styles.subheading}>
          Tap a network — your roast card image and caption load into the share menu. Pick the app, review, and
          post.
        </p>
      )}

      <div
        className={`${styles.platforms} ${compact ? styles.platformsCompact : ""} ${phone ? styles.platformsPhone : ""}`}
      >
        {platforms.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.platformBtn} ${styles[p.id]} ${phone ? styles.platformBtnPhone : ""}`}
            onClick={() => openPlatform(p.id)}
            title={p.hint}
          >
            {phone ? p.label : compact ? p.label.split(" / ")[0] : p.label}
          </button>
        ))}
      </div>

      {!compact && !phone && (
        <button type="button" className={styles.sharePrimary} onClick={() => void shareCardReady()}>
          Share to socials
        </button>
      )}

      <div className={`${styles.secondary} ${compact ? styles.secondaryCompact : ""}`}>
        {compact && (
          <button type="button" className={styles.ghostBtn} onClick={() => void shareCardReady()}>
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
            {phone ? "Included in your share (also copied as backup)" : "Your post text"}
          </span>
          <pre className={styles.captionText}>{caption}</pre>
        </div>
      )}

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
