interface Props {
  svg: string | null; // the shared QR card (title + QR Code + description)
}

/** Hidden on screen; the only thing visible when printing. */
export function PrintLayout({ svg }: Props) {
  if (!svg) return null;
  return (
    <div className="print-only items-center justify-center bg-white p-[20mm]!">
      <div className="print-qr" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
