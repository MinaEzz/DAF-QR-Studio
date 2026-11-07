export default function OptionalWarning() {
  return (
    <div className="w-full flex items-center gap-2 px-4! py-3! bg-blue-100 rounded-2xl my-4!">
      <span className="w-8 h-8 bg-[#29357F] rounded-full text-xl font-extrabold flex items-center justify-center text-white shrink-0">
        !
      </span>
      <p className="text-sm text-[#29357F] font-semibold">
        Optional. Title and description are displayed in the preview and
        exported files. They are not encoded in the QR Code itself.
      </p>
    </div>
  );
}
