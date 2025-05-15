import { useEffect, useState } from "react";
import Slider from "react-slick";
import { getFeaturedProducts } from "@/services/productService";
import { useToastContext } from "@/context/ToastContext";
import { useRouter } from "next/router";

export default function FeaturedProductsSlider() {
  const [products, setProducts] = useState([]);
  const { showToast } = useToastContext();
  const router = useRouter();

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("❌ Error al cargar productos destacados:", err);
        showToast("error", "No se pudieron cargar los productos destacados");
      });
  }, []);

  if (!products.length) return null;

  const settings = {
    dots: true,
    infinite: false,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="relative rounded-3xl shadow-2xl px-8 py-12 border border-green-300 bg-gradient-to-br from-green-200 via-green-50 to-green-100">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-green-900 text-center mb-10 tracking-tight">
          🌿 Productos Destacados
        </h2>

        <Slider {...settings}>
          {products.map((product) => (
            <div
              key={product.id}
              className="px-3 cursor-pointer"
              onClick={() => router.push(`/producto/${product.id}`)}
            >
              <div className="group bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-green-400 transition-all duration-300 overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={`${product.imageUrl}?q_auto,f_auto,w_400,h_200,c_fill`}
                    alt={product.name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-green-800 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {product.description || "Sin descripción"}
                  </p>
                  <p className="text-green-700 font-bold text-base group-hover:text-green-900 transition-colors duration-300">
                    ${parseFloat(product.price).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
