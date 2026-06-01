import styles from "./BottomFlameBar.module.css";

const FLAME_COUNT = 28;

export function BottomFlameBar() {
  return (
    <div className={styles.bar} aria-hidden>
      <div className={styles.glow} />
      <div className={styles.flames}>
        {Array.from({ length: FLAME_COUNT }, (_, i) => (
          <span
            key={i}
            className={styles.flame}
            style={
              {
                "--i": i,
                "--h": `${52 + (i % 5) * 14 + (i % 3) * 8}px`,
                "--delay": `${(i % 7) * 0.09}s`,
                "--dur": `${0.38 + (i % 4) * 0.08}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className={styles.embers}>
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={styles.ember}
            style={
              {
                "--x": `${8 + (i * 7.5) % 92}%`,
                "--delay": `${i * 0.35}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
