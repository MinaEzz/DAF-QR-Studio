# DAF QR Studio

**Create. Scan. Connect.**

DAF QR Studio is a lightweight QR code generator built to make sharing links and information easier across DAF.

The tool allows users to turn URLs, form links, and plain text into customizable QR codes that can be previewed, downloaded, or printed. It runs entirely in the browser, keeping the process simple and the entered content private.

## Features

- **Quick Generation:** Generate QR codes from any URL or text input, with support for `Ctrl + Enter` / `Cmd + Enter`.
- **Customization:** Adjust QR code colors, dimensions, and error correction levels.
- **DAF Branding:** Add a DAF logo to the center of the QR code, with the error correction level automatically set to High (H).
- **Live Preview:** Review the QR code before exporting it.
- **Export Options:** Download QR codes as PNG, SVG, or PDF, or print them directly.
- **Print-ready Layout:** Add an optional title and description to create a QR code card suitable for sharing and printing.
- **Input Validation:** Handle empty input, oversized content, and outdated previews before allowing exports.

## Privacy by Design

DAF QR Studio is designed to work entirely on the client side.

- No backend or database is required.
- No analytics or external content storage.
- No environment variables or server-side configuration.
- Entered content is encoded directly in the browser and is never uploaded or added to the page URL.

## Tech Stack

| Technology           | Purpose                  |
| -------------------- | ------------------------ |
| Next.js (App Router) | Application framework    |
| React & TypeScript   | UI and application logic |
| Tailwind CSS         | Styling                  |
| Lucide               | Icons                    |
| qrcode               | QR code generation       |
| jsPDF                | PDF export               |

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository and install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Production Build

To create and run a production build:

```bash
npm run build
npm run start
```

## Deployment

The application can be deployed to [Vercel](https://vercel.com/) with minimal configuration.

1. Push the project to a Git repository.
2. Import the repository into Vercel.
3. Keep the default Next.js build settings.
4. No environment variables are required.
5. Deploy the application.

## Export Details

All export formats use a shared QR card layout to maintain a consistent appearance across the preview and exported files.

- **PNG:** Raster export at twice the selected QR size, with a minimum width of 800 pixels.
- **SVG:** Scalable vector format.
- **PDF:** A4 document with the QR card centered on the page.
- **Print:** Opens a print-friendly version of the QR card.

## Known Limitations

- PDF exports use the built-in Helvetica font, which does not support Arabic and some other non-Latin characters in titles and descriptions. For these cases, use the browser's **Print → Save as PDF** option instead.
- The application uses system fonts and does not depend on externally hosted fonts, allowing it to build without downloading font assets.

---

**DAF QR Studio** — A simple way to create and share information through QR codes.
