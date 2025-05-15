import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToastContext } from "@/context/ToastContext";
import { Geist, Geist_Mono } from "next/font/google";
import FeaturedProductsSlider from "@/components/Products/FeaturedProductsSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastContext();

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Datos inválidos");
        setProducts(data);
      })
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        showToast("error", "No se pudo cargar el catálogo de productos.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div
        className={`${geistSans.className} ${geistMono.className} bg-green-50 min-h-screen px-4 sm:px-8 md:px-12 py-10`}
      >
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-green-900 tracking-tight font-serif">
              Bienvenido a <span className="text-rose-600 italic">OrquideaViva</span>
            </h1>
            <p className="text-xl text-gray-700 mt-4 font-light leading-relaxed max-w-2xl mx-auto">
              Descubre la belleza de nuestras orquídeas nativas, cultivadas con pasión desde los viveros de Fusagasugá
            </p>
          </header>
          <section className="mb-16">
            <FeaturedProductsSlider />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Todos los productos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center">
                  <LoadingSpinner text="Cargando productos..." />
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center">
                  <p className="text-gray-500 text-lg">
                    No hay productos disponibles por ahora.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
