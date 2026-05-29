import { CodiiiFace } from "../components/CodiiiFace";
import { ComplianceScanner } from "../components/ComplianceScanner";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function AttractScreen() {
  const { setScreen } = useBooth();

  return (
    <div className={styles.layout}>
      <CodiiiFace size={200} animate />
      <h1 className={styles.title}>
        <span className={styles.titleAccent}>CODiii</span> Roasts
      </h1>
      <p className={styles.subtitle}>Tell CODiii who you are. Get roasted.</p>
      <ComplianceScanner progress={72} />
      <button type="button" className={styles.btnPrimary} onClick={() => setScreen("intake")}>
        Start
      </button>
    </div>
  );
}
