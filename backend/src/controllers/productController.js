const { PrismaClient } = require('../../generated/client');
const prisma = new PrismaClient();

// Crear un nuevo producto (solo viveristas)
exports.createProduct = async (req, res) => {
  const { name, description, price, imageUrl, category, stock } = req.body;

  if (req.user.role !== 'viverista') {
    return res.status(403).json({ error: 'Solo los viveristas pueden crear productos' });
  }

  if (!name || !price || !category || !imageUrl) {
    return res.status(400).json({ error: 'Todos los campos obligatorios deben ser completados' });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        stock: parseInt(stock) || 0,
        userId: req.user.id
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Obtener todos los productos públicos categorias y busqueda
exports.getAllProducts = async (req, res) => {
  const { category, search } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: [
          category ? { category: { equals: category, mode: 'insensitive' } } : {},
          search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } }
                ]
              }
            : {}
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


// Obtener un producto por ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Actualizar un producto (solo dueño y viverista)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl, category, stock } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    if (req.user.id !== product.userId || req.user.role !== 'viverista') {
      return res.status(403).json({ error: 'No autorizado para editar este producto' });
    }

    // Evitar edición si hay órdenes activas
    const activeOrders = await prisma.orderItem.findMany({
      where: {
        productId: product.id,
        order: {
          status: { in: ['PENDING', 'PAID', 'SHIPPED'] }
        }
      }
    });

    if (activeOrders.length > 0) {
      return res.status(400).json({ error: 'No se puede editar un producto con órdenes activas' });
    }

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        category,
        stock: parseInt(stock) || 0
      }
    });

    res.json({ message: 'Producto actualizado correctamente', product: updated });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto (solo dueño y viverista)
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    if (req.user.id !== product.userId || req.user.role !== 'viverista') {
      return res.status(403).json({ error: 'No autorizado para eliminar este producto' });
    }

    // Validar que no tenga órdenes activas
    const activeOrders = await prisma.orderItem.findMany({
      where: {
        productId: product.id,
        order: {
          status: { in: ['PENDING', 'PAID', 'SHIPPED'] }
        }
      }
    });

    if (activeOrders.length > 0) {
      return res.status(400).json({
        error: 'Este producto tiene órdenes activas y no puede eliminarse aún'
      });
    }

    // Limpiar del carrito antes
    await prisma.cartItem.deleteMany({ where: { productId: product.id } });

    await prisma.product.delete({
      where: { id: product.id }
    });

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Obtener productos del viverista autenticado
exports.getMyProducts = async (req, res) => {
  if (req.user.role !== 'viverista') {
    return res.status(403).json({ error: 'Solo viveristas pueden consultar sus productos' });
  }

  try {
    const products = await prisma.product.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos del viverista:', error);
    res.status(500).json({ error: 'Error al obtener tus productos' });
  }
};

// Obtener productos destacados únicos ordenados por fecha
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc' 
      },
      take: 10,
      distinct: ['id'] 
    });

    res.json(products);
  } catch (error) {
    console.error("❌ Error al obtener productos destacados:", error);
    res.status(500).json({ error: "Error al obtener productos destacados" });
  }
};

//Obtener las categorias 
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      where: {
        category: {
          not: ''
        }
      },
      distinct: ['category'],
      select: { category: true }
    });

    const list = categories.map((c) => c.category).filter(Boolean); // limpia null o ''
    res.json(list);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};


