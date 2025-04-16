import { useEffect, useState } from "react";
import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => console.error("Error al obtener productos", err));
  }, []);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} bg-green-50 min-h-screen px-4 sm:px-10 py-8`}
    >
      <h1 className="text-4xl font-bold text-center mb-10 text-green-800">
        🌿 OrquideaViva – Catálogo de Productos
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No hay productos disponibles por ahora.
          </p>
        )}
      </div>
    </div>
  );
}
