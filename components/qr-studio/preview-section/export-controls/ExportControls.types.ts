export default interface IExportControlsProps {
  disabled: boolean;
  busy: string | null;
  onPng: () => void;
  onSvg: () => void;
  onPdf: () => void;
  onPrint: () => void;
}
