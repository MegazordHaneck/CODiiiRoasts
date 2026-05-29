import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function PitchScreen() {
  const { setScreen } = useBooth();

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>
        Now that CODiii roasted your coordination problems…
      </h1>
      <p className={styles.subtitle}>
        Want to see how CODiii actually fixes them?
      </p>
      <div className={styles.actions}>
        <a
          href="https://codiii.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimary}
          style={{ textDecoration: "none" }}
        >
          Visit codiii.com
        </a>
        <button type="button" className={styles.btnSecondary} onClick={() => setScreen("share")}>
          Share roast
        </button>
      </div>
    </div>
  );
}
