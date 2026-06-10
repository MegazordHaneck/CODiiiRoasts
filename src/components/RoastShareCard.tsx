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
  compact?: boolean;
  /** Booth share screen — scale up on screen (export PNG stays standard size) */
  booth?: boolean;
};

const W = 540;
const PHOTO_H = 340;
const FOOTER_H = 280;
const H = PHOTO_H + FOOTER_H;

export const RoastShareCard = forwardRef<RoastShareCardHandle, Props>(function RoastShareCard(
  { name, roast, photoUrl, qrUrl, compact = false, booth = false },
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
    drawCodiiiBrandPill(ctx);

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, PHOTO_H, W, FOOTER_H);

    const brandBar = ctx.createLinearGradient(0, PHOTO_H, W, PHOTO_H + 6);
    brandBar.addColorStop(0, "#e97024");
    brandBar.addColorStop(1, "#ff6b00");
    ctx.fillStyle = brandBar;
    ctx.fillRect(0, PHOTO_H, W, 6);

    ctx.strokeStyle = "#e97024";
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, W - 24, H - 24);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "600 11px Inter, sans-serif";
    ctx.fillText("ROASTED BY", 28, PHOTO_H + 36);

    ctx.fillStyle = "#e97024";
    ctx.font = "bold 36px Inter, sans-serif";
    ctx.fillText("CODiii", 28, PHOTO_H + 72);

    ctx.fillStyle = "#d1d5db";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillText("I just got roasted 🔥", 28, PHOTO_H + 94);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "13px Inter, sans-serif";
    ctx.fillText(name, 28, PHOTO_H + 116);

    ctx.fillStyle = "#f3f4f6";
    ctx.font = "italic 16px Inter, sans-serif";
    const quoted = roast.trim().startsWith('"') ? roast.trim() : `"${roast.trim()}"`;
    wrapText(ctx, quoted, 28, PHOTO_H + 142, W - 56, 22);

    ctx.fillStyle = "#e97024";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillText(SHARE_HASHTAGS, 28, H - 52);

    ctx.fillStyle = "#e97024";
    ctx.font = "bold 13px Inter, sans-serif";
    ctx.fillText("codiii.com/roasts", 28, H - 28);

    if (qrUrl) {
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, qrUrl, {
        width: 64,
        margin: 1,
        color: { dark: "#e97024", light: "#00000000" },
      });
      ctx.drawImage(qrCanvas, W - 88, H - 88, 64, 64);
    }
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
      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${booth ? styles.canvasBooth : ""} ${compact && !booth ? styles.canvasCompact : ""}`}
        aria-label={`Roast share card for ${name}`}
      />
    </div>
  );
});

function drawRoastedBadge(ctx: CanvasRenderingContext2D) {
  const cx = 88;
  const cy = 52;
  const angle = (-9 * Math.PI) / 180;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  drawBadgeFlames(ctx);

  const bw = 172;
  const bh = 62;
  ctx.shadowColor = "rgba(255, 85, 0, 0.85)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#e97024";
  ctx.beginPath();
  ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 9);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "#ff6b00";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#0a0a0a";
  ctx.font = "bold 28px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ROASTED", 0, -6);

  ctx.font = "bold 11px Inter, sans-serif";
  ctx.fillText("BY CODiii", 0, 14);

  ctx.restore();
}

function drawCodiiiBrandPill(ctx: CanvasRenderingContext2D) {
  const label = "CODiii";
  ctx.font = "bold 22px Inter, sans-serif";
  const tw = ctx.measureText(label).width;
  const padX = 14;
  const pillW = tw + padX * 2;
  const pillH = 36;
  const x = W - pillW - 18;
  const y = PHOTO_H - pillH - 18;

  ctx.shadowColor = "rgba(233, 112, 36, 0.6)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#e97024";
  ctx.beginPath();
  ctx.roundRect(x, y, pillW, pillH, 8);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#0a0a0a";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + padX, y + pillH / 2 + 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function drawBadgeFlames(ctx: CanvasRenderingContext2D) {
  const flames: { x: number; y: number; h: number; color: string }[] = [
    { x: -72, y: 18, h: 28, color: "#ff6b2b" },
    { x: -48, y: 22, h: 34, color: "#ff3d00" },
    { x: -20, y: 24, h: 30, color: "#ff9800" },
    { x: 18, y: 24, h: 32, color: "#ff5500" },
    { x: 48, y: 22, h: 36, color: "#ff3d00" },
    { x: 72, y: 18, h: 28, color: "#ff6b2b" },
    { x: 0, y: 28, h: 38, color: "#fff176" },
  ];

  for (const f of flames) {
    ctx.fillStyle = f.color;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.quadraticCurveTo(f.x + 6, f.y - f.h * 0.6, f.x + 12, f.y);
    ctx.quadraticCurveTo(f.x + 6, f.y - f.h * 0.35, f.x, f.y);
    ctx.fill();
  }
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
  const maxLines = 3;
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
