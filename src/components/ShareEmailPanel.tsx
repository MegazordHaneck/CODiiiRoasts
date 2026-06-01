import { useState } from "react";
import { sendShareEmail } from "../lib/shareLinkApi";
import styles from "./ShareEmailPanel.module.css";

type Props = {
  shareId: string | null;
  ready: boolean;
  loading?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ShareEmailPanel({ shareId, ready, loading }: Props) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const send = async () => {
    const trimmed = email.trim();
    if (!shareId || !EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }

    setSending(true);
    setStatus("idle");
    setMessage(null);

    const result = await sendShareEmail(shareId, trimmed);
    setSending(false);

    if (result.emailSent) {
      setStatus("sent");
      setMessage("Sent! Check your inbox for the roast card.");
      return;
    }

    setStatus("error");
    setMessage(result.error ?? "Could not send email. Try the QR code instead.");
  };

  return (
    <div className={styles.panel}>
      <p className={styles.divider}>or email it</p>
      <label className={styles.label} htmlFor="share-email">
        Email address
      </label>
      <div className={styles.row}>
        <input
          id="share-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") {
              setStatus("idle");
              setMessage(null);
            }
          }}
          disabled={!ready || loading || sending}
          className={styles.input}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={() => void send()}
          disabled={!ready || loading || sending || !email.trim()}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
      {message && (
        <p className={status === "sent" ? styles.success : styles.error}>{message}</p>
      )}
      {!ready && !loading && (
        <p className={styles.wait}>Your card is still uploading…</p>
      )}
    </div>
  );
}
