import { useState, useContext } from 'react';
import { createProduct } from '@/services/productService';
import { AuthContext } from '@/context/AuthContext';

export default function AddProductForm({ onProductCreated }) {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, price, imageUrl, category } = formData;
    if (!name || !price || !imageUrl || !category) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      const newProduct = await createProduct(formData, token);
      if (onProductCreated) onProductCreated(newProduct);
      alert('✅ Producto creado exitosamente');
      setFormData({ name: '', description: '', price: '', imageUrl: '', category: '' });
    } catch (err) {
      console.error(err);
      alert('❌ Error al crear producto');
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
      className="space-y-4 bg-white p-6 rounded shadow max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-700">Nuevo Producto</h2>

      {['name', 'description', 'price', 'imageUrl', 'category'].map((field) => (
        <input
          key={field}
          type={field === 'price' ? 'number' : 'text'}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field]}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required={['name', 'price', 'imageUrl', 'category'].includes(field)}
        />
      ))}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        Agregar
      </button>
    </form>
  );
}
