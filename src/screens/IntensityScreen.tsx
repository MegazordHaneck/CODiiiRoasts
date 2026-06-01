import { useEffect } from "react";
import { IntensityPicker } from "../components/IntensityPicker";
import { useBooth } from "../context/BoothContext";
import styles from "./screens.module.css";

export function IntensityScreen() {
  const { intensity, setIntensity, setNsfwPin, settings, setScreen } = useBooth();

  useEffect(() => {
    if (settings.safeMode && intensity === "nsfw") {
      setIntensity(settings.defaultIntensity);
      setNsfwPin(null);
    }
  }, [settings.safeMode, settings.defaultIntensity, intensity, setIntensity, setNsfwPin]);

  return (
    <div className={`${styles.layout} ${styles.intensityLayout}`}>
      <h1 className={styles.title}>
        How hot do you want it, <span className={styles.titleAccent}>roastee</span>?
      </h1>
      <p className={styles.subtitle}>
        Pick your heat — scroll for <strong>18+ Mean mode</strong> (staff PIN). CODiii gets more unhinged as the
        flames rise.
        {intensity === "nsfw" && (
          <span className={styles.nsfwReminder}>
            Mean mode — vulgar, vivid AEC humor; profanity likely.
          </span>
        )}
      </p>
      <IntensityPicker
        value={intensity}
        onChange={setIntensity}
        safeMode={settings.safeMode}
        onNsfwUnlock={(pin) => setNsfwPin(pin)}
      />
      <button type="button" className={`${styles.btnPrimary} ${styles.btnRoast}`} onClick={() => setScreen("scan")}>
        Get Roasted
      </button>
    </div>
  );
}
