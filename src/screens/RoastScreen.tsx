import { useEffect, useState } from "react";
import { CodiiiFace } from "../components/CodiiiFace";
import { TerminalFeed } from "../components/TerminalFeed";
import { useBooth } from "../context/BoothContext";
import { useCodiiiVoice } from "../hooks/useCodiiiVoice";
import styles from "./screens.module.css";

export function RoastScreen() {
  const { roast, settings, setScreen } = useBooth();
  const { mouthState, isSpeaking, speak } = useCodiiiVoice(settings.volume, settings.mute);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    if (typed && roast && !settings.mute) {
      void speak(roast.roast);
    }
  }, [typed, roast, speak, settings.mute]);

  if (!roast) return null;

  return (
    <div className={styles.layout}>
      <div className={styles.row}>
        <CodiiiFace size={200} mouthState={mouthState} speaking={isSpeaking} animate />
        <div style={{ flex: 1, minWidth: 280 }}>
          {!typed ? (
            <TerminalFeed text={roast.roast} onComplete={() => setTyped(true)} />
          ) : (
            <p className={styles.roastText}>{roast.roast}</p>
          )}
        </div>
      </div>
      {typed && (
        <div className={styles.actions}>
          <button type="button" className={styles.btnPrimary} onClick={() => setScreen("violations")}>
            View violations
          </button>
        </div>
      )}
    </div>
  );
}
