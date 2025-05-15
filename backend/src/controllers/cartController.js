const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Producto y cantidad válidos son requeridos' });
  }

  try {
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId: req.user.id,
        productId: parseInt(productId),
      },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + parseInt(quantity),
        },
      });

      return res.status(200).json({
        message: 'Cantidad actualizada en el carrito',
        cartItem: updated,
      });
    }

    const newItem = await prisma.cartItem.create({
      data: {
        quantity: parseInt(quantity),
        productId: parseInt(productId),
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: 'Producto agregado al carrito',
      cartItem: newItem,
    });
  } catch (error) {
    console.error('❌ Error en addToCart:', error.message);
    res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
  }
};

// Obtener carrito del usuario autenticado
exports.getCartByUser = async (req, res) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { id: 'asc' },
    });

    res.status(200).json(cart);
  } catch (error) {
    console.error('❌ Error en getCartByUser:', error.message);
    res.status(500).json({ error: 'No se pudo obtener el carrito' });
  }
};

// Eliminar un ítem específico del carrito
exports.removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await prisma.cartItem.findUnique({ where: { id: parseInt(id) } });

    if (!item || item.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para eliminar este ítem del carrito' });
    }

    await prisma.cartItem.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('❌ Error en removeFromCart:', error.message);
    res.status(500).json({ error: 'No se pudo eliminar el producto del carrito' });
  }
};

// Vaciar todo el carrito del usuario autenticado
exports.clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });

    res.status(200).json({ message: 'Carrito vaciado correctamente' });
  } catch (error) {
    console.error('❌ Error en clearCart:', error.message);
    res.status(500).json({ error: 'No se pudo vaciar el carrito' });
  }
};
