import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "DAF QR Studio – Create. Scan. Connect.",
  description:
    "Turn Google Forms links, URLs, or any text into a QR Code in seconds. Download PNG, SVG, or PDF, or print. Generated locally in your browser.",
  applicationName: "DAF QR Studio",
  authors: [{ name: "DAF – Digital Access to Finance" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daf-qr-studio.vercel.app/",
    siteName: "DAF QR Studio",
    title: "DAF QR Studio – Create. Scan. Connect.",
    description:
      "Turn Google Forms links, URLs, or any text into a QR Code in seconds. Download PNG, SVG, or PDF, or print. Generated locally in your browser.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "DAF QR Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DAF QR Studio – Create. Scan. Connect.",
    description:
      "Turn Google Forms links, URLs, or any text into a QR Code in seconds. Download PNG, SVG, or PDF, or print. Generated locally in your browser.",
    images: ["/opengraph-image.png"],
    creator: "@DAFHolding",
  },
};

export const viewport: Viewport = {
  themeColor: "#29357F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
