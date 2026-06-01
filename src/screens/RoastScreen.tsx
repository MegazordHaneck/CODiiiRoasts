import { useEffect, useRef, useState } from "react";
import { CodiiiFace } from "../components/CodiiiFace";
import { useBooth } from "../context/BoothContext";
import { useCodiiiVoice } from "../hooks/useCodiiiVoice";
import { roastForSpeech } from "../lib/profanityCensor";
import styles from "./screens.module.css";

export function RoastScreen() {
  const { roast, settings, roastSpeechBuffer, setRoastSpeechBuffer, setScreen } = useBooth();
  const { mouthOpenness, eyeOpenness, isSpeaking, speakFromBuffer } = useCodiiiVoice(
    settings.volume,
    settings.mute,
  );
  const spokeRef = useRef(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isSpeaking) setShowText(true);
  }, [isSpeaking]);

  useEffect(() => {
    if (!roast || spokeRef.current) return;
    spokeRef.current = true;

    const run = async () => {
      if (settings.mute) {
        setShowText(true);
        return;
      }
      const buffer = roastSpeechBuffer;
      setRoastSpeechBuffer(null);
      const played = await speakFromBuffer(buffer, roastForSpeech(roast.roast));
      if (played) setShowText(true);
    };

    void run();
  }, [roast, settings.mute, roastSpeechBuffer, setRoastSpeechBuffer, speakFromBuffer]);

  if (!roast) return null;

  return (
    <div className={styles.layout}>
      <CodiiiFace
        size={300}
        mouthOpenness={mouthOpenness}
        eyeOpenness={eyeOpenness}
        speaking={isSpeaking}
        animate
      />
      <p className={styles.roastLead}>
        CODiii says:
        {roast.fallback ? (
          <span className={styles.roastOfflineTag} title="Roast API URL missing or request failed — using local library">
            {" "}
            (offline roast)
          </span>
        ) : null}
      </p>
      <p
        className={`${styles.roastText} ${showText ? styles.roastTextVisible : styles.roastTextHidden}`}
        aria-live="polite"
      >
        {showText ? roast.roast : "…"}
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => setScreen("violations")}
          disabled={!showText}
        >
          View violations
        </button>
      </div>
    </div>
  );
}
