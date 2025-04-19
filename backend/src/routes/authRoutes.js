const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { recuperarPassword, resetPassword } = require('../controllers/resetPasswordController');

// Registrar un nuevo usuario
router.post('/register', register);

// Iniciar sesión
router.post('/login', login);

// Solicitar recuperación de contraseña 
router.post('/recuperar', recuperarPassword);

// Restablecer contraseña 
router.post('/reset-password', resetPassword);

module.exports = router;
