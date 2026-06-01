import { useState } from "react";
import { NSFW_DISCLAIMER } from "../content/nsfw-burns";
import { CodiiiOnFire } from "./CodiiiOnFire";
import {
  getNsfwPin,
  isNsfwSessionUnlocked,
  markNsfwDisclaimerAccepted,
  markNsfwSessionUnlocked,
} from "../lib/nsfwAccess";
import { INTENSITY_OPTIONS, NSFW_INTENSITY_OPTION } from "../types";
import type { Intensity } from "../types";
import styles from "./IntensityPicker.module.css";

type Props = {
  value: Intensity;
  onChange: (v: Intensity) => void;
  safeMode: boolean;
  onNsfwUnlock: (pin: string) => void;
};

export function IntensityPicker({ value, onChange, safeMode, onNsfwUnlock }: Props) {
  const [nsfwUnlocked, setNsfwUnlocked] = useState(isNsfwSessionUnlocked);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerOk, setDisclaimerOk] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const nsfw = NSFW_INTENSITY_OPTION;
  const nsfwSelected = value === "nsfw";
  const nsfwDisabled = safeMode;

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === getNsfwPin()) {
      markNsfwDisclaimerAccepted();
      markNsfwSessionUnlocked();
      onNsfwUnlock(pin.trim());
      setNsfwUnlocked(true);
      setShowPin(false);
      setShowDisclaimer(false);
      setPin("");
      setPinError(false);
      onChange("nsfw");
    } else {
      setPinError(true);
    }
  };

  const onNsfwCardClick = () => {
    if (nsfwDisabled) return;
    if (nsfwUnlocked) {
      onChange("nsfw");
      return;
    }
    setShowDisclaimer(true);
    setShowPin(false);
    setDisclaimerOk(false);
    setPinError(false);
  };

  const cancelNsfwFlow = () => {
    setShowDisclaimer(false);
    setShowPin(false);
    setDisclaimerOk(false);
    setPin("");
    setPinError(false);
  };

  const continueAfterDisclaimer = () => {
    if (!disclaimerOk) return;
    markNsfwDisclaimerAccepted();
    setShowDisclaimer(false);
    setShowPin(true);
  };

  return (
    <div className={styles.stack}>
      <div className={styles.grid}>
        {INTENSITY_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              className={`${styles.card} ${styles[opt.id]} ${selected ? styles.active : ""}`}
              onClick={() => onChange(opt.id)}
            >
              <div className={styles.copy}>
                <span className={styles.label}>{opt.label}</span>
                <span className={styles.desc}>{opt.desc}</span>
                {selected && <span className={styles.badge}>Selected</span>}
              </div>
              <CodiiiOnFire intensity={opt.id} size={112} active={selected} />
            </button>
          );
        })}
      </div>

      <div className={styles.nsfwBlock}>
        <button
          type="button"
          disabled={nsfwDisabled}
          className={`${styles.card} ${styles.nsfw} ${nsfwSelected ? styles.active : ""} ${!nsfwUnlocked ? styles.locked : ""}`}
          onClick={onNsfwCardClick}
        >
          <div className={styles.copy}>
            <span className={styles.label}>
              {nsfw.label}
              {!nsfwUnlocked && !nsfwDisabled && (
                <span className={styles.lockTag} aria-hidden>
                  {" "}
                  🔒
                </span>
              )}
            </span>
            <span className={styles.desc}>
              {nsfwDisabled
                ? "Turn off safe mode in admin to enable staff-only mean roasts."
                : nsfwUnlocked
                  ? nsfw.desc
                  : "Disclaimer + staff PIN — adults not easily offended"}
            </span>
            {nsfwSelected && <span className={styles.badge}>Selected</span>}
            {nsfwDisabled && <span className={styles.badgeMuted}>Disabled</span>}
          </div>
          <CodiiiOnFire intensity="nsfw" size={112} active={nsfwSelected} />
        </button>

        {nsfwSelected && nsfwUnlocked && (
          <p className={styles.disclaimerActive} role="status">
            Mean mode active — harsh humor enabled for this guest.
          </p>
        )}

        {showDisclaimer && !nsfwUnlocked && !nsfwDisabled && (
          <div className={styles.disclaimerPanel} role="dialog" aria-labelledby="nsfw-disclaimer-title">
            <h3 id="nsfw-disclaimer-title" className={styles.disclaimerTitle}>
              {NSFW_DISCLAIMER.title}
            </h3>
            <ul className={styles.disclaimerList}>
              {NSFW_DISCLAIMER.bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <label className={styles.disclaimerCheck}>
              <input
                type="checkbox"
                checked={disclaimerOk}
                onChange={(e) => setDisclaimerOk(e.target.checked)}
              />
              <span>{NSFW_DISCLAIMER.checkbox}</span>
            </label>
            <div className={styles.disclaimerActions}>
              <button type="button" className={styles.disclaimerCancel} onClick={cancelNsfwFlow}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.disclaimerContinue}
                disabled={!disclaimerOk}
                onClick={continueAfterDisclaimer}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {showPin && !nsfwUnlocked && !nsfwDisabled && (
          <form className={styles.pinForm} onSubmit={submitPin}>
            <p className={styles.pinIntro}>Staff PIN — mean mode stays off the menu until you unlock it.</p>
            <label className={styles.pinLabel} htmlFor="nsfw-pin">
              Staff PIN
            </label>
            <div className={styles.pinRow}>
              <input
                id="nsfw-pin"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                className={styles.pinInput}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN"
              />
              <button type="submit" className={styles.pinSubmit}>
                Unlock mean mode
              </button>
            </div>
            {pinError && <p className={styles.pinError}>Wrong PIN</p>}
            <button type="button" className={styles.pinBack} onClick={cancelNsfwFlow}>
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
