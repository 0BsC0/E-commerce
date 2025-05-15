const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar el token JWT de autenticación.
 * Asegura que el usuario esté autenticado correctamente.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.email || !decoded.role) {
      return res.status(403).json({ error: 'Token inválido o incompleto' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('⛔ Error al verificar token:', err.message);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = verifyToken;
