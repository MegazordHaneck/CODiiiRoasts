import { CodiiiBothered } from "../components/CodiiiBothered";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function AttractScreen() {
  const { setScreen } = useBooth();

  return (
    <div className={`${styles.layout} ${styles.attractLayout}`}>
      <CodiiiBothered size={400} />
      <h1 className={styles.attractTitle}>
        <span className={styles.titleAccent}>CODiii</span> Roasts
      </h1>
      <p className={styles.attractSubtitle}>
        Step up. Introduce yourself. Get absolutely roasted.
      </p>
      <button type="button" className={styles.attractBtn} onClick={() => setScreen("intake")}>
        I&apos;m ready — roast me
      </button>
    </div>
  );
}
