import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import styles from "./ShareScanQr.module.css";

type Props = {
  url: string | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const QR_PX = 300;

export function ShareScanQr({ url, loading, error, onRetry }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !url) return;

    void QRCode.toCanvas(canvas, url, {
      width: QR_PX,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });
  }, [url]);

  return (
    <aside className={styles.aside} aria-label="Scan with phone camera to open roast card">
      {url ? (
        <div className={styles.qrFrame}>
          <canvas ref={canvasRef} className={styles.qr} width={QR_PX} height={QR_PX} />
        </div>
      ) : (
        <div className={styles.qrFrame}>
          <div className={styles.placeholder}>
            {loading ? "Preparing your card…" : error ? "QR unavailable" : "Preparing QR…"}
          </div>
        </div>
      )}
      <p className={styles.title}>Phone camera here</p>
      <p className={styles.sub}>
        No app needed — iPhone &amp; Android Camera will open your roast card on this phone.
      </p>
      {error && (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{error}</p>
          {onRetry && (
            <button type="button" className={styles.retryBtn} onClick={onRetry}>
              Retry upload
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
