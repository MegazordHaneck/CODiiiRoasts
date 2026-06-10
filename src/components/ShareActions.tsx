import { useCallback, useState } from "react";
import { composeShareImage } from "../lib/composeShareImage";
import { copyTextReliable } from "../lib/copyText";
import { buildShareCaption, SHARE_PLATFORMS } from "../lib/shareCaption";
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
  const platforms = SHARE_PLATFORMS;

  const copyCaptionToClipboard = useCallback(async (): Promise<boolean> => {
    return copyTextReliable(caption);
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

  /** Card PNG with caption baked in + clipboard copy for the post text field. */
  const shareCardReady = useCallback(async () => {
    setStatus(null);
    const captionCopied = await copyCaptionToClipboard();

    const cardBlob = await getPngBlob();
    if (!cardBlob) {
      setStatus("Could not load your card. Try again in a moment.");
      return;
    }

    const shareBlob = phone ? await composeShareImage(cardBlob, caption) : cardBlob;
    const file = new File([shareBlob], fileName, { type: "image/png" });

    // Many apps (Instagram especially) ignore `text` when `files` is set — caption is on the image + clipboard.
    const shareData: ShareData = { text: caption, files: [file] };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
        setStatus(
          captionCopied
            ? "Pick your app and post. Caption is on the image — paste if the text field is empty."
            : "Pick your app and post. Caption is on the image — copy it below if the text field is empty.",
        );
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          setStatus(null);
          return;
        }
      }
    }

    const url = URL.createObjectURL(shareBlob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    if (!captionCopied) await copyCaptionToClipboard();
    setStatus("Card saved. Paste the caption below if your app did not fill it in.");
  }, [caption, copyCaptionToClipboard, fileName, getPngBlob, phone]);

  const openPlatform = useCallback(() => {
    void shareCardReady();
  }, [shareCardReady]);

  return (
    <div className={`${styles.wrap} ${compact ? styles.wrapCompact : ""} ${phone ? styles.wrapPhone : ""}`}>
      <p className={styles.heading}>{phone ? "Share your roast" : "Post to"}</p>
      {phone && (
        <p className={styles.subheading}>
          Opens your share menu with the roast card and caption. Caption is printed on the image and copied — paste
          only if your app leaves the text field blank.
        </p>
      )}

      {phone ? (
        <button type="button" className={styles.sharePrimary} onClick={() => void shareCardReady()}>
          Share card + caption
        </button>
      ) : (
        <div
          className={`${styles.platforms} ${compact ? styles.platformsCompact : ""}`}
        >
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`${styles.platformBtn} ${styles[p.id]}`}
              onClick={() => openPlatform()}
              title={p.hint}
            >
              {compact ? p.label.split(" / ")[0] : p.label}
            </button>
          ))}
        </div>
      )}

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
            {phone ? "Caption (copied when you share — paste if needed)" : "Your post text"}
          </span>
          <pre className={styles.captionText}>{caption}</pre>
        </div>
      )}

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
