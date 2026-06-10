import { useEffect, useState } from "react";
import { exportSessionsCsv, resolveRoastUrl } from "../lib/api";
import { resolveShareApiUrl } from "../lib/shareLinkApi";
import { countMeanModeLines, totalBoothLines } from "../content/pool-stats";
import { countTemplates } from "../content/roast-pools";
import { useBooth } from "../context/BoothContext";
import {
  isAdminSessionAuthed,
  markAdminSessionAuthed,
  verifyAdminPin,
} from "../lib/adminAccess";
import { clearRoastHistory, getUsedRoasts } from "../lib/roastHistory";
import { INTENSITY_OPTIONS } from "../types";
import type { Intensity } from "../types";
import styles from "./screens.module.css";

export function AdminScreen() {
  const [authed, setAuthed] = useState(isAdminSessionAuthed);

  if (!authed) {
    return <AdminLogin onAuthed={() => setAuthed(true)} />;
  }

  return <AdminPanel />;
}

function AdminLogin({ onAuthed }: { onAuthed: () => void }) {
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  const tryAuth = () => {
    const trimmed = pin.trim();
    if (!trimmed) {
      setPinError("Enter the staff PIN.");
      return;
    }
    if (verifyAdminPin(trimmed)) {
      markAdminSessionAuthed();
      setPinError(null);
      onAuthed();
      return;
    }
    setPinError("Wrong PIN — try again.");
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Staff admin</h1>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          tryAuth();
        }}
      >
        <div className={styles.field}>
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            autoFocus
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError(null);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Enter") return;
              e.preventDefault();
              tryAuth();
            }}
          />
        </div>
        {pinError && (
          <p className={styles.pinError} role="alert">
            {pinError}
          </p>
        )}
        <button type="submit" className={styles.btnPrimary}>
          Enter
        </button>
      </form>
    </div>
  );
}

function AdminPanel() {
  const { settings, updateSettings, sessions, killSwitch } = useBooth();
  const [roastApiOn, setRoastApiOn] = useState<boolean | null>(null);
  const [shareApiOn, setShareApiOn] = useState<boolean | null>(null);

  useEffect(() => {
    void resolveRoastUrl().then((url) => setRoastApiOn(!!url));
    void resolveShareApiUrl().then((url) => setShareApiOn(!!url));
  }, []);

  const exportCsv = () => {
    const csv = exportSessionsCsv(sessions);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codiii-roasts-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Booth controls</h1>
      <div className={styles.form}>
        <label className={styles.field}>
          <input
            type="checkbox"
            checked={settings.safeMode}
            onChange={(e) => updateSettings({ safeMode: e.target.checked })}
          />
          {" "}Safe mode
        </label>
        <label className={styles.field}>
          <input
            type="checkbox"
            checked={settings.mute}
            onChange={(e) => updateSettings({ mute: e.target.checked })}
          />
          {" "}Mute voice
        </label>
        <div className={styles.field}>
          <label htmlFor="vol">Volume ({Math.round(settings.volume * 100)}%)</label>
          <input
            id="vol"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="intensity">Default intensity</label>
          <select
            id="intensity"
            value={settings.defaultIntensity}
            onChange={(e) => updateSettings({ defaultIntensity: e.target.value as Intensity })}
          >
            {INTENSITY_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
        <p className={styles.subtitle}>
          Sessions: {sessions.length} · Fallback roasts: {sessions.filter((s) => s.fallback).length}
          <br />
          Services: roast {roastApiOn === null ? "…" : roastApiOn ? "ok" : "missing"} · share{" "}
          {shareApiOn === null ? "…" : shareApiOn ? "ok" : "missing"}
          Roast memory: {getUsedRoasts().length} used · Core templates: {countTemplates("default")}+
          <br />
          Creative library: ~{totalBoothLines()} lines · Mean mode: ~{countMeanModeLines("architect")}+ per role
          <br />
          Industry hats: 80+ roles from /public/industryContext (AECOHats)
          <br />
          Staff PIN: VITE_ADMIN_PIN if set, otherwise VITE_NSFW_PIN (mean mode uses the same).
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.btnSecondary} onClick={exportCsv}>Export CSV</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => {
              if (window.confirm("Clear roast memory for a fresh expo day?")) clearRoastHistory();
            }}
          >
            Clear roast memory
          </button>
          <button type="button" className={styles.btnPrimary} onClick={killSwitch}>Kill switch</button>
        </div>
      </div>
    </div>
  );
}
