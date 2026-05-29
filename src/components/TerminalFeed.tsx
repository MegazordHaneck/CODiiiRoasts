import { useEffect, useState } from "react";
import styles from "./TerminalFeed.module.css";

type Props = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  active?: boolean;
};

export function TerminalFeed({ text, speed = 22, onComplete, active = true }: Props) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active, onComplete]);

  return (
    <div className={styles.terminal}>
      <span className={styles.prompt}>{">"}</span>
      <span className={styles.text}>{displayed}</span>
      {active && displayed.length < text.length && <span className={styles.cursor} aria-hidden>|</span>}
    </div>
  );
}
