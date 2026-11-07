import Image from "next/image";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Image src="/DAF_Logo_With_Text.png" alt="DAF – Digital Access to Finance" width={1500} height={780} className="h-12 w-auto sm:h-14" priority />
        <div className="ml-auto text-right sm:border-l sm:border-slate-200 sm:pl-5 sm:text-left">
          <h1 className="text-lg font-semibold text-[#29357F] sm:text-xl">DAF QR Studio</h1>
          <p className="text-sm text-slate-500">Create. Scan. Connect.</p>
        </div>
      </div>
    </header>
  );
}
