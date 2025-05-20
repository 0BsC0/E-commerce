const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getCategories
} = require('../controllers/productController');

// Obtener productos por categoria
router.get('/categories', getCategories);

// Obtener todos los productos públicos
router.get('/', getAllProducts);

// Obtener productos destacados (más vendidos o recientes)
router.get('/featured', getFeaturedProducts);

// Obtener productos del viverista autenticado
router.get('/my-products', verifyToken, getMyProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Crear producto (solo viveristas)
router.post('/', verifyToken, createProduct);

// Actualizar producto (solo dueño viverista)
router.put('/:id', verifyToken, updateProduct);

// Eliminar producto (solo dueño viverista)
router.delete('/:id', verifyToken, deleteProduct);

module.exports = router;
