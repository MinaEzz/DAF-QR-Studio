import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DAF QR Studio",
  description: "Create. Scan. Connect. Generate QR Codes locally for DAF.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
