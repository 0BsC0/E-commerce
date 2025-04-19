// pages/register.js
import { useState } from 'react';
import { register } from '@/services/authService';
import { useRouter } from 'next/router';
import {
  FaLeaf, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash
} from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { name, email, password, confirmPassword, address, phone } = form;

    if (!name || !email || !password || !confirmPassword || !address || !phone) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register({ ...form });
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      if (err.response?.data?.error?.includes('registrado')) {
        setError('Este correo electrónico ya está registrado.');
      } else {
        setError('Error al registrar. Verifica los datos.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="flex items-center justify-center mb-6">
          <FaLeaf className="text-green-600 text-3xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
        </div>

        {error && (
          <p className="text-red-600 mb-4 text-sm text-center flex items-center justify-center gap-2 bg-red-100 px-4 py-2 rounded">
            <FaExclamationTriangle /> {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 mb-4 text-sm text-center flex items-center justify-center gap-2 bg-green-100 px-4 py-2 rounded">
            <FaCheckCircle /> {success}
          </p>
        )}

        <div className="space-y-4">
          <input type="text" name="name" placeholder="Nombre completo" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="address" placeholder="Dirección" value={form.address} onChange={handleChange} className="w-full p-2 border rounded" />

          <div className="relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full p-2 pr-10 border rounded" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-500">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={handleChange} className="w-full p-2 pr-10 border rounded" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 text-gray-500">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition">
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
}
