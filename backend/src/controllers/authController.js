const { PrismaClient } = require('../../generated/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const prisma = new PrismaClient();

// Registrar usuario (customer o viverista)
exports.register = async (req, res) => {
  const {
    name, lastName, email, password,
    role = 'customer', phone, address, storeName
  } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email ya registrado' });

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (role === 'viverista' && (!lastName || !storeName)) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para viverista' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, lastName, email, password: hashed, role, phone, address, storeName }
    });

    res.status(201).json({ message: 'Registrado correctamente' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

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
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
};

// Enviar enlace de recuperación de contraseña
exports.recuperarPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: 'OrquideaViva <no-reply@orquideaviva.com>',
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <p>Hola ${user.name},</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>Este enlace expirará en 15 minutos.</p>
      `,
    });

    res.json({ message: 'Enlace de recuperación enviado al correo.' });
  } catch (err) {
    console.error('Error en recuperación:', err);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
};

// Resetear contraseña desde token
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token y nueva contraseña requeridos' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashed },
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error al restablecer contraseña:', err);
    res.status(400).json({ error: 'Token inválido o expirado' });
  }
};
