import { ViolationBadge } from "../components/ViolationBadge";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function ViolationsScreen() {
  const { roast, setScreen } = useBooth();
  if (!roast) return null;

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Compliance violations detected</h1>
      <ViolationBadge violations={roast.violations} />
      <button type="button" className={styles.btnPrimary} onClick={() => setScreen("pitch")}>
        Continue
      </button>
    </div>
  );
}
