const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient(); 

// GET todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// POST nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, category } = req.body;
    const newProduct = await prisma.product.create({
      data: { name, description, price, imageUrl, category },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

module.exports = router;
