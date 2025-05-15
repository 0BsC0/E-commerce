const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
  }

  try {
    const tokenRecord = await prisma.passwordResetToken.findUnique({ where: { token } });

    if (!tokenRecord || new Date() > tokenRecord.expiresAt) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({ where: { token } });

    res.json({ message: '✅ Contraseña actualizada correctamente.' });
  } catch (err) {
    console.error('Error restableciendo contraseña:', err);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
});

module.exports = router;
