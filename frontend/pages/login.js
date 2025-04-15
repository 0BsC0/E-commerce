import { useState, useContext } from 'react';
import { login } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const { login: setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      setAuth(data);
      router.push('/');
    } catch {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 mt-20 bg-white shadow rounded">
      <h1 className="text-xl mb-4 font-semibold text-center">Iniciar Sesión</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" className="w-full mb-3 p-2 border" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full mb-3 p-2 border" required />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Entrar</button>
    </form>
  );
}
