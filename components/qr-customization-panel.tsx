import { AlertTriangle, RotateCcw } from "lucide-react";
import { type ECL, type QROptions } from "@/lib/qr-generator";
import { contrastWarning } from "@/lib/qr-validation";
import { fieldCls } from "./qr-generator-form";

interface Props {
  options: QROptions;
  onChange: (o: QROptions) => void;
  onReset: () => void;
}

const LEVELS: { v: ECL; label: string }[] = [
  { v: "L", label: "L – Low (7%)" },
  { v: "M", label: "M – Medium (15%)" },
  { v: "Q", label: "Q – Quartile (25%)" },
  { v: "H", label: "H – High (30%)" },
];

export function QrCustomizationPanel({ options: o, onChange, onReset }: Props) {
  const set = (patch: Partial<QROptions>) => onChange({ ...o, ...patch });
  const warn = contrastWarning(o.fg, o.bg);
  return (
    <details className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <summary className="cursor-pointer rounded-xl px-5 py-4 font-medium text-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30">
        Customize appearance
      </summary>
      <div className="grid gap-4 border-t border-slate-100 p-5">
        <div className="grid grid-cols-2 gap-4">
          {(
            [
              ["fg", "QR Code color"],
              ["bg", "Background color"],
            ] as const
          ).map(([k, label]) => (
            <label
              key={k}
              className="grid gap-1 text-sm font-medium text-slate-700"
            >
              {label}
              <input
                type="color"
                value={o[k]}
                onChange={(e) => set({ [k]: e.target.value.toUpperCase() })}
                className="h-10 w-full cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              />
            </label>
          ))}
        </div>
        {warn && (
          <p
            role="alert"
            className="flex gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0" /> {warn}
          </p>
        )}
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Size: {o.size} × {o.size} px
          <input
            type="range"
            min={200}
            max={1000}
            step={50}
            value={o.size}
            onChange={(e) => set({ size: Number(e.target.value) })}
            className="accent-[#29357F]"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Error correction
          <select
            value={o.useLogo ? "H" : o.ecl}
            disabled={o.useLogo}
            onChange={(e) => set({ ecl: e.target.value as ECL })}
            className={fieldCls}
          >
            {LEVELS.map((l) => (
              <option key={l.v} value={l.v}>
                {l.label}
              </option>
            ))}
          </select>
          {o.useLogo && (
            <span className="font-normal text-slate-500">
              Level H is used automatically with the center logo.
            </span>
          )}
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={o.useLogo}
            onChange={(e) => set({ useLogo: e.target.checked })}
            className="h-5 w-5 accent-[#29357F]"
          />
          Show DAF logo in the center
        </label>
        <button
          onClick={onReset}
          className="cursor-pointer inline-flex w-fit items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30"
        >
          <RotateCcw size={16} /> Reset to defaults
        </button>
      </div>
    </details>
  );
}
