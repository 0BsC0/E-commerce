const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();

// Crear una orden a partir del carrito
exports.createOrderFromCart = async (req, res) => {
  try {
    const { paymentId } = req.body;

    // Validar si el pago ya fue registrado previamente
    if (paymentId) {
      const existingOrder = await prisma.order.findFirst({
        where: { paymentId }
      });

      if (existingOrder) {
        return res.status(409).json({
          message: 'Este pago ya fue registrado',
          order: existingOrder
        });
      }
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Verificar stock disponible
    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          error: `El producto "${item.product.name}" no tiene suficiente stock.`
        });
      }
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Crear la orden
    const newOrder = await prisma.order.create({
      data: {
        total,
        status: 'PAID',
        userId: req.user.id,
        paymentId: paymentId || null,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: { items: true }
    });

    // Descontar stock por cada producto comprado
    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // Vaciar carrito
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    res.status(201).json({ message: 'Orden creada exitosamente', order: newOrder });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al procesar la orden' });
  }
};

// Obtener órdenes del usuario o del viverista
exports.getUserOrders = async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      const orders = await prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
          items: { include: { product: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      return res.json(orders);
    }

    if (req.user.role === 'viverista') {
      const orders = await prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                userId: req.user.id
              }
            }
          }
        },
        include: {
          items: { include: { product: true } },
          user: true
        },
        orderBy: { createdAt: 'desc' }
      });

      const formatted = orders.map((order) => ({
        ...order,
        customerName: `${order.user.name} ${order.user.lastName ?? ''}`.trim()
      }));

      return res.json(formatted);
    }

    return res.status(403).json({ error: 'No autorizado' });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

// Obtener detalles de una orden específica
exports.getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: { include: { product: true } },
        user: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Permitir acceso solo si es admin, dueño o viverista asociado
    if (
      req.user.role !== 'admin' &&
      req.user.id !== order.userId &&
      !order.items.some((item) => item.product.userId === req.user.id)
    ) {
      return res.status(403).json({ error: 'No autorizado para ver esta orden' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error al obtener detalles de la orden:', error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

// Actualizar estado de la orden
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: { include: { product: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const ownsSomeProduct = order.items.some(
      (item) => item.product.userId === req.user.id
    );

    if (req.user.role !== 'admin' && !ownsSomeProduct) {
      return res.status(403).json({ error: 'No autorizado para modificar esta orden' });
    }

    const updated = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({ message: 'Estado de la orden actualizado', order: updated });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ error: 'Error al actualizar orden' });
  }
};
