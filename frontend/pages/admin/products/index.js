import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AuthContext } from "@/context/AuthContext";
import { getProductsByUser, deleteProduct } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import AddProductForm from "@/components/AddProductForm";

export default function ProductsAdminPage() {
  const { user, token } = useContext(AuthContext);
  const [myProducts, setMyProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "viverista") {
      router.replace("/");
    } else {
      getProductsByUser(user.id, token)
        .then(setMyProducts)
        .catch((err) => console.error("Error al cargar productos", err));
    }
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📦 Tus Productos</h2>
        </div>

        <AddProductForm
          onProductCreated={(product) =>
            setMyProducts((prev) => [product, ...prev])
          }
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myProducts.length > 0 ? (
            myProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              Aún no has registrado productos.
            </p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
