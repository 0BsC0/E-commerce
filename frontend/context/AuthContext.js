import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Detecta token inválido o expirado y cierra sesión
  const handleTokenError = (error) => {
    const message = error?.response?.data?.error || error?.message || "";
    const status = error?.response?.status;

    if (
      status === 401 ||
      status === 403 ||
      message.toLowerCase().includes("token") ||
      message.toLowerCase().includes("jwt")
    ) {
      console.warn("🔒 Token inválido o expirado. Cerrando sesión automáticamente...");
      logout();
      window.location.href = "/"; 
    }
  };

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.token = storedToken;
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("Error cargando usuario desde sessionStorage:", err);
      sessionStorage.clear(); 
    }
  }, []);

  const login = ({ user, token }) => {
    const newUser = { ...user, token };
    sessionStorage.setItem("user", JSON.stringify(newUser));
    sessionStorage.setItem("token", token);
    setUser(newUser);
  };

  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        handleTokenError // disponible para otros contextos
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
