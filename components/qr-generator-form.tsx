import { Eraser, QrCode } from "lucide-react";

interface Props {
  input: string;
  error: string | null;
  title: string;
  description: string;
  onInput: (v: string) => void;
  onTitle: (v: string) => void;
  onDescription: (v: string) => void;
  onGenerate: () => void;
  onClear: () => void;
}

export const fieldCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-[#29357F] focus:outline-none focus:ring-2 focus:ring-[#29357F]/30";

export function QrGeneratorForm(p: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <label
        htmlFor="qr-input"
        className="mb-2 block font-medium text-slate-800"
      >
        Content for your QR Code
      </label>
      <textarea
        id="qr-input"
        value={p.input}
        onChange={(e) => p.onInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) p.onGenerate();
        }}
        rows={5}
        placeholder="Paste a Google Forms link, website URL, text, or any information..."
        aria-invalid={!!p.error}
        aria-describedby="qr-input-msg"
        className={`${fieldCls} resize-y text-base ${p.error ? "border-red-500" : ""}`}
      />
      <div
        id="qr-input-msg"
        className="mt-1 flex justify-between gap-3 text-sm"
      >
        <span role="alert" className="text-red-600">
          {p.error}
        </span>
        <span className="shrink-0 text-slate-500">
          {p.input.length.toLocaleString()} characters
        </span>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          onClick={p.onGenerate}
          className="cursor-pointer inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#29357F] px-5 py-3 font-semibold text-white hover:bg-[#222c69] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/40"
        >
          <QrCode size={18} /> Generate QR Code
        </button>
        <button
          onClick={p.onClear}
          className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30"
        >
          <Eraser size={18} /> Clear
        </button>
      </div>
      <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5">
        <p className="text-sm text-slate-500">
          Optional. Title and description are displayed in the preview and
          exported files. They are not encoded in the QR Code itself.
        </p>
        <div>
          <label
            htmlFor="qr-title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Title
            <span className="text-slate-500"> (Optional)</span>
          </label>
          <input
            id="qr-title"
            value={p.title}
            onChange={(e) => p.onTitle(e.target.value)}
            placeholder="Employee Attendance"
            className={fieldCls}
          />
        </div>
        <div>
          <label
            htmlFor="qr-desc"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Description <span className="text-slate-500"> (Optional)</span>
          </label>
          <textarea
            id="qr-desc"
            rows={2}
            value={p.description}
            onChange={(e) => p.onDescription(e.target.value)}
            placeholder="Scan the QR Code to register your attendance."
            className={fieldCls}
          />
        </div>
      </div>
    </section>
  );
}
