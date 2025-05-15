const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const preference = new Preference(client);
const payment = new Payment(client);

// Crea preferencia de pago con back_urls y metadata
exports.createPreference = async (userId, cartItems) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

  const items = cartItems.map(item => ({
    title: String(item.product.name || 'Producto sin nombre'),
    quantity: Number(item.quantity || 1),
    unit_price: Number(item.product.price || 0),
    currency_id: 'COP'
  }));

  const body = {
    items,
    back_urls: {
      success: `${backendUrl}/api/payment/success?userId=${userId}`,
      failure: `${frontendUrl}/payment/failure`,
      pending: `${frontendUrl}/payment/pending`
    },
    auto_return: "approved",
    metadata: {
      userId: String(userId)
    }
  };

  try {
    const response = await preference.create({ body });
    console.log("✅ Preferencia creada correctamente:", response.id || response.body?.id);
    return response;
  } catch (error) {
    console.error('❌ Error al crear preferencia de pago:', error?.message || error);
    throw error;
  }
};

// Consulta estado de un pago por su ID
exports.getPaymentStatus = async (paymentId) => {
  try {
    const result = await payment.get({ id: paymentId });
    return result.body;
  } catch (error) {
    console.error('❌ Error al consultar estado de pago:', error?.message || error);
    return null;
  }
};
