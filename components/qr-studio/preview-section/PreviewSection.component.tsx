import { AlertTriangle, CheckCircle2, Eye, QrCode } from "lucide-react";
import ExportControls from "./export-controls/ExportControls.component";
import IPreviewSectionProps from "./PreviewSection.types";

export default function PreviewSection({
  busy,
  error,
  notice,
  onPdf,
  onPng,
  onPrint,
  onSvg,
  onUpdate,
  stale,
  svg,
}: IPreviewSectionProps) {
  const ready = !!svg && !error;

  return (
    <section className="w-full h-fit lg:sticky lg:top-6 bg-white rounded-xl border border-slate-200 px-4! py-6! shadow-sm">
      <h2 className="w-full xl:text-2xl md:text-xl text-lg text-[#29357F] font-bold capitalize flex items-center gap-2 mb-6!">
        <Eye size={20} />
        Preview
      </h2>

      {/** QR CODE PREVIEW HERE */}
      <div className="w-full max-w-105 aspect-square mx-auto! flex items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
        {ready ? (
          <div
            className="w-full h-full [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg! }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center px-6! text-center text-slate-400">
            <QrCode size={74} className="mb-3!" strokeWidth={1.25} />
            <p className="text-base">Your QR Code will appear here.</p>
          </div>
        )}
      </div>
      {error && (
        <p
          role="alert"
          className="w-full flex items-center gap-2 rounded-lg bg-red-50 mt-4! p-3! text-sm text-red-800"
        >
          <AlertTriangle size={18} className="shrink-0" />
          {error}
        </p>
      )}
      {stale && ready && (
        <p
          role="alert"
          className="w-full flex items-center gap-2 rounded-lg bg-amber-50 mt-4! p-3! text-sm text-amber-800"
        >
          <AlertTriangle size={18} className="shrink-0" /> This QR Code shows
          your previous content.
          <button
            onClick={onUpdate}
            className="cursor-pointer font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            Update QR Code
          </button>
        </p>
      )}
      <ExportControls
        disabled={!ready || stale}
        busy={busy}
        onPng={onPng}
        onSvg={onSvg}
        onPdf={onPdf}
        onPrint={onPrint}
      />
      {notice && (
        <p
          aria-live="polite"
          className="w-full flex items-center gap-2 rounded-lg bg-emerald-50 mt-4! p-3! text-sm text-emerald-800"
        >
          <CheckCircle2 size={18} />
          {notice}
        </p>
      )}
    </section>
  );
}
