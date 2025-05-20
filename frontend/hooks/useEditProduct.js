import { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import { getProductsByUser, updateProduct } from "@/services/productService";
import { uploadImage } from "@/services/uploadService";
import useToast from "@/hooks/useToast";

export default function useEditProduct() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { id } = router.query;
  const { toast, showToast, closeToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const firstErrorRef = useRef({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageUrl = await uploadImage(file);
      setProduct((prev) => ({ ...prev, imageUrl }));
      showToast("success", "✅ Imagen actualizada correctamente");
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!product.name) newErrors.name = "El nombre es obligatorio";
    if (!product.price || isNaN(product.price)) newErrors.price = "Precio inválido";
    if (!product.category) newErrors.category = "La categoría es obligatoria";
    if (!product.imageUrl) newErrors.imageUrl = "Debes subir una imagen";
    if (product.stock === undefined || isNaN(product.stock) || product.stock < 0)
      newErrors.stock = "Stock inválido";

    setErrors(newErrors);
    const firstKey = Object.keys(newErrors)[0];
    if (firstKey && firstErrorRef.current[firstKey]) {
      firstErrorRef.current[firstKey].focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateProduct(id, product, user.token);
      showToast("success", "✅ Producto actualizado correctamente");
      setTimeout(() => router.push("/admin/products"), 1500);
    } catch (err) {
      console.error(err);
      showToast("error", err.message);
    }
  };

  useEffect(() => {
    if (!id || !user?.token) return;

    getProductsByUser(user.token)
      .then((res) => {
        const found = res.find((p) => p.id === parseInt(id));
        if (!found) {
          showToast("error", "Producto no encontrado o no autorizado");
          router.push("/admin/products");
          return;
        }
        setProduct(found);
      })
      .catch((err) => {
        console.error(err);
        showToast("error", err.message);
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  return {
    product,
    loading,
    toast,
    closeToast,
    handleChange,
    handleImageUpload,
    handleSubmit,
    errors,
    firstErrorRef,
    user,
  };
}
