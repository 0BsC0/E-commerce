import React from "react";
import { useToastContext } from "@/context/ToastContext";

export default function ProfileForm({
  form,
  handleChange,
  handleSubmit,
  handleRoleChange,
  isViverista,
  showEmailChange,
  setShowEmailChange,
  showPasswordChange,
  setShowPasswordChange,
}) {
  const { showToast } = useToastContext();

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full border border-gray-300"
      >
        <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Mi Perfil</h2>

        <div className="grid grid-cols-1 gap-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              name="name"
              value={form.name}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
            <input
              name="lastName"
              value={form.lastName || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400"
              placeholder="Tu apellido"
            />
          </div>

          {/* Correo electrónico actual */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico actual</label>
            <input
              name="email"
              value={form.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Cambiar correo */}
          {!showEmailChange ? (
            <button
              type="button"
              onClick={() => setShowEmailChange(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Cambiar correo electrónico
            </button>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nuevo correo electrónico</label>
              <input
                name="newEmail"
                value={form.newEmail}
                onChange={handleChange}
                placeholder="Ingrese nuevo correo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400"
              />
            </div>
          )}

          {/* Dirección */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400"
            />
          </div>

          {/* Cambiar contraseña */}
          {!showPasswordChange ? (
            <button
              type="button"
              onClick={() => setShowPasswordChange(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Cambiar contraseña
            </button>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nueva contraseña</label>
                <input
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Nueva contraseña"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar nueva contraseña</label>
                <input
                  name="confirmNewPassword"
                  type="password"
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  placeholder="Confirmar contraseña"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400"
                />
              </div>
            </>
          )}

          {/* Rol actual */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rol actual</label>
            <input
              name="role"
              value={form.role}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 placeholder-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Nombre del vivero */}
          {isViverista && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del vivero</label>
              <input
                name="storeName"
                value={form.storeName || ""}
                onChange={handleChange}
                placeholder="Ej. Orquídeas El Paraíso"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400"
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
    </div>
  );
}
