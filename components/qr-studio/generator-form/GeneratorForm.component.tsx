import { Eraser, Link, QrCode } from "lucide-react";
import IGeneratorFormProps from "./GeneratorForm.types";
import OptionalWarning from "./optional-warning/OptionalWarning.component";

const fieldCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3! py-2! text-base text-slate-900 placeholder:text-slate-400 focus:border-[#29357F] focus:outline-none focus:ring-2 focus:ring-[#29357F]/30";

const btnCls =
  "inline-flex border items-center justify-center gap-2 rounded-lg px-5! py-3! focus:outline-none focus-visible:ring-4";

export default function GeneratorForm({
  input,
  onInputChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  error,
  handleGenerate,
  handleClear,
}: IGeneratorFormProps) {
  return (
    <form className="w-full bg-white rounded-xl border border-slate-200 px-4! py-6! shadow-sm">
      <h2 className="w-full text-2xl text-[#29357F] font-bold capitalize flex items-center gap-2 mb-6!">
        <Link size={24} />
        Generate Your QR Code
      </h2>
      {/** QR CONTENT INPUT */}

      <label className="w-full flex flex-col gap-2 text-base font-medium text-slate-800">
        Content For Your QR Code
        <textarea
          value={input}
          onChange={onInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
          }}
          rows={5}
          placeholder="Paste a Google Forms link, website URL, text, or any information..."
          aria-invalid={!!error}
          aria-describedby="qr-input-msg"
          className={`${fieldCls} resize-y ${error ? "border-red-500" : ""}`}
        />
        <div
          id="qr-input-msg"
          className="mt-1! flex justify-between gap-3 text-sm"
        >
          <span role="alert" className="text-red-600">
            {error}
          </span>
          <span className="shrink-0 text-slate-500">
            {input.length.toLocaleString()} characters
          </span>
        </div>
      </label>
      {/** SUBMIT & CLEAR BUTTONS */}
      <div className="w-full flex items-center gap-3 mt-4! pb-5! border-b border-slate-100">
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className={`${btnCls} text-lg flex-1 border-[#29357F] bg-[#29357F] font-semibold text-white hover:bg-[#222c69] hover:border-[#222c69] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/40`}
        >
          <QrCode size={20} /> Generate QR Code
        </button>
        <button
          type="reset"
          onClick={handleClear}
          className={`${btnCls} text-lg border-slate-300 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#29357F]/30`}
        >
          <Eraser size={20} /> Clear
        </button>
      </div>
      {/** OPTIONAL WARNING TEXT */}
      <OptionalWarning />
      {/** TITLE & DESCRIPTION INPUTS */}
      <div className="w-full flex flex-col gap-4">
        <label className="w-full flex flex-col gap-2 text-base font-medium text-slate-800">
          <span>
            Title <span className="text-slate-400">(Optional)</span>
          </span>
          <input
            value={title}
            onChange={onTitleChange}
            placeholder="Employee Attendance"
            className={fieldCls}
          />
        </label>
        <label className="w-full flex flex-col gap-2 text-base font-medium text-slate-800">
          <span>
            Description <span className="text-slate-400">(Optional)</span>
          </span>
          <textarea
            value={description}
            onChange={onDescriptionChange}
            rows={2}
            placeholder="Scan the QR Code to register your attendance."
            className={fieldCls}
          />
        </label>
      </div>
    </form>
  );
}
