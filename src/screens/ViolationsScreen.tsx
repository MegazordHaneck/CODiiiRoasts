import { ViolationBadge } from "../components/ViolationBadge";
import { useBooth } from "../context/BoothContext";
import { violationsForRoast } from "../lib/deriveViolations";
import styles from "./screens.module.css";

export function ViolationsScreen() {
  const { roast, setScreen } = useBooth();
  if (!roast) return null;

  const violations = violationsForRoast(roast.roast, roast.violations);

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Flagged from your roast</h1>
      <blockquote className={styles.roastQuote}>&ldquo;{roast.roast}&rdquo;</blockquote>
      <p className={styles.subtitle}>CODiii logged these &ldquo;violations&rdquo; off that burn:</p>
      <ViolationBadge violations={violations} />
      <button type="button" className={styles.btnPrimary} onClick={() => setScreen("pitch")}>
        Continue
      </button>
    </div>
  );
}
