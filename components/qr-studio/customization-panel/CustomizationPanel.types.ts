import type { QROptions } from "@/lib/qr-generator";

export default interface ICustomizationPanelProps {
  options: QROptions;
  onChange: (o: QROptions) => void;
  onReset: () => void;
}
