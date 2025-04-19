const { PrismaClient } = require('../../generated/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// Registro de usuario (cliente o viverista)
exports.register = async (req, res) => {
  const {
    name,
    lastName,
    email,
    password,
    role = 'customer',
    phone,
    address,
    storeName,
  } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email ya registrado' });

    // Validar campos obligatorios si es viverista
    if (role === 'viverista') {
      if (!lastName || !storeName || !phone || !address) {
        return res.status(400).json({ error: 'Faltan datos obligatorios para viverista' });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashed,
        role,
        phone,
        address,
        storeName,
      },
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
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
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
