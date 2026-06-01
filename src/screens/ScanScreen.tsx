import { useEffect, useRef, useState } from "react";
import { CodiiiOnFire } from "../components/CodiiiOnFire";
import { ComplianceScanner } from "../components/ComplianceScanner";
import { useBooth } from "../context/BoothContext";
import { fetchSpeech } from "../lib/api";
import { roastForSpeech } from "../lib/profanityCensor";
import { useRoastStream } from "../hooks/useRoastStream";
import styles from "./screens.module.css";

const SCAN_MS = 9000;

export function ScanScreen() {
  const {
    attendee,
    intensity,
    nsfwPin,
    settings,
    setRoast,
    setRoastSpeechBuffer,
    setScreen,
    logSession,
  } = useBooth();
  const { generate } = useRoastStream();
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!attendee || started.current) return;
    started.current = true;

    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(100, (elapsed / SCAN_MS) * 100));
      if (elapsed < SCAN_MS) requestAnimationFrame(tick);
    };
    tick();

    const scanStart = performance.now();

    const roastPromise = generate({
      name: attendee.name,
      role: attendee.role,
      company: attendee.company,
      introTranscript: attendee.introTranscript,
      industryHatId: attendee.industryHatId,
      intensity,
      safeMode: settings.safeMode,
      nsfwPin: intensity === "nsfw" ? (nsfwPin ?? undefined) : undefined,
    });

    const speechPromise = roastPromise.then((result) => {
      if (!result || settings.mute) return null;
      return fetchSpeech(roastForSpeech(result.roast));
    });

    void Promise.all([
      roastPromise,
      speechPromise,
      new Promise((r) => setTimeout(r, SCAN_MS)),
    ]).then(([result, speechBuffer]) => {
      if (result) {
        setRoast(result);
        if (speechBuffer) setRoastSpeechBuffer(speechBuffer);
        logSession({
          name: attendee.name,
          role: attendee.role,
          intensity,
          fallback: !!result.fallback,
          latencyMs: Math.round(performance.now() - scanStart),
        });
      }
      setScreen("roast");
    });
  }, [
    attendee,
    intensity,
    nsfwPin,
    settings.safeMode,
    settings.mute,
    generate,
    setRoast,
    setRoastSpeechBuffer,
    setScreen,
    logSession,
  ]);

  return (
    <div className={`${styles.layout} ${styles.scanLayout}`}>
      <CodiiiOnFire intensity={intensity} size={180} active />
      <ComplianceScanner progress={progress} glitch={progress > 85} roastMode />
      <p className={styles.subtitle}>
        CODiii is gearing up to roast <strong>{attendee?.name}</strong>…
      </p>
    </div>
  );
}
