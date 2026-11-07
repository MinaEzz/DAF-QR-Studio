"use client";
import { PrintLayout } from "../print-layout";
import CustomizationPanel from "./customization-panel/CustomizationPanel.component";
import GeneratorForm from "./generator-form/GeneratorForm.component";
import PreviewSection from "./preview-section/PreviewSection.component";
import { useGenerateQrCode } from "@/hooks/generate-qr-code/useGenerateQrCode.hook";

export default function QrStudio() {
  const {
    input,
    onInputChange,
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    error,
    handleGenerate,
    handleClear,
    result,
    busy,
    notice,
    run,
    stale,
    generate,
    options,
    DEFAULT_OPTIONS,
    setOptions,
  } = useGenerateQrCode();

  return (
    <>
      <main className="no-print w-full py-6!">
        <div className="container">
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 gap-6 px-4!">
            <section className="w-full grid grid-cols-1 gap-6">
              <GeneratorForm
                input={input}
                onInputChange={onInputChange}
                title={title}
                onTitleChange={onTitleChange}
                description={description}
                onDescriptionChange={onDescriptionChange}
                error={error}
                handleGenerate={handleGenerate}
                handleClear={handleClear}
              />
              <CustomizationPanel
                options={options}
                onChange={setOptions}
                onReset={() => setOptions(DEFAULT_OPTIONS)}
              />
            </section>
            <PreviewSection
              svg={result?.card?.svg ?? null}
              error={result?.error ?? null}
              stale={stale}
              notice={notice}
              busy={busy}
              onPng={() => run("png")}
              onSvg={() => run("svg")}
              onPdf={() => run("pdf")}
              onPrint={() => window.print()}
              onUpdate={generate}
            />
          </div>
        </div>
      </main>
      <PrintLayout svg={result?.card?.svg ?? null} />
    </>
  );
}
