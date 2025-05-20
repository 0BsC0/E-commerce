import DashboardLayout from "@/layouts/DashboardLayout";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Toast from "@/components/ui/Toast";
import useEditProduct from "@/hooks/useEditProduct";

export default function EditProductPage() {
  const {
    product,
    loading,
    toast,
    closeToast,
    handleChange,
    handleImageUpload,
    handleSubmit,
    errors,
    firstErrorRef,
    user
  } = useEditProduct();

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
                ⚠️ Corrige los errores marcados
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
