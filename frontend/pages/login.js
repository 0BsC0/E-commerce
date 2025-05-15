import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { login } from "@/services/authService";
import { AuthContext } from "@/context/AuthContext";
import { useToastContext } from "@/context/ToastContext";
import { FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import { validateLoginForm } from "@/utils/validators";

export default function LoginPage() {
  const { login: setAuth } = useContext(AuthContext);
  const { showToast } = useToastContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLoginForm({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = await login({ email, password });
      setAuth(data);
      showToast("success", "Sesión iniciada correctamente");
      router.push("/");
    } catch (err) {
      console.error(err);
      showToast("error", err.message || "Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-white flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <div className="flex items-center justify-center mb-6">
          <FaLeaf className="text-green-600 text-3xl mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
        </div>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="label">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className={`input-base ${errors.email ? "border-red-500" : ""}`}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="label">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                className={`input-base pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500"
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Recuperar contraseña */}
          <div className="text-right text-sm">
            <button
              type="button"
              onClick={() => router.push("/recuperar")}
              className="text-blue-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
