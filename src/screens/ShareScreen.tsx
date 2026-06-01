import { useEffect, useRef, useState } from "react";
import { blobToBase64, createShareLink } from "../lib/shareLinkApi";
import { RoastShareCard, type RoastShareCardHandle } from "../components/RoastShareCard";
import { ShareActions } from "../components/ShareActions";
import { WebcamCapture } from "../components/WebcamCapture";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

const SHARE_RESET_SECONDS = 90;

export function ShareScreen() {
  const { attendee, roast, webcamPhotoUrl, setWebcamPhotoUrl, resetFlow } = useBooth();
  const cardRef = useRef<RoastShareCardHandle>(null);
  const [secondsLeft, setSecondsLeft] = useState(SHARE_RESET_SECONDS);
  const [sharePageUrl, setSharePageUrl] = useState<string | null>(null);
  const [qrHint, setQrHint] = useState<string | null>(null);
  const uploadedRef = useRef(false);

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

    const publish = async () => {
      await new Promise((r) => setTimeout(r, 400));
      const blob = await cardRef.current?.getPngBlob();
      if (!blob) return;
      uploadedRef.current = true;
      const pngBase64 = await blobToBase64(blob);
      const link = await createShareLink({
        pngBase64,
        name: attendee.name,
        roast: roast.roast,
      });
      if (link) {
        setSharePageUrl(link.sharePageUrl);
        setQrHint("Scan with your phone — post from there, no PC login.");
      } else {
        setQrHint("QR links to codiii.com — use Save below for the card.");
        setSharePageUrl("https://codiii.com");
      }
    };

    void publish();
  }, [webcamPhotoUrl, attendee, roast]);

  if (!attendee || !roast) return null;

  const fileName = `codiii-roast-${attendee.name.replace(/\s+/g, "-").toLowerCase()}.png`;

  return (
    <div className={styles.shareLayout}>
      {!webcamPhotoUrl ? (
        <>
          <h1 className={styles.shareTitle}>Share your roast</h1>
          <p className={styles.shareHint}>Take your photo — then scan the QR on your phone.</p>
          <WebcamCapture compact photoUrl={webcamPhotoUrl} onCapture={setWebcamPhotoUrl} />
        </>
      ) : (
        <div className={styles.shareReady}>
          <h1 className={styles.shareTitle}>Share your roast</h1>
          {qrHint && <p className={styles.shareQrHint}>{qrHint}</p>}
          <div className={styles.shareCardWrap}>
            <RoastShareCard
              ref={cardRef}
              compact
              name={attendee.name}
              roast={roast.roast}
              photoUrl={webcamPhotoUrl}
              qrUrl={sharePageUrl ?? undefined}
            />
          </div>
          <ShareActions
            compact
            roast={roast.roast}
            fileName={fileName}
            getPngBlob={() => cardRef.current?.getPngBlob() ?? Promise.resolve(null)}
          />
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
