const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Middleware para verificar token y usuario autenticado
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

// ✅ GET /api/users/profile/:id — obtener perfil (solo del propio usuario)
router.get('/profile/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  if (parseInt(id) !== req.user.id) {
    return res.status(403).json({ error: 'No autorizado para ver este perfil' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// ✅ PUT /api/users/profile/:id — actualizar perfil (solo si coincide con el ID del token)
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
