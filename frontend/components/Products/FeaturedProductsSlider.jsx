import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Slider from "react-slick";
import { getFeaturedProducts } from "@/services/productService";
import { useToastContext } from "@/context/ToastContext";
import { AuthContext } from "@/context/AuthContext";
import ProductCardCompact from "@/components/ProductCardCompact";
import { FaChevronRight } from "react-icons/fa";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#4CAF50",
        borderRadius: "50%",
        width: "35px",
        height: "35px",
        right: "-15px",
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <FaChevronRight color="#fff" />
    </div>
  );
}

export default function FeaturedProductsSlider() {
  const [products, setProducts] = useState([]);
  const { showToast } = useToastContext();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const isViverista = user?.role === "viverista";

  useEffect(() => {
    getFeaturedProducts()
      .then(setProducts)
      .catch((err) => {
        console.error("❌ Error al cargar productos destacados:", err);
        showToast("error", "No se pudieron cargar los productos destacados");
      });
  }, []);

  if (!products.length || !router.isReady) return null;

  const settings = {
    dots: false,
    infinite: products.length > 5,
    speed: 500,
    centerMode: false,
    variableWidth: false,
    slidesToShow: isViverista ? 3 : 4, 
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    arrows: true,
    autoplay: products.length > 5,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: isViverista ? 3 : 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="rounded-3xl shadow-2xl px-0 py-4 border border-green-300 bg-gradient-to-br from-green-200 via-green-50 to-green-100">
      <h2 className="text-2xl font-bold text-green-900 text-left mb-8 tracking-tight px-4">
        🌿 Productos Destacados
      </h2>

      <Slider {...settings} className="mx-auto px-4">
        {products.map((product) => (
          <div key={product.id} className="px-2">
            <ProductCardCompact product={product} />
          </div>
        ))}
      </Slider>
    </section>
  );
}
