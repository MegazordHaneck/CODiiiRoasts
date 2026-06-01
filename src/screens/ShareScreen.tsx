import { useEffect, useRef } from "react";
import { RoastShareCard, type RoastShareCardHandle } from "../components/RoastShareCard";
import { ShareActions } from "../components/ShareActions";
import { WebcamCapture } from "../components/WebcamCapture";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function ShareScreen() {
  const { attendee, roast, settings, webcamPhotoUrl, setWebcamPhotoUrl, resetFlow } = useBooth();
  const cardRef = useRef<RoastShareCardHandle>(null);

  useEffect(() => {
    const id = window.setTimeout(resetFlow, settings.autoResetSeconds * 1000);
    return () => clearTimeout(id);
  }, [resetFlow, settings.autoResetSeconds]);

  if (!attendee || !roast) return null;

  const fileName = `codiii-roast-${attendee.name.replace(/\s+/g, "-").toLowerCase()}.png`;

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Share your roast</h1>
      <p className={styles.subtitle}>Take your photo, then post the card.</p>
      <WebcamCapture photoUrl={webcamPhotoUrl} onCapture={setWebcamPhotoUrl} />
      {webcamPhotoUrl && (
        <>
          <RoastShareCard
            ref={cardRef}
            name={attendee.name}
            roast={roast.roast}
            photoUrl={webcamPhotoUrl}
          />
          <ShareActions
            roast={roast.roast}
            fileName={fileName}
            getPngBlob={() => cardRef.current?.getPngBlob() ?? Promise.resolve(null)}
          />
        </>
      )}
      <p className={styles.subtitle}>
        Auto-reset in {settings.autoResetSeconds}s — or tap below
      </p>
      <button type="button" className={styles.btnPrimary} onClick={resetFlow}>
        Start over
      </button>
    </div>
  );
}
