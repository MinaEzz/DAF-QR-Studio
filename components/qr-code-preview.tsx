import { AlertTriangle, CheckCircle2, QrCode } from "lucide-react";
import { ExportControls } from "./export-controls";

interface Props {
  svg: string | null;
  error: string | null;
  stale: boolean;
  notice: string | null;
  busy: string | null;
  onPng: () => void;
  onSvg: () => void;
  onPdf: () => void;
  onPrint: () => void;
  onUpdate: () => void;
}

export function QrCodePreview(p: Props) {
  const ready = !!p.svg && !p.error;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <h2 className="mb-4 font-medium text-slate-800">Preview</h2>
      <div
        className={`mx-auto flex w-full max-w-[420px] items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white ${ready ? "" : "aspect-square"}`}
      >
        {ready ? (
          <div
            className="w-full [&>svg]:block [&>svg]:h-auto [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: p.svg! }}
          />
        ) : (
          <div className="px-6 text-center text-slate-400">
            <QrCode size={64} className="mx-auto mb-3" strokeWidth={1.25} />
            <p>Your QR Code will appear here.</p>
          </div>
        )}
      </div>
      {p.error && (
        <p
          role="alert"
          className="mt-4 flex gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          {p.error}
        </p>
      )}
      {p.stale && ready && (
        <p
          role="alert"
          className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
        >
          <AlertTriangle size={18} className="shrink-0" /> This QR Code shows
          your previous content.
          <button
            onClick={p.onUpdate}
            className="cursor-pointer font-semibold underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
          >
            Update QR Code
          </button>
        </p>
      )}
      <div className="mt-5">
        <ExportControls
          disabled={!ready || p.stale}
          busy={p.busy}
          onPng={p.onPng}
          onSvg={p.onSvg}
          onPdf={p.onPdf}
          onPrint={p.onPrint}
        />
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-emerald-700">
        {p.notice && (
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 size={16} />
            {p.notice}
          </span>
        )}
      </p>
    </section>
  );
}
