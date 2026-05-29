import { useState } from "react";
import { useBooth } from "../context/BoothContext";
import { ROLE_OPTIONS } from "../types";
import styles from "./screens.module.css";

export function IntakeScreen() {
  const { setAttendee, setScreen } = useBooth();
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>(ROLE_OPTIONS[0]);
  const [customRole, setCustomRole] = useState("");
  const [company, setCompany] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const finalRole = role === "Other" ? customRole.trim() || "Industry Professional" : role;
    setAttendee({ name: name.trim(), role: finalRole, company: company.trim() || undefined });
    setScreen("intensity");
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Who are you?</h1>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        </div>
        <div className={styles.field}>
          <label htmlFor="role">Role / discipline</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {role === "Other" && (
          <div className={styles.field}>
            <label htmlFor="customRole">Your role</label>
            <input id="customRole" value={customRole} onChange={(e) => setCustomRole(e.target.value)} />
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor="company">Company (optional)</label>
          <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <button type="submit" className={styles.btnPrimary}>Continue</button>
      </form>
    </div>
  );
}
