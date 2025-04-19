import { useState, useContext } from 'react';
import { login } from '@/services/authService';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { FaLeaf, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const { login: setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const data = await login({ email, password });
      setAuth(data);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos.');
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
          <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 text-sm rounded flex items-center gap-2">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className="w-full px-4 py-2 pr-10 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => router.push('/recuperar')}
              className="text-blue-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
