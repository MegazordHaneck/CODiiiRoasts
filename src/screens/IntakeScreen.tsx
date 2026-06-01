import { useState } from "react";
import { CodiiiFace } from "../components/CodiiiFace";
import { useBooth } from "../context/BoothContext";
import { useSpeechIntake } from "../hooks/useSpeechIntake";
import { parseIntro } from "../lib/parseIntro";
import styles from "./screens.module.css";

export function IntakeScreen() {
  const { setAttendee, setScreen } = useBooth();
  const { listening, fullText, supported, error, start, stop, reset } = useSpeechIntake();
  const [manual, setManual] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");

  const continueFlow = () => {
    if (manual) {
      if (!name.trim()) return;
      setAttendee({
        name: name.trim(),
        role: role.trim() || "AEC professional",
        company: company.trim() || undefined,
        introTranscript: `My name is ${name.trim()}${company.trim() ? ` from ${company.trim()}` : ""}. I work as ${role.trim() || "an AEC professional"}.`,
      });
    } else {
      const transcript = fullText.trim();
      if (!transcript) return;
      const parsed = parseIntro(transcript);
      setAttendee({
        ...parsed,
        introTranscript: transcript,
      });
    }
    setScreen("intensity");
  };

  const canContinue = manual ? !!name.trim() : fullText.trim().length > 8;

  return (
    <div className={styles.layout}>
      <CodiiiFace size={200} animate listening={listening} />
      <h1 className={styles.title}>Introduce yourself to CODiii</h1>
      <p className={styles.subtitle}>
        Say: &ldquo;Hey CODiii, my name is ___, from ___ — and this is what I do.&rdquo;
      </p>

      {!manual ? (
        <div className={styles.voicePanel}>
          <div className={`${styles.transcriptBox} ${listening ? styles.transcriptLive : ""}`}>
            {fullText || (
              <span className={styles.transcriptPlaceholder}>
                Tap the mic and tell CODiii about yourself…
              </span>
            )}
          </div>
          {!supported && (
            <p className={styles.voiceError}>Voice needs Chrome or Edge. Use type instead below.</p>
          )}
          {error && <p className={styles.voiceError}>{error}</p>}
          <div className={styles.actions}>
            {!listening ? (
              <button type="button" className={styles.btnPrimary} onClick={start} disabled={!supported}>
                Start talking
              </button>
            ) : (
              <button type="button" className={styles.btnSecondary} onClick={stop}>
                Done talking
              </button>
            )}
            {fullText && (
              <button type="button" className={styles.btnSecondary} onClick={reset}>
                Clear
              </button>
            )}
          </div>
        </div>
      ) : (
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            continueFlow();
          }}
        >
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <div className={styles.field}>
            <label htmlFor="role">What you do</label>
            <input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="BIM Manager, GC, etc." />
          </div>
          <div className={styles.field}>
            <label htmlFor="company">Company (optional)</label>
            <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
        </form>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={continueFlow} disabled={!canContinue}>
          Roast me
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => {
            stop();
            setManual((m) => !m);
          }}
        >
          {manual ? "Use voice instead" : "Type instead"}
        </button>
      </div>
    </div>
  );
}
