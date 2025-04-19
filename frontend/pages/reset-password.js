import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaKey, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.isReady && router.query.token) {
      setToken(router.query.token);
    }
  }, [router.isReady, router.query.token]);

  const validatePassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      return setError("Token inválido o ausente.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }

    if (!validatePassword(newPassword)) {
      return setError(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."
      );
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");

      setSuccess("Contraseña actualizada correctamente.");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      console.error(err);
      setError(err.message);
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

        {error && (
          <p className="text-red-600 mb-4 text-sm flex items-center gap-2 bg-red-100 px-4 py-2 rounded">
            <FaExclamationTriangle /> {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mb-4 text-sm flex items-center gap-2 bg-green-100 px-4 py-2 rounded">
            <FaCheckCircle /> {success}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Tu nueva contraseña"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Actualizando..." : "Restablecer contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}
