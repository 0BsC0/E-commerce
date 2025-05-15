import { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AuthContext } from "@/context/AuthContext";
import { getProductsByUser, updateProduct } from "@/services/productService";
import { uploadImage } from "@/services/uploadService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FaExclamationTriangle } from "react-icons/fa";
import useToast from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";

export default function EditProductPage() {
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

  if (!user || user.role !== "viverista") return null;

  return (
    <DashboardLayout>
      <section className="max-w-xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">
          ✏️ Editar Producto
        </h2>

        {toast.message && (
          <Toast type={toast.type} message={toast.message} onClose={closeToast} />
        )}

        {loading ? (
          <LoadingSpinner text="Cargando producto..." />
        ) : product ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white p-6 rounded-2xl shadow-md border"
          >
            {Object.keys(errors).length > 0 && (
              <p className="text-red-600 flex items-center gap-2 text-sm">
                <FaExclamationTriangle /> Corrige los errores marcados
              </p>
            )}

            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                name="name"
                ref={(el) => (firstErrorRef.current.name = el)}
                value={product.name}
                onChange={handleChange}
                className={`input-base ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Descripción</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="input-base"
                rows={3}
              />
            </div>

            <div>
              <label className="label">Precio</label>
              <input
                type="number"
                name="price"
                ref={(el) => (firstErrorRef.current.price = el)}
                value={product.price}
                onChange={handleChange}
                className={`input-base ${errors.price ? "border-red-500" : ""}`}
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="label">Categoría</label>
              <input
                type="text"
                name="category"
                ref={(el) => (firstErrorRef.current.category = el)}
                value={product.category}
                onChange={handleChange}
                className={`input-base ${errors.category ? "border-red-500" : ""}`}
              />
              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="label">Cantidad en Stock</label>
              <input
                type="number"
                name="stock"
                ref={(el) => (firstErrorRef.current.stock = el)}
                value={product.stock ?? ""}
                onChange={handleChange}
                min={0}
                className={`input-base ${errors.stock ? "border-red-500" : ""}`}
              />
              {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="label">Imagen</label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="file-input"
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.imageUrl}</p>
              )}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt="Vista previa"
                  className="w-full mt-3 rounded border h-48 object-cover"
                />
              )}
            </div>

            <button type="submit" className="btn-primary">
              Guardar Cambios
            </button>
          </form>
        ) : null}
      </section>
    </DashboardLayout>
  );
}
