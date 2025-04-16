export default function ProductCard({ product, onDelete }) {
  const {
    imageUrl,
    name,
    description,
    price,
    category,
  } = product;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <img
        src={imageUrl || "/placeholder.jpg"}
        alt={name}
        className="w-full h-40 object-cover rounded mb-3 border border-gray-200"
      />
      <h2 className="text-lg font-bold text-gray-800 truncate">{name}</h2>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-green-700 font-semibold">${parseFloat(price).toFixed(2)}</span>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
          {category}
        </span>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(product.id)}
          className="mt-4 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
