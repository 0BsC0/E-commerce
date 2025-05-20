import { FaSearch } from "react-icons/fa";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full md:w-80">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o descripción..."
        className="w-full pl-10 pr-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition font-medium"
      />
      <FaSearch className="absolute left-3 top-2.5 text-gray-400 text-sm pointer-events-none" />
    </div>
  );
}
