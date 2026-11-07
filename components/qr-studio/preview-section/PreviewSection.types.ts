export default interface IPreviewSectionProps {
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
