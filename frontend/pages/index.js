  import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setError("No se pudo cargar el catálogo de productos.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div
        className={`${geistSans.className} ${geistMono.className} bg-green-50 min-h-screen px-4 sm:px-10 py-8`}
      >
        <h1 className="text-4xl font-bold text-center mb-10 text-green-800">
          🌿 OrquideaViva – Catálogo de Productos
        </h1>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full">
              <LoadingSpinner text="Cargando productos..." />
            </div>
          ) : error ? (
            <p className="col-span-full text-center text-red-600">{error}</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No hay productos disponibles por ahora.
            </p>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
