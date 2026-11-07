import type { QRCard } from "./qr-card";

export interface ExportInput {
  card: QRCard;
  size: number; // selected QR size in px; used to scale PNG output
  title: string;
}

export function fileBase(title: string): string {
  const clean = title.trim().replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "").slice(0, 60);
  return clean ? `DAF_QR_${clean}` : "DAF_QR_Code";
}

function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Rasterizes the shared card SVG at the given pixel width. */
async function cardCanvas(card: QRCard, px: number): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(card.svg)}`;
  await new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = () => rej(new Error("Could not render card")); });
  const canvas = document.createElement("canvas");
  canvas.width = px;
  canvas.height = Math.round((px * card.height) / card.width);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export async function exportPng(i: ExportInput) {
  const canvas = await cardCanvas(i.card, Math.max(800, i.size * 2));
  const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("PNG export failed");
  save(blob, `${fileBase(i.title)}.png`);
}

export function exportSvg(i: ExportInput) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n${i.card.svg}`;
  save(new Blob([svg], { type: "image/svg+xml" }), `${fileBase(i.title)}.svg`);
}

export async function exportPdf(i: ExportInput) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const maxW = 150, maxH = 257;
  const scale = Math.min(maxW / i.card.width, maxH / i.card.height);
  const w = i.card.width * scale, h = i.card.height * scale;
  const canvas = await cardCanvas(i.card, 2400);
  doc.addImage(canvas.toDataURL("image/png"), "PNG", (210 - w) / 2, Math.max(15, (297 - h) / 2), w, h);
  doc.save(`${fileBase(i.title)}.pdf`);
}

/** Resizes the logo to a small data URI so it embeds cheaply in SVG/PDF. */
export async function loadLogoDataUri(url: string, px = 256): Promise<string> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = c.height = px;
  c.getContext("2d")!.drawImage(img, 0, 0, px, px);
  return c.toDataURL("image/png");
}
