// components/ProductCard.jsx
export default function ProductCard({ product, onDelete }) {
  const {
    imageUrl,
    name,
    description,
    price,
    category,
  } = product;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col justify-between">
      <img
        src={imageUrl || "/placeholder.jpg"}
        alt={name}
        className="w-full h-44 object-cover rounded-lg mb-3 border border-gray-200"
      />
      <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center mt-auto">
        <span className="text-green-700 font-bold">${parseFloat(price).toFixed(2)}</span>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          {category}
        </span>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(product.id)}
          className="mt-4 bg-red-500 text-white py-2 w-full rounded-lg font-medium hover:bg-red-600 transition"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
