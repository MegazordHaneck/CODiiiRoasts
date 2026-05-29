import { useEffect, useRef, useState } from "react";
import { CodiiiFace } from "../components/CodiiiFace";
import { ComplianceScanner } from "../components/ComplianceScanner";
import { useBooth } from "../context/BoothContext";
import { useRoastStream } from "../hooks/useRoastStream";
import styles from "./screens.module.css";

export function ScanScreen() {
  const { attendee, intensity, settings, setRoast, setScreen, logSession } = useBooth();
  const { generate } = useRoastStream();
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!attendee || started.current) return;
    started.current = true;

    const duration = 9000;
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(100, (elapsed / duration) * 100));
      if (elapsed < duration) requestAnimationFrame(tick);
    };
    tick();

    const scanStart = performance.now();
    generate({
      name: attendee.name,
      role: attendee.role,
      company: attendee.company,
      intensity,
      safeMode: settings.safeMode,
    }).then((result) => {
      if (result) {
        setRoast(result);
        logSession({
          name: attendee.name,
          role: attendee.role,
          intensity,
          fallback: !!result.fallback,
          latencyMs: Math.round(performance.now() - scanStart),
        });
      }
      setTimeout(() => setScreen("roast"), Math.max(0, duration - (performance.now() - scanStart)));
    });
  }, [attendee, intensity, settings.safeMode, generate, setRoast, setScreen, logSession]);

  return (
    <div className={styles.layout}>
      <div className={styles.row}>
        <CodiiiFace size={160} animate />
        <ComplianceScanner progress={progress} glitch={progress > 85} />
      </div>
      <p className={styles.subtitle}>Analyzing {attendee?.name}…</p>
    </div>
  );
}
