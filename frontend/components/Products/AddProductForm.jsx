import { useState, useContext } from "react";
import { createProduct } from "@/services/productService";
import { uploadImage } from "@/services/uploadService";
import { AuthContext } from "@/context/AuthContext";
import { useToastContext } from "@/context/ToastContext";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function AddProductForm({ onProductCreated }) {
  const { user } = useContext(AuthContext);
  const { showToast } = useToastContext();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    category: "",
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "stock"].includes(name)) {
      if (/^\d*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Solo puedes subir archivos de imagen.");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
      setPreview(URL.createObjectURL(file));
      showToast("success", "✅ Imagen subida correctamente");
    } catch (err) {
      console.error(err);
      showToast("error", "No se pudo subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
      showToast("error", "Solo se permiten números.");
    }
  };

  const handleKeyDown = (e) => {
    const invalidChars = ["e", "E", "+", "-", "."];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, stock, imageUrl, category } = formData;
    if (!name || !price || !stock || !imageUrl || !category) {
      showToast("error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    if (isNaN(price) || Number(price) <= 0 || Number(stock) < 0) {
      showToast("error", "Precio o stock inválido.");
      return;
    }

    try {
      const newProduct = await createProduct(formData, user.token);
      onProductCreated?.(newProduct);
      showToast("success", "Producto creado exitosamente");

      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        category: "",
      });
      setPreview(null);
    } catch (err) {
      console.error(err);
      showToast("error", "Error al crear producto. Intenta más tarde.");
    }
  };

  if (!user || user.role !== "viverista") {
    return (
      <p className="text-center text-red-500 font-medium">
        Acceso restringido solo a viveristas.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label">Nombre del producto</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-base"
        />
      </div>

      <div>
        <label className="label">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-base"
          rows={3}
        />
      </div>

      <div>
        <label className="label">Precio</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          inputMode="numeric"
          required
          placeholder="Ej: 20000"
          className="input-base"
        />
      </div>

      <div>
        <label className="label">Cantidad en stock</label>
        <input
          type="text"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          inputMode="numeric"
          required
          placeholder="Ej: 10"
          className="input-base"
        />
      </div>

      <div>
        <label className="label">Categoría</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Ej: Orquídeas, Bonsai, Cactus..."
          required
          className="input-base"
        />
      </div>

      <div>
        <label className="label flex items-center gap-2">
          <FaCloudUploadAlt /> Imagen del producto
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-600 file:text-white
                    hover:file:bg-green-700 transition"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Subiendo imagen...</p>}
        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            className="mt-2 rounded-md border w-full h-48 object-cover"
          />
        )}
      </div>

      <button type="submit" className="btn-primary w-full" disabled={uploading}>
        {uploading ? "Subiendo imagen..." : "Agregar producto"}
      </button>
    </form>
  );
}
