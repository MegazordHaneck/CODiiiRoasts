import { useEffect, useState } from "react";
import styles from "./CodiiiBothered.module.css";

const MOODS = ["fire", "laugh", "explode", "tongue"] as const;
type Mood = (typeof MOODS)[number];

const MOOD_LABEL: Record<Mood, string> = {
  fire: "CODiii is heating up…",
  laugh: "CODiii is laughing at you already…",
  explode: "CODiii's brain just blue-screened…",
  tongue: "CODiii is not impressed…",
};

type Props = {
  size?: number;
};

export function CodiiiBothered({ size = 380 }: Props) {
  const [mood, setMood] = useState<Mood>("fire");

  useEffect(() => {
    const id = window.setInterval(() => {
      setMood((m) => MOODS[(MOODS.indexOf(m) + 1) % MOODS.length]);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={styles.stage} style={{ width: size, height: size }}>
      <p className={styles.moodCaption} aria-live="polite">
        {MOOD_LABEL[mood]}
      </p>
      <div className={`${styles.mascot} ${styles[mood]}`} data-mood={mood}>
        <svg className={styles.svg} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <g className={styles.explodeBurst} aria-hidden>
            <circle cx="100" cy="95" r="4" fill="#ffeb3b" />
            <circle cx="72" cy="70" r="3" fill="#ff9800" />
            <circle cx="128" cy="68" r="3" fill="#ff5722" />
            <circle cx="55" cy="100" r="2.5" fill="#fff176" />
            <circle cx="145" cy="102" r="2.5" fill="#ff9800" />
            <line x1="100" y1="40" x2="100" y2="28" stroke="#ffeb3b" strokeWidth="2" />
            <line x1="85" y1="45" x2="76" y2="36" stroke="#ff9800" strokeWidth="2" />
            <line x1="115" y1="45" x2="124" y2="36" stroke="#ff9800" strokeWidth="2" />
          </g>

          <g className={styles.head}>
            <path
              d="M48 52 L152 52 L168 88 L168 148 L32 148 L32 88 Z"
              fill="#e97024"
              stroke="#121212"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M152 52 L168 88 L168 148 L152 148 L152 52" fill="#c45e1a" stroke="#121212" strokeWidth="2" />
            <path d="M48 52 L152 52 L168 88 L32 88 Z" fill="#f08a3c" stroke="#121212" strokeWidth="2" />
          </g>

          <g className={styles.antennae}>
            <line x1="72" y1="48" x2="68" y2="28" stroke="#121212" strokeWidth="2" />
            <circle cx="68" cy="26" r="5" fill="#fff" stroke="#121212" strokeWidth="1.5" />
            <line x1="128" y1="48" x2="132" y2="22" stroke="#121212" strokeWidth="2" />
            <circle cx="132" cy="20" r="5" fill="#fff" stroke="#121212" strokeWidth="1.5" />
          </g>

          <rect x="62" y="78" width="76" height="52" rx="4" fill="#0a0a0a" />

          <g className={styles.eyesNormal}>
            <ellipse cx="82" cy="98" rx="7" ry="7" fill="#fff" />
            <ellipse cx="118" cy="98" rx="7" ry="7" fill="#fff" />
          </g>

          <g className={styles.eyesLaugh}>
            <path d="M75 98 Q82 92 89 98" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M111 98 Q118 92 125 98" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g className={styles.eyesExplode}>
            <path d="M76 94 L88 102 M88 94 L76 102" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M112 94 L124 102 M124 94 L112 102" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g className={styles.eyesTongue}>
            <ellipse cx="82" cy="98" rx="7" ry="7" fill="#fff" />
            <path d="M111 98 Q118 92 125 98" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          <g className={styles.mouthSmile}>
            <path
              d="M78 118 A 22 18 0 0 0 122 118"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          <g className={styles.mouthLaugh}>
            <ellipse cx="100" cy="122" rx="18" ry="14" fill="#fff" />
            <ellipse cx="100" cy="118" rx="12" ry="6" fill="#0a0a0a" />
          </g>

          <g className={styles.mouthOpen}>
            <ellipse cx="100" cy="120" rx="12" ry="14" fill="#fff" />
          </g>

          <g className={styles.mouthFire}>
            <ellipse cx="100" cy="118" rx="10" ry="11" fill="#fff" />
          </g>

          <g className={styles.flames}>
            <path className={styles.flame1} d="M88 128 Q90 108 94 128 Z" fill="#ff9a3c" />
            <path className={styles.flame2} d="M96 130 Q98 100 102 130 Z" fill="#ff5500" />
            <path className={styles.flame3} d="M104 128 Q106 110 110 128 Z" fill="#ff6b2b" />
            <path className={styles.flame4} d="M92 132 Q100 88 108 132 Z" fill="#fff176" opacity="0.7" />
          </g>

          <g className={styles.tongue}>
            <ellipse cx="100" cy="132" rx="9" ry="14" fill="#ff6b8a" />
            <ellipse cx="100" cy="126" rx="7" ry="5" fill="#ff8fa8" />
          </g>
        </svg>
      </div>
    </div>
  );
}
