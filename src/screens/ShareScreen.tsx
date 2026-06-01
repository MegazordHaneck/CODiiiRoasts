import { useEffect, useRef } from "react";
import { RoastShareCard } from "../components/RoastShareCard";
import { useBooth } from "../context/BoothContext";
import { useWebcamCapture } from "../hooks/useWebcamCapture";
import styles from "./screens.module.css";

export function ShareScreen() {
  const { attendee, roast, settings, webcamPhotoUrl, setWebcamPhotoUrl, resetFlow } = useBooth();
  const { capture } = useWebcamCapture();
  const capturing = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(resetFlow, settings.autoResetSeconds * 1000);
    return () => clearTimeout(id);
  }, [resetFlow, settings.autoResetSeconds]);

  useEffect(() => {
    if (webcamPhotoUrl || capturing.current) return;
    capturing.current = true;
    void capture().then((url) => {
      if (url) setWebcamPhotoUrl(url);
    });
  }, [webcamPhotoUrl, capture, setWebcamPhotoUrl]);

  if (!attendee || !roast) return null;

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Share your roast</h1>
      <p className={styles.subtitle}>Snap included — download and post it.</p>
      <RoastShareCard
        name={attendee.name}
        roast={roast.roast}
        photoUrl={webcamPhotoUrl}
      />
      <p className={styles.subtitle}>
        Auto-reset in {settings.autoResetSeconds}s — or tap below
      </p>
      <button type="button" className={styles.btnPrimary} onClick={resetFlow}>
        Start over
      </button>
    </div>
  );
}
