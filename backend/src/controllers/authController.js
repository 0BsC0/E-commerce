const { PrismaClient } = require('../../generated/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const { sendNotificacion } = require('../services/emailService');

const prisma = new PrismaClient();

// Registro de usuario (cliente o viverista)
exports.register = async (req, res) => {
  const {
    name, lastName, email, password,
    role = 'customer', phone, address, storeName
  } = req.body;

  try {
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (role === 'viverista' && (!lastName || !storeName)) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para viverista' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Este correo ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashed,
        role,
        phone,
        address,
        storeName
      }
    });

    await sendNotificacion({
      to: email,
      subject: "🎉 Bienvenido a OrquideaViva",
      html: `<p>Hola ${name},</p><p>Tu cuenta ha sido creada exitosamente. ¡Gracias por unirte!</p>`
    });

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error interno al registrar el usuario' });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId: Date.now().toString()
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        storeName: user.storeName,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
};

// Enviar enlace de recuperación de contraseña
exports.recuperarPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Este correo no está registrado' });

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const rawToken = uuidv4();
    const jwtToken = jwt.sign({ id: user.id, raw: rawToken }, process.env.JWT_SECRET, { expiresIn: '15m' });

    await prisma.passwordResetToken.create({
      data: {
        token: rawToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${jwtToken}`;

    console.log("📧 Intentando enviar correo a:", email);
    console.log("🔗 Enlace de recuperación:", resetUrl);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    try {
      await transporter.sendMail({
        from: `OrquideaViva <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperación de contraseña',
        html: `
          <p>Hola ${user.name},</p>
          <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetUrl}" target="_blank">${resetUrl}</a>
          <p><strong>Este enlace expirará en 15 minutos.</strong></p>
        `
      });

      console.log("✅ Correo enviado con éxito");
      res.json({ message: '📩 Enlace de recuperación enviado al correo.' });
    } catch (error) {
      console.error("❌ Error al enviar el correo:", error);
      return res.status(500).json({ error: 'Fallo al enviar el correo. Intenta más tarde.' });
    }

  } catch (err) {
    console.error('Error en recuperación de contraseña:', err);
    res.status(500).json({ error: 'No se pudo enviar el correo de recuperación' });
  }
};

// Restablecer contraseña con token
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const rawToken = decoded.raw;

    const validToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: rawToken,
        userId: decoded.id,
        expiresAt: { gt: new Date() }
      }
    });

    if (!validToken) return res.status(400).json({ error: 'Token inválido o expirado' });

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashed }
    });

    await prisma.passwordResetToken.delete({ where: { id: validToken.id } });

    res.json({ message: '✅ Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error al restablecer contraseña:', err);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};
