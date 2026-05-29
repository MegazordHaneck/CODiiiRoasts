import { INTENSITY_OPTIONS } from "../types";
import type { Intensity } from "../types";
import styles from "./IntensityPicker.module.css";

type Props = {
  value: Intensity;
  onChange: (v: Intensity) => void;
};

export function IntensityPicker({ value, onChange }: Props) {
  return (
    <div className={styles.grid}>
      {INTENSITY_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`${styles.btn} ${value === opt.id ? styles.active : ""}`}
          onClick={() => onChange(opt.id)}
        >
          <span className={styles.label}>{opt.label}</span>
          <span className={styles.desc}>{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}
