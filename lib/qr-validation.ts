export function validateInput(text: string): string | null {
  return text.trim().length === 0 ? "Enter a link or some text to generate a QR Code." : null;
}

export function friendlyGenerationError(): string {
  return "This content is too long for a QR Code at the current settings. Shorten the text, or lower the error correction level (turn off the center logo to allow Level M or lower).";
}

function lum(hex: string): number {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

export function contrastWarning(fg: string, bg: string): string | null {
  const a = lum(fg), b = lum(bg);
  if (a > b) return "The QR Code is lighter than its background. Many scanners cannot read inverted codes.";
  const ratio = (b + 0.05) / (a + 0.05);
  return ratio < 4 ? `Low contrast (${ratio.toFixed(1)}:1). Use a darker foreground or lighter background so the code scans reliably.` : null;
}
