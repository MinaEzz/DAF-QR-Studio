"use client";
import { Download, FileText, ImageIcon, Printer } from "lucide-react";
import IExportControlsProps from "./ExportControls.types";

const btnCls =
  "inline-flex border items-center justify-center gap-2 rounded-lg px-5! py-3! focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed! disabled:opacity-60";

export default function ExportControls({
  disabled,
  busy,
  onPng,
  onSvg,
  onPdf,
  onPrint,
}: IExportControlsProps) {
  return (
    <div className="w-full grid md:grid-cols-2 gap-3 mt-9!">
      <button
        className={`${btnCls} text-lg flex-1 border-[#29357F] bg-[#29357F] font-semibold text-white hover:bg-[#222c69] hover:border-[#222c69] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/40`}
        disabled={disabled || !!busy}
        onClick={onPng}
      >
        <ImageIcon size={20} />
        {busy === "png" ? "Preparing…" : "Download PNG"}
      </button>
      <button
        className={`${btnCls} text-lg border-slate-300 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30`}
        disabled={disabled || !!busy}
        onClick={onSvg}
      >
        <Download size={20} />
        {busy === "svg" ? "Preparing…" : "Download SVG"}
      </button>
      <button
        className={`${btnCls} text-lg border-slate-300 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30`}
        disabled={disabled || !!busy}
        onClick={onPdf}
      >
        <FileText size={20} />
        {busy === "pdf" ? "Preparing…" : "Download PDF"}
      </button>
      <button
        className={`${btnCls} text-lg border-slate-300 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30`}
        disabled={disabled || !!busy}
        onClick={onPrint}
      >
        <Printer size={20} /> Print
      </button>
    </div>
  );
}
