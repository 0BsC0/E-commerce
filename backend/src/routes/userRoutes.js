const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getUserProfile,
  updateUserProfile
} = require('../controllers/userController');

// Obtener perfil del usuario autenticado
router.get('/me', verifyToken, getUserProfile);

// Actualizar perfil del usuario autenticado
router.put('/me', verifyToken, updateUserProfile);

module.exports = router;
