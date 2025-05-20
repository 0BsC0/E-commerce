import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { getCategories } from "@/services/productService";

export default function CategoryFilter({ value, onChange }) {
  const [categories, setCategories] = useState(["Todas las categorías"]);
  const selected = value || "Todas las categorías";

  const categoryIcons = {
    Orquidea: "🌸",
    Phalaenopsis: "🪴",
    Cattleya: "💐",
    "Todas las categorías": "🌿",
  };

  useEffect(() => {
    getCategories()
      .then((data) => {
        // Asegura que sea un array de strings
        const list = Array.isArray(data) ? data : [];
        setCategories(["Todas las categorías", ...list]);
      })
      .catch(console.error);
  }, []);

  const handleClear = () => onChange("");

  return (
    <div className="w-full md:w-72 space-y-2 relative z-10">
      <Listbox value={selected} onChange={(val) => onChange(val === "Todas las categorías" ? "" : val)}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-left text-sm text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition font-medium">
            <span className="flex items-center gap-2">
              <span>{categoryIcons[selected] || "🪷"}</span>
              {selected}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            </span>
          </Listbox.Button>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
              {categories.map((name) => (
                <Listbox.Option
                  key={name}
                  value={name}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none px-4 py-2 rounded-md flex items-center gap-2 ${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } ${selected ? "font-semibold" : ""}`
                  }
                >
                  <span>{categoryIcons[name] || "🪷"}</span>
                  <span>{name}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {value && (
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-sm text-green-700 hover:text-green-900 font-medium transition"
        >
          <XCircleIcon className="w-4 h-4" />
          Limpiar filtro
        </button>
      )}
    </div>
  );
}
