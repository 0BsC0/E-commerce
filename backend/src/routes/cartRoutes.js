const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

//Agregar producto al carrito
router.post('/add', verifyToken, cartController.addToCart);

//Obtener carrito del usuario autenticado
router.get('/', verifyToken, cartController.getCartByUser);

//Eliminar un ítem específico del carrito (por ID del ítem)
router.delete('/:id', verifyToken, cartController.removeFromCart);

//Vaciar todo el carrito del usuario
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;
