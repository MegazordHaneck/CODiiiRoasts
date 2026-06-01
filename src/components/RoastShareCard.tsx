import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import styles from "./RoastShareCard.module.css";

type Props = {
  name: string;
  roast: string;
  photoUrl?: string | null;
  qrUrl?: string;
};

export function RoastShareCard({ name, roast, photoUrl, qrUrl = "https://codiii.com" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = async () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = 540;
      const h = 360;
      canvas.width = w;
      canvas.height = h;

      if (photoUrl) {
        const img = await loadImage(photoUrl);
        drawCover(ctx, img, w, h);
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, w, h);
      }

      drawRoastedBadge(ctx);

      ctx.strokeStyle = "#e97024";
      ctx.lineWidth = 2;
      ctx.strokeRect(14, 14, w - 28, h - 28);

      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px Inter, sans-serif";
      ctx.fillText(name, 28, h - 118);

      ctx.fillStyle = "#f3f4f6";
      ctx.font = "15px Inter, sans-serif";
      wrapText(ctx, roast, 28, h - 92, w - 56, 20);

      ctx.fillStyle = "#e97024";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.fillText("CODiii Roasts", 28, h - 28);

      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, qrUrl, {
        width: 72,
        margin: 1,
        color: { dark: "#e97024", light: "#00000000" },
      });
      ctx.drawImage(qrCanvas, w - 96, h - 96, 72, 72);
    };

    void draw();
  }, [name, roast, photoUrl, qrUrl]);

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label={`Roast share card for ${name}`} />
      <a
        className={styles.download}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          const canvas = canvasRef.current;
          if (!canvas) return;
          const link = document.createElement("a");
          link.download = `codiii-roast-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }}
      >
        Download image
      </a>
    </div>
  );
}

function drawRoastedBadge(ctx: CanvasRenderingContext2D) {
  const x = 20;
  const y = 20;
  const bw = 132;
  const bh = 40;
  ctx.fillStyle = "#e97024";
  ctx.beginPath();
  ctx.roundRect(x, y, bw, bh, 6);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.font = "bold 22px Inter, sans-serif";
  ctx.fillText("ROASTED", x + 14, y + 28);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = (w - sw) / 2;
  const sy = (h - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
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
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, cy);
      line = `${word} `;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, cy);
}
