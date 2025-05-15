const express = require('express');
const router = express.Router();

const {
  createPaymentPreference,
  createOrderAfterPayment,
  webhookHandler
} = require('../controllers/paymentController');

const authenticateToken = require('../middlewares/authMiddleware');

// POST: crea preferencia de pago para redirigir al usuario a Mercado Pago
router.post('/create', authenticateToken, createPaymentPreference);

// GET: redirige desde Mercado Pago tras pago exitoso (Callback URL)
router.get('/success', createOrderAfterPayment);

// POST: recibe notificaciones desde Mercado Pago (Webhook URL)
router.post('/webhook', webhookHandler);

module.exports = router;