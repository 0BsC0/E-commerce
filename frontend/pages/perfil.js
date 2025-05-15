import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProfileForm from "@/components/Perfil/ProfileForm";
import { AuthContext } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/services/userService";
import { validateProfileForm } from "@/utils/validators";
import { useToastContext } from "@/context/ToastContext";

export default function PerfilPage() {
  const { user, updateUser } = useContext(AuthContext);
  const { showToast } = useToastContext();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    newEmail: "",
    role: "",
    storeName: "",
    phone: "",
    address: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isViverista, setIsViverista] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    getUserProfile(user.token)
      .then(data => {
        setForm(prev => ({ ...prev, ...data }));
        setIsViverista(data.role === "viverista");
      })
      .catch(() => showToast("error", "No se pudo cargar el perfil."));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleRoleChange = () => {
    setIsViverista(true);
    setForm(prev => ({ ...prev, role: "viverista" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateProfileForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    showToast("info", "Actualizando perfil...");

    try {
      const response = await updateUserProfile(form, user.token);

      updateUser(response.user);
      showToast("success", typeof response.message === "string" ? response.message : "Perfil actualizado correctamente");

      if (response.user.role === "viverista") {
        setTimeout(() => router.push("/admin/products"), 1500);
      }
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.error || err?.message || "Error al actualizar el perfil.";
      showToast("error", message);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <Navbar />
      <div className="flex flex-1">
        {user?.role === "viverista" && (
          <aside className="hidden md:block w-60 bg-white shadow-sm border-r">
            <Sidebar />
          </aside>
        )}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-4xl mx-auto">
          <ProfileForm
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleRoleChange={handleRoleChange}
            isViverista={isViverista}
            showEmailChange={showEmailChange}
            setShowEmailChange={setShowEmailChange}
            showPasswordChange={showPasswordChange}
            setShowPasswordChange={setShowPasswordChange}
          />
        </main>
      </div>
    </div>
  );
}
