const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// GET /users/me
// Obtiene los datos del perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
};

// PUT /users/me
// Actualiza los datos del perfil del usuario autenticado
exports.updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name, lastName, phone, address,
    storeName, role, newEmail, newPassword
  } = req.body;

  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Nombre, teléfono y dirección son obligatorios' });
  }

  // Validación de rol si se actualiza
  const allowedRoles = ['customer', 'viverista'];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Rol no permitido' });
  }

  // Validación para cambio a viverista
  if (role === 'viverista' && (!lastName || !storeName)) {
    return res.status(400).json({ error: 'Debe ingresar apellido y nombre del vivero para ser viverista' });
  }

  const dataToUpdate = {
    name,
    phone,
    address,
    ...(lastName && { lastName }),
    ...(storeName && { storeName }),
    ...(role && { role }),
  };

  // Verificación de cambio de correo electrónico (único)
  if (newEmail) {
    const emailExists = await prisma.user.findFirst({
      where: { email: newEmail, id: { not: userId } },
    });
    if (emailExists) {
      return res.status(400).json({ error: 'El nuevo correo ya está en uso' });
    }
    dataToUpdate.email = newEmail;
  }

  // Si se solicita cambio de contraseña
  if (newPassword) {
    dataToUpdate.password = await bcrypt.hash(newPassword, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    const cleanUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      storeName: updatedUser.storeName,
      role: updatedUser.role,
    };

    res.json({ message: 'Perfil actualizado correctamente', user: cleanUser });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};
