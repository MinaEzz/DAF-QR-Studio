# DAF QR Studio — Create. Scan. Connect.

Internal DAF tool that turns any link or text (e.g. Google Forms) into a QR Code. Everything runs in the browser: no backend, database, analytics, or environment variables. Entered content is never sent anywhere or put in the URL.

Stack: Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide, `qrcode` (matrix generation), `jspdf` (PDF).

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Features
- Paste any text/URL → Generate (Ctrl/Cmd+Enter also works). Input is encoded exactly as typed.
- Empty-input validation; clear error if content exceeds QR capacity.
- "Previous content" warning + Update button; exports are disabled while the preview is out of date.
- Colors, size, error correction (L/M/Q/H), optional DAF center logo (forces level H), contrast warnings, reset.
- Preview, PNG, SVG, PDF and Print all use one shared QR card layout (optional title, QR Code, optional description) built in `lib/qr-card.ts`. PNG is 2× the selected size (min 800 px wide), SVG is vector, PDF is A4 with the card centered.

## Deploy to Vercel
1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel: **Add New → Project**, import the repo. The Next.js preset is detected automatically.
3. Leave build settings and environment variables empty, then **Deploy**.
(Or run `npx vercel` from this folder.)

## Manual test checklist
Google Forms URL, website URL, plain text, numbers, a very long string, empty input, oversize input (~5000 chars), color changes, logo on/off, PNG/SVG/PDF downloads, Print preview, scan the result with a phone, and check desktop and mobile widths.

## Known limitations
- The PDF title/description use the built-in Helvetica font, which does not render Arabic or other non-Latin scripts. Use **Print → Save as PDF** for those.
- Fonts are system fonts (no Google Fonts), so the app builds offline.
