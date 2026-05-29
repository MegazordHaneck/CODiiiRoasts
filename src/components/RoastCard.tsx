import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import styles from "./RoastCard.module.css";

type Props = {
  name: string;
  roast: string;
  qrUrl?: string;
};

export function RoastCard({ name, roast, qrUrl = "https://codiii.com" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = 480;
      const h = 320;
      canvas.width = w;
      canvas.height = h;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#e97024";
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, w - 24, h - 24);

      ctx.fillStyle = "#e97024";
      ctx.font = "bold 22px Inter, sans-serif";
      ctx.fillText("CODiii Roasts", 28, 48);

      ctx.fillStyle = "#e5e7eb";
      ctx.font = "16px Inter, sans-serif";
      ctx.fillText(name, 28, 80);

      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px Inter, sans-serif";
      wrapText(ctx, `"${roast}"`, 28, 110, w - 56, 20);

      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, qrUrl, {
        width: 80,
        margin: 1,
        color: { dark: "#e97024", light: "#00000000" },
      });
      ctx.drawImage(qrCanvas, w - 110, h - 110, 80, 80);
    };

    void draw();
  }, [name, roast, qrUrl]);

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label={`Roast card for ${name}`} />
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let cy = y;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word + " ";
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, cy);
}
