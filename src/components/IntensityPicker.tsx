import { CodiiiOnFire } from "./CodiiiOnFire";
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
      {INTENSITY_OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className={`${styles.card} ${styles[opt.id]} ${selected ? styles.active : ""}`}
            onClick={() => onChange(opt.id)}
          >
            <div className={styles.copy}>
              <span className={styles.label}>{opt.label}</span>
              <span className={styles.desc}>{opt.desc}</span>
              {selected && <span className={styles.badge}>Selected</span>}
            </div>
            <CodiiiOnFire intensity={opt.id} size={112} active={selected} />
          </button>
        );
      })}
    </div>
  );
}
