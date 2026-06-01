import { useEffect, useState } from "react";
import scanPhases from "../content/scan-phases.json";
import styles from "./ComplianceScanner.module.css";

type Props = {
  progress: number;
  label?: string;
  glitch?: boolean;
  /** Roast prep mode — no compliance wording */
  roastMode?: boolean;
};

export function ComplianceScanner({
  progress,
  label,
  glitch = false,
  roastMode = false,
}: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phases = scanPhases as string[];

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhaseIndex((i) => (i + 1) % phases.length);
    }, 2200);
    return () => clearInterval(id);
  }, [phases.length]);

  const displayLabel = label ?? phases[phaseIndex];

  return (
    <div className={`${styles.panel} ${glitch ? styles.glitch : ""} ${roastMode ? styles.roastPanel : ""}`}>
      <p className={styles.label}>
        {roastMode ? (
          <>
            <span className={styles.roastEmoji} aria-hidden>
              🔥
            </span>{" "}
            {displayLabel}
          </>
        ) : (
          <>
            <strong>Compliance Scan</strong> — {displayLabel}
          </>
        )}
      </p>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={displayLabel}
      >
        <div className={styles.fill} style={{ width: `${Math.min(100, progress)}%` }} />
      </div>
      <span className={styles.percent}>
        {Math.round(progress)}% — {roastMode ? "heating up" : "complete"}
      </span>
    </div>
  );
}
