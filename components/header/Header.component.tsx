import Image from "next/image";

export default function Header() {
  return (
    <header className="no-print w-full border-b border-slate-200 bg-white">
      <div className="container">
        <div className="w-full flex items-center justify-between gap-4 py-3!">
          {/** DAF LOGO */}
          <div className="h-14 sm:h-14 w-auto">
            <Image
              src="/DAF_Logo_With_Text.png"
              alt="DAF – Digital Access to Finance"
              width={1500}
              height={780}
              priority
            />
          </div>
          {/** APP SLOGAN */}
          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-5! sm:text-left!">
            <h1 className="text-lg font-semibold text-[#29357F] sm:text-xl">
              DAF QR Studio
            </h1>
            <p className="text-sm text-slate-500">Create. Scan. Connect.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
