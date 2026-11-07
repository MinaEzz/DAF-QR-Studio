import { Download, FileText, Image as ImageIcon, Printer } from "lucide-react";

interface Props {
  disabled: boolean;
  busy: string | null;
  onPng: () => void;
  onSvg: () => void;
  onPdf: () => void;
  onPrint: () => void;
}

const btn = "cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30 disabled:cursor-not-allowed disabled:opacity-50";

export function ExportControls({ disabled, busy, onPng, onSvg, onPdf, onPrint }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button className={`${btn} !border-[#29357F] !bg-[#29357F] !text-white hover:!bg-[#222c69]`} disabled={disabled || !!busy} onClick={onPng}>
        <ImageIcon size={18} /> {busy === "png" ? "Preparing…" : "Download PNG"}
      </button>
      <button className={btn} disabled={disabled || !!busy} onClick={onSvg}><Download size={18} /> Download SVG</button>
      <button className={btn} disabled={disabled || !!busy} onClick={onPdf}><FileText size={18} /> {busy === "pdf" ? "Preparing…" : "Download PDF"}</button>
      <button className={btn} disabled={disabled || !!busy} onClick={onPrint}><Printer size={18} /> Print</button>
    </div>
  );
}
