import { useCallback, useEffect, useRef, useState } from "react";
import { blobToBase64, createShareLink } from "../lib/shareLinkApi";
import { RoastShareCard, type RoastShareCardHandle } from "../components/RoastShareCard";
import { ShareEmailPanel } from "../components/ShareEmailPanel";
import { ShareScanQr } from "../components/ShareScanQr";
import { WebcamCapture } from "../components/WebcamCapture";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

const SHARE_RESET_SECONDS = 90;
const UPLOAD_RETRIES = 6;

export function ShareScreen() {
  const { attendee, roast, webcamPhotoUrl, setWebcamPhotoUrl, resetFlow } = useBooth();
  const cardRef = useRef<RoastShareCardHandle>(null);
  const [secondsLeft, setSecondsLeft] = useState(SHARE_RESET_SECONDS);
  const [sharePageUrl, setSharePageUrl] = useState<string | null>(null);
  const [shareId, setShareId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadedRef = useRef(false);

  const publishShare = useCallback(async () => {
    if (!webcamPhotoUrl || !attendee || !roast) return;
    setUploading(true);
    setUploadError(null);

    await new Promise((r) => setTimeout(r, 400));
    const blob = await cardRef.current?.getPngBlob();
    if (!blob) {
      setUploadError("Could not render your card. Tap retry.");
      setUploading(false);
      return;
    }

    const pngBase64 = await blobToBase64(blob);

    for (let attempt = 0; attempt < UPLOAD_RETRIES; attempt++) {
      const link = await createShareLink({
        pngBase64,
        name: attendee.name,
        role: attendee.role,
        company: attendee.company,
        roast: roast.roast,
      });
      if (link) {
        setSharePageUrl(link.sharePageUrl);
        setShareId(link.id);
        setUploading(false);
        return;
      }
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }

    setUploadError("Could not publish your card right now. Tap retry.");
    setUploading(false);
  }, [webcamPhotoUrl, attendee, roast]);

  useEffect(() => {
    if (!webcamPhotoUrl) return;

    setSecondsLeft(SHARE_RESET_SECONDS);
    const tick = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    const reset = window.setTimeout(() => resetFlow(), SHARE_RESET_SECONDS * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(reset);
    };
  }, [webcamPhotoUrl, resetFlow]);

  useEffect(() => {
    if (!webcamPhotoUrl || !attendee || !roast || uploadedRef.current) return;
    uploadedRef.current = true;
    void publishShare();
  }, [webcamPhotoUrl, attendee, roast, publishShare]);

  if (!attendee || !roast) return null;

  return (
    <div className={styles.shareLayout}>
      {!webcamPhotoUrl ? (
        <>
          <h1 className={styles.shareTitle}>Share your roast</h1>
          <p className={styles.shareHint}>
            Take your photo on this laptop — then scan the QR with your phone&apos;s <strong>Camera</strong> app, or
            enter your email below.
          </p>
          <WebcamCapture compact photoUrl={webcamPhotoUrl} onCapture={setWebcamPhotoUrl} />
        </>
      ) : (
        <div className={styles.shareReady}>
          <h1 className={styles.shareTitle}>Take it with you</h1>
          <p className={styles.shareHint}>
            <strong>Phone:</strong> open Camera → scan QR → share on Instagram, LinkedIn, or Facebook.
            <br />
            <strong>Email:</strong> enter your address on the right and we&apos;ll send the card.
          </p>
          <div className={styles.shareRow}>
            <div className={styles.shareCardWrap}>
              <RoastShareCard
                ref={cardRef}
                booth
                name={attendee.name}
                roast={roast.roast}
                photoUrl={webcamPhotoUrl}
                qrUrl={sharePageUrl ?? undefined}
              />
            </div>
            <div className={styles.shareAside}>
              <ShareScanQr
                url={sharePageUrl}
                loading={uploading}
                error={uploadError}
                onRetry={() => {
                  uploadedRef.current = true;
                  void publishShare();
                }}
              />
              <ShareEmailPanel shareId={shareId} ready={!!shareId} loading={uploading} />
            </div>
          </div>
          <div className={styles.shareFooter}>
            <p className={styles.shareReset}>Auto-reset in {secondsLeft}s</p>
            <button type="button" className={styles.shareDoneBtn} onClick={resetFlow}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
