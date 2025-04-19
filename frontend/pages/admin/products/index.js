import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AuthContext } from "@/context/AuthContext";
import { getProductsByUser, deleteProduct } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import AddProductForm from "@/components/AddProductForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductsAdminPage() {
  const { user, token } = useContext(AuthContext);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "viverista") {
      router.replace("/");
      return;
    }

    getProductsByUser(user.id, token)
      .then(setMyProducts)
      .catch((err) => {
        console.error("Error al cargar productos", err);
        setError("No se pudieron cargar los productos.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (productId) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await deleteProduct(productId, token);
        setMyProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (err) {
        console.error("Error al eliminar producto", err);
        alert("Error al eliminar producto");
      }
    }
  };

  if (!user || user.role !== "viverista") return null;

  return (
    <DashboardLayout>
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📦 Gestión de Productos
        </h2>

        <div className="mb-10">
          <AddProductForm
            onProductCreated={(product) =>
              setMyProducts((prev) => [product, ...prev])
            }
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner text="Cargando tus productos..." />
          </div>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : myProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Aún no has registrado productos.
          </p>
        )}
      </section>
    </DashboardLayout>
  );
}
