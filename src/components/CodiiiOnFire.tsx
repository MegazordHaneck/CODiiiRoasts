import type { Intensity } from "../types";
import styles from "./CodiiiOnFire.module.css";

type Props = {
  intensity: Intensity;
  size?: number;
  /** Extra pop when this option is selected */
  active?: boolean;
};

const TIER: Record<
  Intensity,
  { flame: number; headFill: string; headSide: string; headTop: string; mouth: "smile" | "oh" | "grimace"; eyes: "normal" | "wide" | "stressed"; charred: boolean }
> = {
  light: {
    flame: 1,
    headFill: "#e97024",
    headSide: "#c45e1a",
    headTop: "#f08a3c",
    mouth: "smile",
    eyes: "normal",
    charred: false,
  },
  contractor: {
    flame: 2,
    headFill: "#d96520",
    headSide: "#a85218",
    headTop: "#e07830",
    mouth: "oh",
    eyes: "wide",
    charred: false,
  },
  nuclear: {
    flame: 3,
    headFill: "#8b4a12",
    headSide: "#5c3010",
    headTop: "#a85a18",
    mouth: "grimace",
    eyes: "stressed",
    charred: true,
  },
};

export function CodiiiOnFire({ intensity, size = 88, active = false }: Props) {
  const t = TIER[intensity];

  return (
    <div
      className={`${styles.wrap} ${styles[intensity]} ${active ? styles.active : ""}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg className={styles.svg} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <Flames tier={t.flame} />
        <g className={styles.mascot}>
          <path
            d="M28 38 L92 38 L102 62 L102 92 L18 92 L18 62 Z"
            fill={t.headFill}
            stroke="#121212"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M92 38 L102 62 L102 92 L92 92 L92 38" fill={t.headSide} stroke="#121212" strokeWidth="1.5" />
          <path d="M28 38 L92 38 L102 62 L18 62 Z" fill={t.headTop} stroke="#121212" strokeWidth="1.5" />
          {t.charred && (
            <>
              <ellipse cx="42" cy="72" rx="8" ry="5" fill="#2a1810" opacity="0.55" />
              <ellipse cx="78" cy="78" rx="10" ry="6" fill="#2a1810" opacity="0.5" />
            </>
          )}
          <line x1="44" y1="36" x2="42" y2="22" stroke="#121212" strokeWidth="1.5" />
          <circle cx="42" cy="20" r="3.5" fill={intensity === "nuclear" ? "#666" : "#fff"} stroke="#121212" strokeWidth="1" />
          <line x1="76" y1="36" x2="78" y2="18" stroke="#121212" strokeWidth="1.5" />
          <circle cx="78" cy="16" r="3.5" fill={intensity === "nuclear" ? "#666" : "#fff"} stroke="#121212" strokeWidth="1" />
          <rect x="38" y="52" width="44" height="32" rx="3" fill="#0a0a0a" />
          <Eyes variant={t.eyes} />
          <Mouth variant={t.mouth} />
        </g>
        {t.flame >= 2 && <Flames tier={t.flame} front />}
      </svg>
    </div>
  );
}

function Flames({ tier, front }: { tier: number; front?: boolean }) {
  const opacity = front ? 0.85 : 0.7;
  if (tier === 1) {
    return (
      <g className={styles.flames} opacity={opacity}>
        <path className={styles.flameA} d="M52 95 Q54 78 58 95 Z" fill="#ff9a3c" />
        <path className={styles.flameB} d="M60 96 Q62 76 66 96 Z" fill="#ff6b2b" />
        <path className={styles.flameC} d="M68 95 Q70 80 74 95 Z" fill="#ff9a3c" />
      </g>
    );
  }
  if (tier === 2) {
    return (
      <g className={styles.flames} opacity={opacity}>
        <path className={styles.flameA} d="M38 98 Q40 68 48 98 Z" fill="#ff8c2a" />
        <path className={styles.flameB} d="M52 100 Q54 58 62 100 Z" fill="#ff4d00" />
        <path className={styles.flameC} d="M66 100 Q68 62 76 100 Z" fill="#ff6b2b" />
        <path className={styles.flameD} d="M80 98 Q82 72 88 98 Z" fill="#ff9a3c" />
        <path className={styles.flameE} d="M22 88 Q18 70 28 90 Z" fill="#ffb347" opacity="0.8" />
        <path className={styles.flameF} d="M94 88 Q98 68 102 90 Z" fill="#ffb347" opacity="0.8" />
      </g>
    );
  }
  return (
    <g className={styles.flames} opacity={opacity}>
      <path className={styles.flameA} d="M28 102 Q30 48 42 102 Z" fill="#ff5500" />
      <path className={styles.flameB} d="M48 105 Q50 38 62 105 Z" fill="#ff2200" />
      <path className={styles.flameC} d="M68 105 Q70 42 80 105 Z" fill="#ff4400" />
      <path className={styles.flameD} d="M88 102 Q90 52 100 102 Z" fill="#ff6600" />
      <path className={styles.flameE} d="M8 92 Q4 55 20 95 Z" fill="#ffaa00" />
      <path className={styles.flameF} d="M102 92 Q108 50 114 95 Z" fill="#ffaa00" />
      <path className={styles.flameG} d="M55 108 Q58 28 65 108 Z" fill="#fff176" opacity="0.5" />
    </g>
  );
}

function Eyes({ variant }: { variant: "normal" | "wide" | "stressed" }) {
  if (variant === "stressed") {
    return (
      <>
        <path d="M48 64 L54 70 M54 64 L48 70" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M66 64 L72 70 M72 64 L66 70" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }
  const r = variant === "wide" ? 5 : 4;
  return (
    <>
      <ellipse cx="51" cy="67" rx={r} ry={r * 1.1} fill="#fff" />
      <ellipse cx="69" cy="67" rx={r} ry={r * 1.1} fill="#fff" />
      {variant === "wide" && (
        <>
          <circle cx="51" cy="68" r="1.5" fill="#121212" />
          <circle cx="69" cy="68" r="1.5" fill="#121212" />
        </>
      )}
    </>
  );
}

function Mouth({ variant }: { variant: "smile" | "oh" | "grimace" }) {
  if (variant === "smile") {
    return (
      <path
        d="M48 78 A 12 10 0 0 0 72 78"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  }
  if (variant === "oh") {
    return <ellipse cx="60" cy="80" rx="7" ry="9" fill="#fff" />;
  }
  return (
    <path
      d="M48 82 Q60 74 72 82"
      fill="none"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  );
}
