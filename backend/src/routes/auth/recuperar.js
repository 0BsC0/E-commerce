const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();

const { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } = process.env;

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Correo requerido' });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(200).json({ message: 'Si el correo existe, recibirás un enlace.' });

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
      <p>Hola ${user.name},</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p><strong>Este enlace expirará en 15 minutos.</strong></p>
    `;

    await transporter.sendMail({
      from: `OrquideaViva <${EMAIL_USER}>`,
      to: user.email,
      subject: 'Recupera tu contraseña',
      html,
    });

    res.json({ message: '📩 Enlace de recuperación enviado correctamente.' });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    res.status(500).json({ error: 'Error al enviar enlace de recuperación' });
  }
});

module.exports = router;
