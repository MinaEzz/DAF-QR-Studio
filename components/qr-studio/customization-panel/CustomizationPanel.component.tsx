"use client";
import {
  AlertTriangle,
  ChevronDownIcon,
  RotateCcw,
  Settings,
} from "lucide-react";
import ICustomizationPanelProps from "./CustomizationPanel.types";
import { ECL, QROptions } from "@/lib/qr-generator";
import { useState } from "react";
import { contrastWarning } from "@/lib/qr-validation";

const LEVELS: { v: ECL; label: string }[] = [
  { v: "L", label: "L – Low (7%)" },
  { v: "M", label: "M – Medium (15%)" },
  { v: "Q", label: "Q – Quartile (25%)" },
  { v: "H", label: "H – High (30%)" },
];

const fieldCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3! py-2! text-base text-slate-900 placeholder:text-slate-400 focus:border-[#29357F] focus:outline-none focus:ring-2 focus:ring-[#29357F]/30";

const btnCls =
  "inline-flex border items-center justify-center gap-2 rounded-lg px-5! py-3! focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed! disabled:opacity-60";

export default function CustomizationPanel({
  options: o,
  onReset,
  onChange,
}: ICustomizationPanelProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const set = (patch: Partial<QROptions>) => onChange({ ...o, ...patch });
  const warn = contrastWarning(o.fg, o.bg);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 px-4! py-6! shadow-sm">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="w-full xl:text-2xl md:text-xl text-lg text-[#29357F] font-bold capitalize flex items-center gap-2">
          <Settings size={20} />
          Customize Appearance
        </h2>
        <ChevronDownIcon
          size={26}
          className={`transition-all ease-in-out duration-300 ${isOpen ? "rotate-180 " : ""}`}
        />
      </button>

      {isOpen && (
        <div className="w-full border-t border-slate-100 mt-6! pt-5! flex flex-col  gap-4">
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                ["fg", "QR Code color"],
                ["bg", "Background color"],
              ] as const
            ).map(([k, label]) => (
              <label
                key={k}
                className="w-full flex flex-col gap-2 md:text-base text-sm font-medium text-slate-700"
              >
                {label}
                <input
                  type="color"
                  value={o[k]}
                  onChange={(e) => set({ [k]: e.target.value.toUpperCase() })}
                  className="w-full h-10 cursor-pointer rounded-lg border border-slate-300 bg-white p-1!"
                />
              </label>
            ))}
          </div>
          {warn && (
            <p
              role="alert"
              className="w-full flex items-center gap-2 rounded-lg bg-amber-50 p-3! text-sm text-amber-800"
            >
              <AlertTriangle size={18} className="shrink-0" />
              {warn}
            </p>
          )}

          <label className="w-full flex flex-col gap-2 md:text-base text-sm font-medium text-slate-700">
            Export Resolution: {o.size} × {o.size} px
            <input
              type="range"
              min={200}
              max={2000}
              step={100}
              value={o.size}
              onChange={(e) => set({ size: Number(e.target.value) })}
              className="accent-[#29357F]"
            />
            <span className="text-xs text-slate-500">
              Controls the exported QR card dimensions and resolution.
            </span>
          </label>
          <label className="w-full flex flex-col gap-2 md:text-base text-sm font-medium text-slate-700">
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
          <label className="w-full flex items-center gap-3 md:text-base text-sm font-medium text-slate-700">
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
            className={`${btnCls} w-fit text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30`}
          >
            <RotateCcw size={16} /> Reset to defaults
          </button>
        </div>
      )}
    </div>
  );
}
