import React from "react";
import Toast from "@/components/ui/Toast";

export default function ProfileForm({
  form,
  handleChange,
  handleSubmit,
  handleRoleChange,
  isViverista,
  error,
  message,
  showEmailChange,
  setShowEmailChange,
  showPasswordChange,
  setShowPasswordChange,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-2xl shadow-xl w-full border border-gray-200"
    >
      <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Mi Perfil</h2>

      {error && (
        <p className="text-red-600 mb-4 text-sm flex items-center gap-2 bg-red-100 px-4 py-2 rounded">
          <FaExclamationTriangle /> {error}
        </p>
      )}

      {message && (
        <p className="text-green-600 mb-4 text-sm flex items-center gap-2 bg-green-100 px-4 py-2 rounded">
          <FaCheckCircle /> {message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Correo electrónico actual</label>
          <input
            name="email"
            value={form.email}
            className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-600"
            disabled
          />
        </div>

        {!showEmailChange && (
          <button
            type="button"
            onClick={() => setShowEmailChange(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Cambiar correo electrónico
          </button>
        )}

        {showEmailChange && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Nuevo correo electrónico</label>
            <input
              name="newEmail"
              value={form.newEmail}
              onChange={handleChange}
              placeholder="Ingrese nuevo correo"
              className="w-full px-4 py-2 border rounded focus:ring-green-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-green-500"
          />
        </div>

        {!showPasswordChange && (
          <button
            type="button"
            onClick={() => setShowPasswordChange(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Cambiar contraseña
          </button>
        )}

        {showPasswordChange && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Nueva contraseña"
                className="w-full px-4 py-2 border rounded focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
              <input
                name="confirmNewPassword"
                type="password"
                value={form.confirmNewPassword}
                onChange={handleChange}
                placeholder="Confirmar contraseña"
                className="w-full px-4 py-2 border rounded focus:ring-green-500"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Rol actual</label>
          <input
            name="role"
            value={form.role}
            className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-600"
            disabled
          />
        </div>

        {isViverista && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del vivero</label>
            <input
              name="storeName"
              value={form.storeName || ""}
              onChange={handleChange}
              placeholder="Ej. Orquídeas El Paraíso"
              className="w-full px-4 py-2 border rounded focus:ring-green-500"
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {!isViverista && (
            <button
              type="button"
              onClick={handleRoleChange}
              className="sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Cambiar a Viverista
            </button>
          )}

          <button
            type="submit"
            className="sm:w-1/2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </form>
  );
}
