const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();

const verifyToken = require('../middlewares/authMiddleware'); 

//todos los productos públicos
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

//productos del viverista autenticado
router.get('/user/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  if (parseInt(userId) !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado para ver estos productos' });
  }

  try {
    const products = await prisma.product.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener productos del usuario' });
  }
});

//producto nuevo (solo viveristas)
router.post('/', verifyToken, async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        userId: req.user.id,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

//DELETE producto del viverista autenticado
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product || product.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para eliminar este producto' });
    }

    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
