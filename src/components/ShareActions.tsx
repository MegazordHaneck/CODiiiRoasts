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
};

export function ShareActions({ roast, getPngBlob, fileName }: Props) {
  const caption = buildShareCaption(roast);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const copyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setStatus("Caption copied!");
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setStatus("Could not copy — select the text below and copy manually.");
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
        /* user cancelled or failed */
      }
    }
    await downloadImage();
    await copyCaption();
    setStatus("Image downloaded and caption copied — pick your app and paste.");
  }, [caption, downloadImage, copyCaption, getPngBlob, fileName]);

  const openPlatform = useCallback(
    async (platform: SharePlatform) => {
      setStatus(null);

      if (platform === "instagram") {
        await downloadImage();
        await copyCaption();
        setStatus("Image saved & caption copied. Open Instagram and add both.");
        return;
      }

      const url = getShareUrl(platform, caption);
      if (!url) return;

      if (platform === "facebook") {
        await copyCaption();
        setStatus("Caption copied — paste it when Facebook opens.");
      }

      window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
    },
    [caption, downloadImage, copyCaption],
  );

  return (
    <div className={styles.wrap}>
      <p className={styles.heading}>Share on your platform</p>
      <div className={styles.platforms}>
        {SHARE_PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.platformBtn} ${styles[p.id]}`}
            onClick={() => void openPlatform(p.id)}
            title={p.hint}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.secondary}>
        <button type="button" className={styles.ghostBtn} onClick={() => void shareNative()}>
          Share / save image
        </button>
        <button type="button" className={styles.ghostBtn} onClick={() => void downloadImage()}>
          Download image
        </button>
        <button type="button" className={styles.ghostBtn} onClick={() => void copyCaption()}>
          {copied ? "Copied!" : "Copy caption"}
        </button>
      </div>

      <div className={styles.captionPreview}>
        <span className={styles.captionLabel}>Your post text</span>
        <pre className={styles.captionText}>{caption}</pre>
      </div>

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
}
