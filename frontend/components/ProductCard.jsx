import { FaTrash, FaEdit, FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/router";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { useToastContext } from "@/context/ToastContext";

export default function ProductCard({ product, onDelete }) {
  const { imageUrl, name, description, price, category, id, stock } = product;
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { addToCart } = useCartContext();
  const { showToast } = useToastContext();

  const isAdminView = router.pathname.includes("/admin/products");
  const isValidImage = imageUrl?.startsWith("http");
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (!user?.token) {
      showToast("error", "Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    if (user.role !== "customer") {
      showToast("error", "Solo los clientes pueden comprar productos.");
      return;
    }

    if (isOutOfStock) {
      showToast("error", "Este producto está agotado.");
      return;
    }

    addToCart(id, 1);
    showToast("success", "✅ Producto añadido al carrito");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200 overflow-hidden flex flex-col">

      {/* Imagen */}
      <div className="relative group overflow-hidden">
        <img
          src={isValidImage ? `${imageUrl}?q_auto,f_auto,w_400,h_250,c_fill` : "/placeholder.jpg"}
          alt={name}
          className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {isOutOfStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
            Agotado
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-base font-semibold text-gray-800 truncate" title={name}>
          {name || "Producto sin nombre"}
        </h3>

        <div className="flex justify-between items-center">
          <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize">
            {category || "General"}
          </span>

          <span className="text-lg font-extrabold text-green-700 tracking-tight">
            {isNaN(price) ? "N/A" : `$${parseFloat(price).toLocaleString("es-CO")}`}
          </span>
        </div>

        <p className="text-xs text-gray-500 leading-tight line-clamp-2">{description}</p>

        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs font-medium ${isOutOfStock ? "text-red-600" : "text-gray-600"}`}>
            Stock: {stock}
          </p>

          {isAdminView ? (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/admin/products/edit/${id}`)}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                title="Editar producto"
              >
                <FaEdit />
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(id)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                  title="Eliminar producto"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition ${
                isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isOutOfStock}
              title={isOutOfStock ? "Producto sin stock" : "Añadir al carrito"}
            >
              <FaCartPlus />
              {isOutOfStock ? "Sin stock" : "Comprar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
