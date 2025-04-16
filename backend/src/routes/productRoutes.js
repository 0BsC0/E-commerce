const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Middleware: verifica JWT y adjunta usuario al request
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
  }
};

// ✅ GET todos los productos públicos
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

// ✅ GET productos por viverista autenticado
router.get('/user/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    if (parseInt(userId) !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para ver estos productos' });
    }

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

// ✅ POST producto nuevo (solo viveristas)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;

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

// ✅ DELETE producto (verifica que el producto sea del usuario)
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
