import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import QRCode from "qrcode";
import { SHARE_HASHTAGS } from "../lib/shareCaption";
import styles from "./RoastShareCard.module.css";

export type RoastShareCardHandle = {
  getPngBlob: () => Promise<Blob | null>;
};

type Props = {
  name: string;
  roast: string;
  photoUrl?: string | null;
  qrUrl?: string;
};

const W = 540;
const PHOTO_H = 340;
const FOOTER_H = 280;
const H = PHOTO_H + FOOTER_H;

export const RoastShareCard = forwardRef<RoastShareCardHandle, Props>(function RoastShareCard(
  { name, roast, photoUrl, qrUrl = "https://codiii.com" },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    if (photoUrl) {
      const img = await loadImage(photoUrl);
      drawCover(ctx, img, 0, 0, W, PHOTO_H);
    } else {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, W, PHOTO_H);
      ctx.fillStyle = "#666";
      ctx.font = "16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Roastee photo", W / 2, PHOTO_H / 2);
      ctx.textAlign = "left";
    }

    const photoGrad = ctx.createLinearGradient(0, PHOTO_H - 80, 0, PHOTO_H);
    photoGrad.addColorStop(0, "rgba(0,0,0,0)");
    photoGrad.addColorStop(1, "rgba(0,0,0,0.75)");
    ctx.fillStyle = photoGrad;
    ctx.fillRect(0, PHOTO_H - 80, W, 80);

    drawRoastedBadge(ctx);

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, PHOTO_H, W, FOOTER_H);

    ctx.strokeStyle = "#e97024";
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, W - 24, H - 24);

    ctx.fillStyle = "#e97024";
    ctx.font = "bold 22px Inter, sans-serif";
    ctx.fillText("I just got Roasted by CODiii", 28, PHOTO_H + 44);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText(name, 28, PHOTO_H + 68);

    ctx.fillStyle = "#f3f4f6";
    ctx.font = "italic 16px Inter, sans-serif";
    const quoted = roast.trim().startsWith('"') ? roast.trim() : `"${roast.trim()}"`;
    wrapText(ctx, quoted, 28, PHOTO_H + 96, W - 56, 22);

    ctx.fillStyle = "#e97024";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillText(SHARE_HASHTAGS, 28, H - 52);

    ctx.fillStyle = "#6b7280";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("codiii.com", 28, H - 28);

    const qrCanvas = document.createElement("canvas");
    await QRCode.toCanvas(qrCanvas, qrUrl, {
      width: 64,
      margin: 1,
      color: { dark: "#e97024", light: "#00000000" },
    });
    ctx.drawImage(qrCanvas, W - 88, H - 88, 64, 64);
  }, [name, roast, photoUrl, qrUrl]);

  useEffect(() => {
    void drawCard();
  }, [drawCard]);

  useImperativeHandle(
    ref,
    () => ({
      getPngBlob: () =>
        new Promise((resolve) => {
          const canvas = canvasRef.current;
          if (!canvas) {
            resolve(null);
            return;
          }
          canvas.toBlob((blob) => resolve(blob), "image/png");
        }),
    }),
    [],
  );

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label={`Roast share card for ${name}`} />
    </div>
  );
});

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
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (w - sw) / 2;
  const sy = y + (h - sh) / 2;
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
  const maxLines = 5;
  let lines = 0;

  for (const word of words) {
    const test = `${line}${word} `;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line.trim(), x, cy);
      line = `${word} `;
      cy += lineHeight;
      lines += 1;
      if (lines >= maxLines) {
        ctx.fillText(`${line.trim()}…`, x, cy);
        return;
      }
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, cy);
}
