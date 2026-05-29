import styles from "./ViolationBadge.module.css";

type Props = {
  violations: string[];
  animate?: boolean;
};

export function ViolationBadge({ violations, animate = true }: Props) {
  return (
    <ul className={styles.list}>
      {violations.map((v, i) => (
        <li
          key={v}
          className={styles.item}
          style={animate ? { animationDelay: `${i * 0.15}s` } : undefined}
        >
          {v}
        </li>
      ))}
    </ul>
  );
}
