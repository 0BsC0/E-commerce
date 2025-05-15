const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const orderController = require('../controllers/orderController');

//Crear una nueva orden desde el carrito
router.post('/', verifyToken, orderController.createOrderFromCart);

//Obtener todas las órdenes del usuario autenticado
router.get('/', verifyToken, orderController.getUserOrders);

//Ver detalles de una orden específica
router.get('/:id', verifyToken, orderController.getOrderDetails);

//Actualizar estado de la orden (solo admin o viverista)
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);

module.exports = router;
