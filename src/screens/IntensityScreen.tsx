import { IntensityPicker } from "../components/IntensityPicker";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function IntensityScreen() {
  const { intensity, setIntensity, setScreen } = useBooth();

  return (
    <div className={`${styles.layout} ${styles.intensityLayout}`}>
      <h1 className={styles.title}>
        How hot do you want it, <span className={styles.titleAccent}>roastee</span>?
      </h1>
      <p className={styles.subtitle}>
        Pick your heat. CODiii gets more unhinged as the flames rise.
      </p>
      <IntensityPicker value={intensity} onChange={setIntensity} />
      <button type="button" className={`${styles.btnPrimary} ${styles.btnRoast}`} onClick={() => setScreen("scan")}>
        Get Roasted
      </button>
    </div>
  );
}
