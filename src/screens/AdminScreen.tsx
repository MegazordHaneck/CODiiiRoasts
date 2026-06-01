import { useState } from "react";
import { exportSessionsCsv } from "../lib/api";
import { countTemplates } from "../content/roast-pools";
import { useBooth } from "../context/BoothContext";
import { clearRoastHistory, getUsedRoasts } from "../lib/roastHistory";
import { INTENSITY_OPTIONS } from "../types";
import type { Intensity } from "../types";
import styles from "./screens.module.css";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? "1234";

export function AdminScreen() {
  const { settings, updateSettings, sessions, killSwitch } = useBooth();
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return (
      <div className={styles.layout}>
        <h1 className={styles.title}>Staff admin</h1>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (pin === ADMIN_PIN) setAuthed(true);
          }}
        >
          <div className={styles.field}>
            <label htmlFor="pin">PIN</label>
            <input id="pin" type="password" value={pin} onChange={(e) => setPin(e.target.value)} />
          </div>
          <button type="submit" className={styles.btnPrimary}>Enter</button>
        </form>
      </div>
    );
  }

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
          Sessions: {sessions.length} · Fallbacks: {sessions.filter((s) => s.fallback).length}
          <br />
          Roast memory: {getUsedRoasts().length} used · Offline pool: {countTemplates("default")}+ lines
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
