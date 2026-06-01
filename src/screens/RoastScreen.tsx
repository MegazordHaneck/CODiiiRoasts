import { useEffect, useRef } from "react";
import { CodiiiFace } from "../components/CodiiiFace";
import { useBooth } from "../context/BoothContext";
import { useCodiiiVoice } from "../hooks/useCodiiiVoice";
import styles from "./screens.module.css";

export function RoastScreen() {
  const { roast, settings, setScreen } = useBooth();
  const { mouthOpenness, isSpeaking, speak } = useCodiiiVoice(settings.volume, settings.mute);
  const spokeRef = useRef(false);

  useEffect(() => {
    if (!roast || settings.mute || spokeRef.current) return;
    spokeRef.current = true;
    void speak(roast.roast);
  }, [roast, speak, settings.mute]);

  if (!roast) return null;

  return (
    <div className={styles.layout}>
      <CodiiiFace
        size={240}
        mouthOpenness={mouthOpenness}
        speaking={isSpeaking}
        animate={!isSpeaking}
      />
      <p className={styles.roastLead}>CODiii says:</p>
      <p className={styles.roastText}>{roast.roast}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={() => setScreen("violations")}>
          View violations
        </button>
      </div>
    </div>
  );
}
