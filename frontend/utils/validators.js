// Validación para registro de usuarios
export const validateRegisterForm = (form) => {
    const errors = {};
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const phoneRegex = /^\d{10}$/;
  
    if (!form.name) errors.name = "El nombre es obligatorio.";
    if (!form.email) {
      errors.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(form.email)) {
      errors.email = "El correo no tiene un formato válido.";
    }
  
    if (!form.phone) {
      errors.phone = "El teléfono es obligatorio.";
    } else if (!phoneRegex.test(form.phone)) {
      errors.phone = "El teléfono debe tener 10 dígitos.";
    }
  
    if (!form.address) errors.address = "La dirección es obligatoria.";
  
    if (!form.password) {
      errors.password = "La contraseña es obligatoria.";
    } else if (!passwordRegex.test(form.password)) {
      errors.password =
        "Contraseña débil. Usa al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo.";
    }
  
    if (!form.confirmPassword) {
      errors.confirmPassword = "Debes confirmar la contraseña.";
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }
  
    return errors;
  };
  
  // Validación para login
  export const validateLoginForm = ({ email, password }) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email) {
      errors.email = "El correo es obligatorio.";
    } else if (!emailRegex.test(email)) {
      errors.email = "El correo no tiene un formato válido.";
    }
  
    if (!password) errors.password = "La contraseña es obligatoria.";
  
    return errors;
  };
  
  // Validación para edición de perfil
  export const validateProfileForm = (form) => {
    const errors = {};
    const phoneRegex = /^\d{10}$/;
  
    if (!form.name) errors.name = "El nombre es obligatorio.";
    if (!form.phone || !phoneRegex.test(form.phone)) {
      errors.phone = "El teléfono debe tener 10 dígitos.";
    }
    if (!form.address) errors.address = "La dirección es obligatoria.";
  
    if (form.newPassword || form.confirmNewPassword) {
      if (form.newPassword !== form.confirmNewPassword) {
        errors.confirmNewPassword = "Las contraseñas no coinciden.";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(form.newPassword)
      ) {
        errors.newPassword =
          "Contraseña débil. Usa al menos 8 caracteres, incluyendo mayúscula, minúscula, número y símbolo.";
      }
    }
  
    return errors;
  };