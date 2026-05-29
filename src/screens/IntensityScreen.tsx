import { IntensityPicker } from "../components/IntensityPicker";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function IntensityScreen() {
  const { intensity, setIntensity, setScreen } = useBooth();

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Pick your roast intensity</h1>
      <p className={styles.subtitle}>Conference-safe satire. Workflow pain only.</p>
      <IntensityPicker value={intensity} onChange={setIntensity} />
      <button type="button" className={styles.btnPrimary} onClick={() => setScreen("scan")}>
        Run compliance scan
      </button>
    </div>
  );
}
