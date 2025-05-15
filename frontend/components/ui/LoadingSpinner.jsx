export default function LoadingSpinner({ text = "Cargando..." }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-full py-10"
      role="status"
      aria-live="polite"
      aria-label={text}
    >
      <span
        className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"
        aria-hidden="true"
      ></span>
      <p className="mt-4 text-sm text-gray-600">{text}</p>
    </div>
  );
}
