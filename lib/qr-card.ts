import { qrBody, type QRMatrix, type QROptions } from "./qr-generator";

export interface QRCard {
  svg: string;
  width: number;
  height: number;
}

const W = 600;
const H = 600;
const MARGIN = 24;
const CARD_X = MARGIN;
const CARD_W = W - MARGIN * 2;
const CONTENT_W = 480;

const FONT =
  "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";

const C = {
  page: "#EEF1F8",
  card: "#FFFFFF",
  primary: "#29357F",
  panel: "#F5F7FC",
  line: "#E4E8F2",
  muted: "#5F6B85",
  faint: "#9AA3B5",
};

const TITLE = {
  size: 27,
  line: 33,
  weight: 700,
  color: C.primary,
};

const DESC = {
  size: 17,
  line: 22,
  weight: 400,
  color: C.muted,
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

function wrap(
  text: string,
  weight: number,
  size: number,
  maxW: number,
): string[] {
  const width = measurer(weight, size);
  const out: string[] = [];

  for (const para of text.split(/\r?\n/)) {
    let line = "";

    for (const word of para.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;

      if (width(next) <= maxW) {
        line = next;
        continue;
      }

      if (line) out.push(line);

      line = "";
      let chunk = "";

      for (const ch of word) {
        if (width(chunk + ch) > maxW && chunk) {
          out.push(chunk);
          chunk = "";
        }

        chunk += ch;
      }

      line = chunk;
    }

    if (line) out.push(line);
    else if (!para.trim()) out.push("");
  }

  return out;
}

function limitLines(
  value: string,
  weight: number,
  size: number,
  maxW: number,
  maxLines: number,
): string[] {
  const result = wrap(value, weight, size, maxW);

  if (result.length <= maxLines) return result;

  const limited = result.slice(0, maxLines);
  const width = measurer(weight, size);

  let last = limited[maxLines - 1];

  while (last.length && width(last + "...") > maxW) {
    last = last.slice(0, -1).trimEnd();
  }

  limited[maxLines - 1] = last + "...";

  return limited;
}

const textEl = (
  x: number,
  y: number,
  s: string,
  size: number,
  weight: number,
  fill: string,
  extra = "",
) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="${esc(FONT)}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${extra}>${esc(s)}</text>`;

function renderLines(
  ls: string[],
  top: number,
  size: number,
  lineHeight: number,
  weight: number,
  color: string,
): string {
  return ls
    .map((line, i) =>
      textEl(W / 2, top + size + i * lineHeight, line, size, weight, color),
    )
    .join("");
}

/** Corner bracket around the QR panel. */
function bracket(
  x: number,
  y: number,
  dx: 1 | -1,
  dy: 1 | -1,
  len: number,
  r: number,
) {
  return `<path d="M${x} ${y + dy * len}V${y + dy * r}Q${x} ${y} ${x + dx * r} ${y}H${x + dx * len}" fill="none" stroke="${C.primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function buildCard(
  m: QRMatrix,
  o: QROptions,
  logoSrc: string | undefined,
  title: string,
  description: string,
): QRCard {
  const t = title.trim();
  const d = description.trim();

  const { total, body } = qrBody(m, o, logoSrc);

  // Keep text within fixed areas.
  const titleLines = t
    ? limitLines(t, TITLE.weight, TITLE.size, CONTENT_W, 2)
    : [];

  const descLines = d
    ? limitLines(d, DESC.weight, DESC.size, CONTENT_W, 2)
    : [];

  let parts = "";

  // Brand label.
  parts += `
    <rect
      x="${W / 2 - 28}"
      y="42"
      width="56"
      height="5"
      rx="2.5"
      fill="${C.primary}"
    />

    ${textEl(
      W / 2,
      78,
      "DAF QR STUDIO",
      12,
      700,
      C.primary,
      'letter-spacing="3"',
    )}
  `;

  // Title area.
  if (titleLines.length) {
    parts += renderLines(
      titleLines,
      88,
      TITLE.size,
      TITLE.line,
      TITLE.weight,
      TITLE.color,
    );
  }

  // QR position adapts to the title.
  const qrTop =
    titleLines.length === 2 ? 165 : titleLines.length === 1 ? 140 : 112;

  // Description stays in a fixed bottom area.
  const descFirstBaseline = descLines.length === 2 ? 510 : 532;

  // QR panel must end before the description.
  const qrBottom = descLines.length ? 470 : 490;

  const qrPadding = 24;
  const maxPanelSize = 420;

  // Dynamic QR size, fixed overall card.
  const panel = Math.min(maxPanelSize, qrBottom - qrTop);

  const qrSize = panel - qrPadding * 2;
  const px = (W - panel) / 2;
  const qrX = (W - qrSize) / 2;

  const qrY = qrTop;

  // QR panel.
  parts += `
    <rect
      x="${px}"
      y="${qrY}"
      width="${panel}"
      height="${panel}"
      rx="22"
      fill="${C.panel}"
    />
  `;

  // Actual QR code.
  parts += `
    <svg
      x="${qrX}"
      y="${qrY + qrPadding}"
      width="${qrSize}"
      height="${qrSize}"
      viewBox="0 0 ${total} ${total}"
      preserveAspectRatio="xMidYMid meet"
    >${body}</svg>
  `;

  // Scanner frame.
  const L = 38;
  const R = 22;

  parts +=
    bracket(px, qrY, 1, 1, L, R) +
    bracket(px + panel, qrY, -1, 1, L, R) +
    bracket(px, qrY + panel, 1, -1, L, R) +
    bracket(px + panel, qrY + panel, -1, -1, L, R);

  // Scan me badge.
  const badgeY = qrY + panel;

  parts += `
    <rect
      x="${W / 2 - 64}"
      y="${badgeY - 17}"
      width="128"
      height="34"
      rx="17"
      fill="${C.primary}"
    />

    ${textEl(
      W / 2,
      badgeY + 5,
      "SCAN ME",
      13,
      700,
      "#FFFFFF",
      'letter-spacing="2.5"',
    )}
  `;

  // Description.
  if (descLines.length) {
    const descTop = descFirstBaseline - DESC.size;

    parts += renderLines(
      descLines,
      descTop,
      DESC.size,
      DESC.line,
      DESC.weight,
      DESC.color,
    );
  }

  // Divider.
  parts += `
    <line
      x1="${W / 2 - 150}"
      x2="${W / 2 + 150}"
      y1="540"
      y2="540"
      stroke="${C.line}"
      stroke-width="1.5"
    />
  `;

  // Footer.
  parts += textEl(
    W / 2,
    565,
    "CREATE  ·  SCAN  ·  CONNECT",
    12,
    600,
    C.faint,
    'letter-spacing="1.5"',
  );

  // Fixed card dimensions and layered shadow.
  const cardH = H - MARGIN * 2;

  const shadow = [
    [10, 0.035, 6],
    [5, 0.05, 3],
  ]
    .map(
      ([dy, op, grow]) =>
        `<rect
          x="${CARD_X - grow}"
          y="${MARGIN + dy - grow}"
          width="${CARD_W + grow * 2}"
          height="${cardH + grow * 2}"
          rx="${30 + grow}"
          fill="${C.primary}"
          fill-opacity="${op}"
        />`,
    )
    .join("");

  const svg =
    `<svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${W} ${H}"
      width="${o.size}"
      height="${o.size}"
      role="img"
      aria-label="DAF QR Code card"
    >` +
    `<rect width="${W}" height="${H}" fill="${C.page}"/>` +
    shadow +
    `<rect
      x="${CARD_X}"
      y="${MARGIN}"
      width="${CARD_W}"
      height="${cardH}"
      rx="30"
      fill="${C.card}"
      stroke="${C.line}"
    />` +
    parts +
    `</svg>`;

  return {
    svg,
    width: W,
    height: H,
  };
}
