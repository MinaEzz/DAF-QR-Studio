"use client";
import { useEffect, useMemo, useState } from "react";
import {
  createMatrix,
  DEFAULT_OPTIONS,
  type QROptions,
} from "@/lib/qr-generator";
import { friendlyGenerationError, validateInput } from "@/lib/qr-validation";
import { buildCard, type QRCard } from "@/lib/qr-card";
import {
  exportPdf,
  exportPng,
  exportSvg,
  loadLogoDataUri,
  type ExportInput,
} from "@/lib/qr-export";

export function useGenerateQrCode() {
  const [input, setInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);
  const [logoSrc, setLogoSrc] = useState<string>();
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadLogoDataUri("/DAF_Logo_transparent_BG.png")
      .then(setLogoSrc)
      .catch(() => setLogoSrc(undefined));
  }, []);

  const effective = useMemo<QROptions>(
    () => ({ ...options, ecl: options.useLogo ? "H" : options.ecl }),
    [options],
  );

  const result = useMemo(() => {
    if (generated === null) return null;
    try {
      const matrix = createMatrix(generated, effective.ecl);
      const card: QRCard = buildCard(
        matrix,
        effective,
        logoSrc,
        title,
        description,
      );
      return { card, error: null };
    } catch {
      return { card: null, error: friendlyGenerationError() };
    }
  }, [generated, effective, logoSrc, title, description]);

  const flash = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const generate = () => {
    const msg = validateInput(input);
    if (msg) {
      setError(msg);
      return;
    }
    try {
      createMatrix(input, effective.ecl);
      setError(null);
      setGenerated(input);
      flash("QR Code ready.");
    } catch {
      setError(friendlyGenerationError());
    }
  };

  function onInputChange(
    e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) {
    setInput(e.target.value);
    if (error) setError(null);
  }

  function onTitleChange(
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) {
    setTitle(e.target.value);
  }

  function onDescriptionChange(
    e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) {
    setDescription(e.target.value);
  }

  function handleGenerate() {
    const msg = validateInput(input);
    if (msg) {
      setError(msg);
      return;
    }
    try {
      createMatrix(input, effective.ecl);
      setError(null);
      setGenerated(input);
      flash("QR Code ready.");
    } catch {
      setError(friendlyGenerationError());
    }
  }

  function handleClear() {
    setInput("");
    setTitle("");
    setDescription("");
    setGenerated(null);
    setError(null);
    setNotice(null);
  }

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
      setError(
        `Could not create the ${kind.toUpperCase()} file. Please try again.`,
      );
    } finally {
      setBusy(null);
    }
  };

  const stale = generated !== null && input !== generated;

  return {
    input,
    title,
    description,
    onInputChange,
    onTitleChange,
    onDescriptionChange,
    handleGenerate,
    handleClear,
    error,
    busy,
    notice,
    stale,
    result,
    run,
    generate,
    options,
    DEFAULT_OPTIONS,
    setOptions,
  };
}
