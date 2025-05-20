import React, { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToastContext } from "@/context/ToastContext";
import { Geist, Geist_Mono } from "next/font/google";
import FeaturedProductsSlider from "@/components/Products/FeaturedProductsSlider";
import CategoryFilter from "@/components/Products/CategoryFilter";
import SearchBar from "@/components/Products/SearchBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { showToast } = useToastContext();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedCategory) filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;

      const data = await getProducts(filters);
      if (!Array.isArray(data)) throw new Error("Datos inválidos");
      setProducts(data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      showToast("error", "No se pudo cargar el catálogo de productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const totalResults = products.length;

  return (
    <DashboardLayout>
      <div className={`${geistSans.className} ${geistMono.className} bg-green-50 min-h-screen px-4 sm:px-8 lg:px-16 py-3`}>
        <div className="w-full space-y-14">

          {/* Bienvenida y destacados */}
          <section className="text-center space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-green-900 tracking-tight font-serif">
                Bienvenido a <span className="text-rose-600 italic">OrquídeaViva</span>
              </h1>
              <p className="text-lg text-gray-700 mt-4 font-light leading-relaxed max-w-2xl mx-auto">
                Descubre la belleza de nuestras orquídeas nativas, cultivadas con pasión desde los viveros de Fusagasugá
              </p>
            </div>
            <div className="w-full px-2 sm:px-4 max-w-screen-xl mx-auto">
              <FeaturedProductsSlider />
            </div>
          </section>

          {/* Filtros + Catálogo */}
          <section className="space-y-10 max-w-screen-xl mx-auto">
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center justify-between px-2 sm:px-0">
              <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
                <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>
              <p className="text-sm text-gray-600 text-end w-full sm:w-auto mt-2 sm:mt-0">
                {totalResults} producto{totalResults !== 1 && "s"} encontrado{totalResults !== 1 && "s"}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Todos los productos
              </h2>

              <div className="relative min-h-[400px]">
                {loading ? (
                  <div
                    className="absolute inset-0 z-10 flex justify-center items-center bg-white bg-opacity-70"
                    role="status"
                    aria-live="polite"
                  >
                    <LoadingSpinner text="Cargando productos..." />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-10 gap-y-12 justify-center mx-auto transition-all duration-300">
                    {products.length > 0 ? (
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
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
