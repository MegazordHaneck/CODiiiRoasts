import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import styles from "./ShareScanQr.module.css";

type Props = {
  url: string | null;
};

const QR_PX = 300;

export function ShareScanQr({ url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !url) return;

    void QRCode.toCanvas(canvas, url, {
      width: QR_PX,
      margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });
  }, [url]);

  return (
    <aside className={styles.aside} aria-label="Scan to open share page on your phone">
      {url ? (
        <div className={styles.qrFrame}>
          <canvas ref={canvasRef} className={styles.qr} width={QR_PX} height={QR_PX} />
        </div>
      ) : (
        <div className={styles.qrFrame}>
          <div className={styles.placeholder}>Preparing QR…</div>
        </div>
      )}
      <p className={styles.title}>Scan to share</p>
      <p className={styles.sub}>Open on your phone — save the card and post anywhere.</p>
    </aside>
  );
}
