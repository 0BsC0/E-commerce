import { useState } from 'react';
import { register } from '@/services/authService';
import { useRouter } from 'next/router';
import { FaLeaf, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }

    if (!form.name.trim()) {
      setError('El nombre completo es obligatorio.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!validatePassword(form.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.');
      return;
    }

    try {
      await register(form);
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error?.includes('registrado')) {
        setError('Este correo electrónico ya está registrado.');
      } else {
        setError('Error al registrar. Verifica los datos.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
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
          <div>
            <label htmlFor="name" className="block text-sm text-gray-700 font-medium mb-1">Nombre completo</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Luis Fernando"
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 font-medium mb-1">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 font-medium mb-1">Contraseña</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número, 1 símbolo"
                className="w-full px-4 py-2 pr-10 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700 font-medium mb-1">Confirmar contraseña</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-2 pr-10 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 text-gray-500">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
}
