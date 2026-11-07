import QRCode from "qrcode";

export type ECL = "L" | "M" | "Q" | "H";
export interface QROptions {
  fg: string;
  bg: string;
  size: number;
  ecl: ECL;
  useLogo: boolean;
}
export interface QRMatrix {
  n: number;
  dark: boolean[][];
}

export const DEFAULT_OPTIONS: QROptions = { fg: "#29357F", bg: "#FFFFFF", size: 400, ecl: "M", useLogo: false };
export const MARGIN = 4; // quiet zone in modules

/** Builds the module matrix locally. Throws if the content exceeds QR capacity. */
export function createMatrix(text: string, ecl: ECL): QRMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: ecl });
  const n = qr.modules.size;
  const dark: boolean[][] = [];
  for (let r = 0; r < n; r++) {
    dark.push([]);
    for (let c = 0; c < n; c++) dark[r].push(!!qr.modules.get(r, c));
  }
  return { n, dark };
}

/** Center logo geometry in module units (logo is ~20% of QR width, with a 1-module backing). */
export function logoGeometry(n: number) {
  const total = n + 2 * MARGIN;
  const logo = n * 0.2;
  const box = logo + 2;
  return { total, logo, box, logoPos: (total - logo) / 2, boxPos: (total - box) / 2 };
}

/** Inner SVG markup of the QR Code in a `0 0 total total` coordinate space. */
export function qrBody(m: QRMatrix, o: QROptions, logoSrc?: string): { total: number; body: string } {
  const g = logoGeometry(m.n);
  let d = "";
  for (let r = 0; r < m.n; r++)
    for (let c = 0; c < m.n; c++) if (m.dark[r][c]) d += `M${c + MARGIN} ${r + MARGIN}h1v1h-1z`;
  const logo =
    o.useLogo && logoSrc
      ? `<rect x="${g.boxPos}" y="${g.boxPos}" width="${g.box}" height="${g.box}" rx="0.8" fill="${o.bg}"/>` +
        `<image href="${logoSrc}" x="${g.logoPos}" y="${g.logoPos}" width="${g.logo}" height="${g.logo}"/>`
      : "";
  const body = `<rect width="${g.total}" height="${g.total}" fill="${o.bg}"/>` +
    `<path fill="${o.fg}" shape-rendering="crispEdges" d="${d}"/>${logo}`;
  return { total: g.total, body };
}
