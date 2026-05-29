import { useEffect } from "react";
import { RoastCard } from "../components/RoastCard";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function ShareScreen() {
  const { attendee, roast, settings, resetFlow } = useBooth();

  useEffect(() => {
    const id = window.setTimeout(resetFlow, settings.autoResetSeconds * 1000);
    return () => clearTimeout(id);
  }, [resetFlow, settings.autoResetSeconds]);

  if (!attendee || !roast) return null;

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Share your roast</h1>
      <RoastCard name={attendee.name} roast={roast.roast} />
      <p className={styles.subtitle}>
        Auto-reset in {settings.autoResetSeconds}s — or tap below
      </p>
      <button type="button" className={styles.btnPrimary} onClick={resetFlow}>
        Start over
      </button>
    </div>
  );
}
