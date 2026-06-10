/** Bake social caption into the share PNG — mobile apps often drop share-sheet text when files are attached. */

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    img.src = url;
  });
}

function breakLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }
    const words = paragraph.split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines.length > 0 ? lines : [text];
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("png export failed"))), "image/png");
  });
}

export async function composeShareImage(cardBlob: Blob, caption: string): Promise<Blob> {
  const cardImg = await blobToImage(cardBlob);
  const w = cardImg.width;
  const pad = 28;
  const maxTextW = w - pad * 2;

  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return cardBlob;

  const bodyFont = "14px Inter, system-ui, sans-serif";
  probe.font = bodyFont;
  const lines = breakLines(probe, caption, maxTextW);
  const lineH = 20;
  const labelH = 32;
  const footerPad = 24;
  const extraH = labelH + lines.length * lineH + footerPad;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = cardImg.height + extraH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return cardBlob;

  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(cardImg, 0, 0);

  ctx.fillStyle = "#e97024";
  ctx.fillRect(0, cardImg.height, w, 4);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "600 11px Inter, system-ui, sans-serif";
  ctx.fillText("POST TEXT", pad, cardImg.height + 22);

  ctx.fillStyle = "#f3f4f6";
  ctx.font = bodyFont;
  let y = cardImg.height + labelH;
  for (const line of lines) {
    if (line) ctx.fillText(line, pad, y);
    y += lineH;
  }

  return canvasToBlob(canvas);
}
