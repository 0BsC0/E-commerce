import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaKey } from "react-icons/fa";
import { useToastContext } from "@/context/ToastContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToastContext();

  useEffect(() => {
    if (router.isReady && router.query.token) {
      setToken(router.query.token);
    }
  }, [router.isReady, router.query.token]);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) return showToast("error", "El enlace no contiene un token válido.");
    if (newPassword !== confirmPassword) return showToast("error", "Las contraseñas no coinciden.");
    if (!validatePassword(newPassword)) {
      return showToast(
        "error",
        "La contraseña debe tener mínimo 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo."
      );
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al restablecer la contraseña");

      showToast("success", "Contraseña actualizada correctamente.");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      console.error(err);
      showToast("error", err.message || "No se pudo actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-50 to-white p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <div className="flex items-center justify-center mb-6">
          <FaKey className="text-green-600 text-3xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Restablecer contraseña</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tu nueva contraseña"
              className="input-base"
              required
            />
          </div>

          <div>
            <label className="label">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              className="input-base"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Actualizando..." : "Restablecer contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}
