// pages/recuperar.js
import { useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function RecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });
  const [cargando, setCargando] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 4000); // Oculta tras 4 seg
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return showToast('error', 'El correo es obligatorio.');

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showToast('error', 'Formato de correo inválido.');
    }

    setCargando(true);
    try {
      const res = await fetch('/api/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar el correo');

      showToast('success', '📩 Enlace enviado para restablecer la contraseña.');
    } catch (err) {
      console.error(err);
      showToast('error', 'No se pudo enviar el correo. Intenta más tarde.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-white flex items-center justify-center p-6 relative">
      {/* TOAST */}
      {toast.message && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-md text-white flex items-center gap-2 transition-all duration-300
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <div className="flex items-center justify-center mb-6">
          <FaEnvelope className="text-green-600 text-3xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Recuperar Contraseña</h2>
        </div>

        <label htmlFor="email" className="block text-sm text-gray-700 font-medium mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 mb-4"
          required
        />

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
        >
          {cargando ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>
    </div>
  );
}
