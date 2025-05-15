import { useState } from "react";
import { useRouter } from "next/router";
import { register } from "@/services/authService";
import { FaLeaf, FaEye, FaEyeSlash } from "react-icons/fa";
import { useToastContext } from "@/context/ToastContext";
import { validateRegisterForm } from "@/utils/validators";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToastContext();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    role: "customer",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await register(form);
      showToast("success", "Registro exitoso. Redirigiendo...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      showToast("error", err.message || "Error al registrar. Verifica los datos.");
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
        </div>

        <div className="space-y-4">
          {[
            { name: "name", type: "text", placeholder: "Nombres" },
            { name: "email", type: "email", placeholder: "Correo electrónico" },
            { name: "phone", type: "text", placeholder: "Teléfono" },
            { name: "address", type: "text", placeholder: "Dirección" },
          ].map(({ name, type, placeholder }) => (
            <div key={name}>
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className={`input-base ${errors[name] ? "border-red-500" : ""}`}
                aria-invalid={!!errors[name]}
                aria-describedby={`${name}-error`}
              />
              {errors[name] && (
                <p id={`${name}-error`} className="text-sm text-red-600 mt-1">
                  {errors[name]}
                </p>
              )}
            </div>
          ))}

          {/* Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className={`input-base pr-10 ${errors.password ? "border-red-500" : ""}`}
              aria-invalid={!!errors.password}
              aria-describedby="password-error"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Mostrar u ocultar contraseña"
              className="absolute right-3 top-2 text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className={`input-base pr-10 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby="confirmPassword-error"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Mostrar u ocultar confirmación"
              className="absolute right-3 top-2 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-red-600 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`btn-primary ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </div>
      </form>
    </div>
  );
}
