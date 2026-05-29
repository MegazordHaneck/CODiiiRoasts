import { useEffect, useState } from "react";
import type { MouthState } from "../lib/face/faceLayout";
import { FACE_LAYOUT } from "../lib/face/faceLayout";
import styles from "./CodiiiFace.module.css";

type Props = {
  size?: number;
  mouthState?: MouthState;
  speaking?: boolean;
  animate?: boolean;
};

export function CodiiiFace({
  size = 220,
  mouthState = "smile",
  speaking = false,
  animate = true,
}: Props) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const blinkLoop = () => {
      const delay = 3000 + Math.random() * 3000;
      return window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 120);
        id = blinkLoop();
      }, delay);
    };
    let id = blinkLoop();
    return () => clearTimeout(id);
  }, [animate]);

  return (
    <div
      className={`${styles.wrapper} ${speaking ? styles.speaking : ""} ${animate ? styles.idle : ""}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/brand/codiii-face@4x.png"
        alt="CODiii"
        className={styles.base}
        draggable={false}
      />
      <svg
        className={styles.overlay}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect
          x={FACE_LAYOUT.panelLeft * 100}
          y={FACE_LAYOUT.panelTop * 100}
          width={FACE_LAYOUT.panelWidth * 100}
          height={FACE_LAYOUT.panelHeight * 100}
          fill="#000"
          opacity={0.85}
          rx={2}
        />
        <ellipse
          cx={FACE_LAYOUT.eyeLeft * 100}
          cy={FACE_LAYOUT.eyeTop * 100}
          rx={FACE_LAYOUT.eyeRadius * 100}
          ry={blink ? 1 : FACE_LAYOUT.eyeRadius * 100}
          fill="#fff"
        />
        <ellipse
          cx={FACE_LAYOUT.eyeRight * 100}
          cy={FACE_LAYOUT.eyeTop * 100}
          rx={FACE_LAYOUT.eyeRadius * 100}
          ry={blink ? 1 : FACE_LAYOUT.eyeRadius * 100}
          fill="#fff"
        />
        <Mouth shape={mouthState} />
      </svg>
    </div>
  );
}

function Mouth({ shape }: { shape: MouthState }) {
  const cx = FACE_LAYOUT.mouthCenterX * 100;
  const cy = FACE_LAYOUT.mouthCenterY * 100;
  const w = FACE_LAYOUT.mouthWidth * 100;

  if (shape === "closed") {
    return (
      <line
        x1={cx - w / 2}
        y1={cy}
        x2={cx + w / 2}
        y2={cy}
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    );
  }
  if (shape === "mid") {
    return <ellipse cx={cx} cy={cy} rx={w * 0.35} ry={w * 0.18} fill="#fff" />;
  }
  if (shape === "open") {
    return <ellipse cx={cx} cy={cy} rx={w * 0.38} ry={w * 0.32} fill="#fff" />;
  }
  return (
    <path
      d={`M ${cx - w / 2} ${cy} A ${w / 2} ${w / 2} 0 0 0 ${cx + w / 2} ${cy} Z`}
      fill="#fff"
    />
  );
}
