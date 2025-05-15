import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AuthContext } from "@/context/AuthContext";
import { getProductsByUser, deleteProduct } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import AddProductModal from "@/components/Products/AddProductModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaPlusCircle } from "react-icons/fa";

export default function ProductsAdminPage() {
  const { user } = useContext(AuthContext);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "viverista" || !user.token) {
      router.replace("/");
      return;
    }

    getProductsByUser(user.token)
      .then(setMyProducts)
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (productId) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(productId, user.token);
        setMyProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (err) {
        console.error("Error al eliminar producto:", err);
        alert("No se pudo eliminar el producto. Intenta más tarde.");
      }
    }
  };

  const handleEdit = (product) => {
    router.push(`/admin/products/edit/${product.id}`);
  };

  if (!user || user.role !== "viverista") return null;

  return (
    <DashboardLayout>
      <section className="max-w-6xl mx-auto px-4 md:px-0 py-8">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-green-800">
              📦 Gestión de Productos
            </h2>
            <p className="text-gray-600">
              Has registrado <strong>{myProducts.length}</strong> productos.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition"
          >
            <FaPlusCircle />
            Nuevo producto
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner text="Cargando tus productos..." />
          </div>
        ) : error ? (
          <p className="text-center text-red-600 text-base font-medium">
            {error}
          </p>
        ) : myProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-base font-medium">
            Aún no has registrado productos.
          </p>
        )}
      </section>

      <AddProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onProductCreated={(product) => {
          setMyProducts((prev) => [product, ...prev]);
          setShowModal(false);
        }}
      />
    </DashboardLayout>
  );
}