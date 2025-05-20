import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useToastContext } from "@/context/ToastContext";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return showToast("error", "El correo es obligatorio.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showToast("error", "Formato de correo inválido.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/recuperar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar el correo");

      showToast("success", "📩 Enlace enviado para restablecer la contraseña.");
    } catch (err) {
      console.error(err);
      showToast("error", err.message || "No se pudo enviar el correo. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <div className="flex items-center justify-center mb-6">
          <FaEnvelope className="text-green-600 text-3xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Recuperar Contraseña</h2>
        </div>

        <label htmlFor="email" className="label">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className="input-base mb-4"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`btn-primary ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </button>
      </form>
    </div>
  );
}
