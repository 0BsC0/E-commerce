const express = require('express');
const router = express.Router();

const {
  register,
  login,
  recuperarPassword,
  resetPassword
} = require('../controllers/authController');

//Registro de nuevo usuario
//Body: { name, lastName?, email, password, phone, address, role?, storeName? }
router.post('/register', register);

//Inicio de sesión
//Body: { email, password }
router.post('/login', login);

//Enviar enlace para restablecer contraseña
//Body: { email }
router.post('/recuperar', recuperarPassword);

//Restablecer contraseña usando token
//Body: { token, newPassword }
router.post('/reset-password', resetPassword);

module.exports = router;
