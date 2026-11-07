import { qrBody, type QRMatrix, type QROptions } from "./qr-generator";

/**
 * The single "QR card" layout (optional title, QR Code, optional description).
 * The live preview, print, SVG, PNG and PDF all use this one SVG.
 */
export interface QRCard {
  svg: string;
  width: number; // layout units (viewBox)
  height: number;
}

const FONT = "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";
const W = 600, PAD = 40;
const TITLE = { size: 34, line: 44, weight: 700, color: "#29357F" };
const DESC = { size: 22, line: 32, weight: 400, color: "#374151" };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function measurer(weight: number, size: number): (t: string) => number {
  if (typeof document !== "undefined") {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      ctx.font = `${weight} ${size}px ${FONT}`;
      return (t) => ctx.measureText(t).width;
    }
  }
  return (t) => t.length * size * 0.55;
}

function wrap(text: string, weight: number, size: number, maxW: number): string[] {
  const width = measurer(weight, size);
  const out: string[] = [];
  for (const para of text.split(/\r?\n/)) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (width(next) <= maxW) { line = next; continue; }
      if (line) out.push(line);
      line = "";
      let chunk = "";
      for (const ch of word) { // break very long words (e.g. URLs)
        if (width(chunk + ch) > maxW && chunk) { out.push(chunk); chunk = ""; }
        chunk += ch;
      }
      line = chunk;
    }
    out.push(line);
  }
  return out;
}

export function buildCard(m: QRMatrix, o: QROptions, logoSrc: string | undefined, title: string, description: string): QRCard {
  const t = title.trim(), d = description.trim();
  const hasText = !!(t || d);
  const pad = hasText ? PAD : 0;
  const q = W - 2 * pad;
  const { total, body } = qrBody(m, o, logoSrc);
  let y = pad;
  let parts = "";
  const text = (lines: string[], st: typeof TITLE, top: number) =>
    lines.map((l, i) => `<text x="${W / 2}" y="${top + st.size + i * st.line}" text-anchor="middle" font-family="${esc(FONT)}" font-size="${st.size}" font-weight="${st.weight}" fill="${st.color}">${esc(l)}</text>`).join("");
  if (t) {
    const lines = wrap(t, TITLE.weight, TITLE.size, W - 2 * PAD);
    parts += text(lines, TITLE, y);
    y += lines.length * TITLE.line + 20;
  }
  parts += `<svg x="${pad}" y="${y}" width="${q}" height="${q}" viewBox="0 0 ${total} ${total}">${body}</svg>`;
  y += q;
  if (d) {
    y += 28;
    const lines = wrap(d, DESC.weight, DESC.size, W - 2 * PAD);
    parts += text(lines, DESC, y);
    y += lines.length * DESC.line;
  }
  y += pad;
  const height = Math.round(y);
  const pxH = Math.round((o.size * height) / W);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${o.size}" height="${pxH}" role="img" aria-label="QR Code card"><rect width="${W}" height="${height}" fill="#FFFFFF"/>${parts}</svg>`;
  return { svg, width: W, height };
}
