import { useState, useContext } from 'react';
import { createProduct } from '@/services/productService';
import { AuthContext } from '@/context/AuthContext';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function AddProductForm({ onProductCreated }) {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const { name, price, imageUrl, category } = formData;
    if (!name || !price || !imageUrl || !category) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }

    try {
      const newProduct = await createProduct(formData, token);
      onProductCreated?.(newProduct);
      setMessage('Producto creado exitosamente');
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
      });
    } catch (err) {
      console.error(err);
      setError('Error al crear producto. Inténtalo más tarde.');
    }
  };

  if (!user || user.role !== 'viverista') {
    return (
      <p className="text-center text-red-500 font-medium">
        Acceso restringido solo a viveristas.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow max-w-md mx-auto border"
    >
      <h2 className="text-xl font-bold text-gray-700">Nuevo Producto</h2>

      {error && (
        <p className="text-red-600 flex items-center gap-2 bg-red-100 p-2 rounded text-sm">
          <FaExclamationTriangle /> {error}
        </p>
      )}
      {message && (
        <p className="text-green-600 flex items-center gap-2 bg-green-100 p-2 rounded text-sm">
          <FaCheckCircle /> {message}
        </p>
      )}

      {[
        { name: 'name', label: 'Nombre del producto' },
        { name: 'description', label: 'Descripción' },
        { name: 'price', label: 'Precio', type: 'number' },
        { name: 'imageUrl', label: 'URL de la imagen' },
        { name: 'category', label: 'Categoría' },
      ].map(({ name, label, type = 'text' }) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            name={name}
            id={name}
            value={formData[name]}
            onChange={handleChange}
            required={['name', 'price', 'imageUrl', 'category'].includes(name)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
      >
        Agregar producto
      </button>
    </form>
  );
}
