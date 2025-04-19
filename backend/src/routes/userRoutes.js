const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();

const verifyToken = require('../middlewares/authMiddleware');

//perfil del usuario autenticado
router.get('/profile/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado para ver este perfil' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        storeName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

//actualizar perfil del usuario autenticado
router.put('/profile/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, lastName, phone, address, storeName, role } = req.body;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado para actualizar este perfil' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, lastName, phone, address, storeName, role },
    });

    res.json({ message: 'Perfil actualizado correctamente', user: updatedUser });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

module.exports = router;
