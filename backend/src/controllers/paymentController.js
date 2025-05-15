const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();
const { createPreference, getPaymentStatus } = require('../services/mercadoPagoService');

// POST /api/payment/create → Crea preferencia de pago con Mercado Pago
exports.createPaymentPreference = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const preference = await createPreference(req.user.id, cartItems);
    res.json({ init_point: preference.init_point });
  } catch (error) {
    console.error('❌ Error al crear preferencia de pago:', error);
    res.status(500).json({ error: 'Error al iniciar el pago' });
  }
};

// GET /api/payment/success → Callback después del pago
exports.createOrderAfterPayment = async (req, res) => {
  try {
    const { userId, payment_id } = req.query;
    if (!userId || !payment_id) return res.status(400).send("Parámetros faltantes");

    const existing = await prisma.order.findFirst({ where: { paymentId: payment_id } });
    if (existing) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${existing.id}`);
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(userId) },
      include: { product: true }
    });

    if (!cartItems.length) return res.status(400).send('Carrito vacío o no encontrado');

    const total = cartItems.reduce((sum, item) => (
      sum + item.product.price * item.quantity
    ), 0);

    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        total,
        status: 'PAID',
        paymentId: payment_id,
        items: {
          create: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    await prisma.cartItem.deleteMany({ where: { userId: parseInt(userId) } });

    res.redirect(`${process.env.FRONTEND_URL}/payment/success?orderId=${order.id}`);
  } catch (error) {
    console.error("❌ Error al crear la orden después del pago:", error);
    res.status(500).send("Error al procesar la orden");
  }
};

// POST /api/payment/webhook → Webhook de confirmación automática
exports.webhookHandler = async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type !== 'payment' || !data?.id) return res.sendStatus(200);

    const paymentId = data.id.toString();

    const exists = await prisma.order.findFirst({ where: { paymentId } });
    if (exists) return res.sendStatus(200);

    const paymentData = await getPaymentStatus(paymentId);
    if (!paymentData || paymentData.status !== 'approved') return res.sendStatus(200);

    const userId = parseInt(paymentData.metadata?.userId);
    if (!userId) return res.sendStatus(400);

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    if (!cartItems.length) return res.sendStatus(200);

    const total = cartItems.reduce((sum, item) => (
      sum + item.product.price * item.quantity
    ), 0);

    await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PAID',
        paymentId,
        items: {
          create: cartItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      }
    });

    await prisma.cartItem.deleteMany({ where: { userId } });

    res.sendStatus(201);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.sendStatus(500);
  }
};
