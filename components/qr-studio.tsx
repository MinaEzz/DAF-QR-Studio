"use client";

import { useEffect, useMemo, useState } from "react";
import { createMatrix, DEFAULT_OPTIONS, type QROptions } from "@/lib/qr-generator";
import { buildCard, type QRCard } from "@/lib/qr-card";
import { exportPdf, exportPng, exportSvg, loadLogoDataUri, type ExportInput } from "@/lib/qr-export";
import { friendlyGenerationError, validateInput } from "@/lib/qr-validation";
import { QrGeneratorForm } from "./qr-generator-form";
import { QrCustomizationPanel } from "./qr-customization-panel";
import { QrCodePreview } from "./qr-code-preview";
import { PrintLayout } from "./print-layout";

export function QrStudio() {
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);
  const [logoSrc, setLogoSrc] = useState<string>();
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadLogoDataUri("/DAF_Logo_transparent_BG.png").then(setLogoSrc).catch(() => setLogoSrc(undefined));
  }, []);

  const effective = useMemo<QROptions>(() => ({ ...options, ecl: options.useLogo ? "H" : options.ecl }), [options]);

  const result = useMemo(() => {
    if (generated === null) return null;
    try {
      const matrix = createMatrix(generated, effective.ecl);
      const card: QRCard = buildCard(matrix, effective, logoSrc, title, description);
      return { card, error: null };
    } catch {
      return { card: null, error: friendlyGenerationError() };
    }
  }, [generated, effective, logoSrc, title, description]);

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(null), 3000); };

  const generate = () => {
    const msg = validateInput(input);
    if (msg) { setError(msg); return; }
    try {
      createMatrix(input, effective.ecl);
      setError(null);
      setGenerated(input);
      flash("QR Code ready.");
    } catch {
      setError(friendlyGenerationError());
    }
  };

  const clear = () => { setInput(""); setGenerated(null); setError(null); setNotice(null); };

  const exportInput = (): ExportInput | null =>
    result?.card ? { card: result.card, size: effective.size, title } : null;

  const run = async (kind: "png" | "pdf" | "svg") => {
    const i = exportInput();
    if (!i) return;
    try {
      setBusy(kind === "svg" ? null : kind);
      if (kind === "png") await exportPng(i);
      else if (kind === "pdf") await exportPdf(i);
      else exportSvg(i);
      flash(`${kind.toUpperCase()} downloaded.`);
    } catch {
      setError(`Could not create the ${kind.toUpperCase()} file. Please try again.`);
    } finally {
      setBusy(null);
    }
  };

  const stale = generated !== null && input !== generated;

  return (
    <>
      <main className="no-print mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:items-start">
        <div className="grid gap-6">
          <QrGeneratorForm input={input} error={error} title={title} description={description}
            onInput={(v) => { setInput(v); if (error) setError(null); }} onTitle={setTitle} onDescription={setDescription}
            onGenerate={generate} onClear={clear} />
          <QrCustomizationPanel options={options} onChange={setOptions} onReset={() => setOptions(DEFAULT_OPTIONS)} />
        </div>
        <QrCodePreview svg={result?.card?.svg ?? null} error={result?.error ?? null} stale={stale} notice={notice} busy={busy}
          onPng={() => run("png")} onSvg={() => run("svg")} onPdf={() => run("pdf")}
          onPrint={() => window.print()} onUpdate={generate} />
      </main>
      <PrintLayout svg={result?.card?.svg ?? null} />
    </>
  );
}
