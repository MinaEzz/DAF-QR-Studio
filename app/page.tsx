import { AppHeader } from "@/components/app-header";
import { QrStudio } from "@/components/qr-studio";

export default function Home() {
  return (
    <>
      <div className="no-print"><AppHeader /></div>
      <QrStudio />
    </>
  );
}
