import React from "react";

export default function LoadingSpinner({ text = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center text-gray-600 py-10">
      <div className="w-10 h-10 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-3 text-sm">{text}</p>
    </div>
  );
}
