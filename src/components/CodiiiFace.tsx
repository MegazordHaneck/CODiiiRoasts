import { useEffect, useMemo, useState } from "react";
import type { MouthState } from "../lib/face/faceLayout";
import { FACE } from "../lib/face/faceLayout";
import styles from "./CodiiiFace.module.css";

type Props = {
  size?: number;
  mouthState?: MouthState;
  /** 0–1 audio-driven mouth openness (overrides mouthState when speaking) */
  mouthOpenness?: number;
  speaking?: boolean;
  animate?: boolean;
  listening?: boolean;
};

export function CodiiiFace({
  size = 220,
  mouthState = "smile",
  mouthOpenness,
  speaking = false,
  animate = true,
  listening = false,
}: Props) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!animate || speaking) return;
    let id = 0;
    const blinkLoop = () => {
      const delay = 2800 + Math.random() * 3200;
      id = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 100);
        blinkLoop();
      }, delay);
    };
    blinkLoop();
    return () => clearTimeout(id);
  }, [animate, speaking]);

  const effectiveMouth: MouthState = useMemo(() => {
    if (mouthOpenness !== undefined && speaking) {
      if (mouthOpenness < 0.06) return "closed";
      if (mouthOpenness < 0.3) return "mid";
      return "open";
    }
    return mouthState;
  }, [mouthOpenness, mouthState, speaking]);

  const { cx, cy, w } = FACE.mouth;

  return (
    <div
      className={`${styles.wrapper} ${speaking ? styles.speaking : ""} ${listening ? styles.listening : ""} ${animate ? styles.idle : ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="CODiii"
    >
      <svg
        className={styles.svg}
        viewBox={FACE.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Isometric orange head — matches codiii.com icon */}
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
          {/* Side port detail */}
          <rect x="36" y="100" width="14" height="22" rx="2" fill="none" stroke="#121212" strokeWidth="1.5" opacity="0.35" />
        </g>
        {/* Antennae */}
        <g className={styles.antennae}>
          <line x1="72" y1="48" x2="68" y2="28" stroke="#121212" strokeWidth="2" />
          <circle cx="68" cy="26" r="5" fill="#fff" stroke="#121212" strokeWidth="1.5" />
          <line x1="128" y1="48" x2="132" y2="22" stroke="#121212" strokeWidth="2" />
          <circle cx="132" cy="20" r="5" fill="#fff" stroke="#121212" strokeWidth="1.5" />
        </g>
        {/* Face panel */}
        <rect
          x={FACE.panel.x}
          y={FACE.panel.y}
          width={FACE.panel.w}
          height={FACE.panel.h}
          rx={FACE.panel.rx}
          fill="#0a0a0a"
        />
        <ellipse
          cx={FACE.eyeL.cx}
          cy={FACE.eyeL.cy}
          rx={FACE.eyeL.r}
          ry={blink ? 0.8 : FACE.eyeL.r}
          fill="#fff"
        />
        <ellipse
          cx={FACE.eyeR.cx}
          cy={FACE.eyeR.cy}
          rx={FACE.eyeR.r}
          ry={blink ? 0.8 : FACE.eyeR.r}
          fill="#fff"
        />
        <Mouth shape={effectiveMouth} cx={cx} cy={cy} w={w} />
      </svg>
    </div>
  );
}

function Mouth({
  shape,
  cx,
  cy,
  w,
}: {
  shape: MouthState;
  cx: number;
  cy: number;
  w: number;
}) {
  if (shape === "closed") {
    return (
      <line
        x1={cx - w / 2}
        y1={cy}
        x2={cx + w / 2}
        y2={cy}
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  }
  if (shape === "mid") {
    return <ellipse cx={cx} cy={cy} rx={w * 0.32} ry={w * 0.16} fill="#fff" />;
  }
  if (shape === "open") {
    return <ellipse cx={cx} cy={cy + 2} rx={w * 0.34} ry={w * 0.28} fill="#fff" />;
  }
  return (
    <path
      d={`M ${cx - w / 2} ${cy} A ${w / 2} ${w / 2.2} 0 0 0 ${cx + w / 2} ${cy} Z`}
      fill="#fff"
    />
  );
}
