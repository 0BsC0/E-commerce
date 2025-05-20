# 🌿 OrquideaViva.com – E-commerce para Viveristas

**OrquideaViva** es una plataforma de comercio electrónico pensada para viveristas colombianos de Fusagasugá, diseñada para digitalizar su oferta de orquídeas nativas y conectar directamente con nuevos clientes mediante una experiencia moderna, segura y autogestionable.

---

## 📦 Estructura del proyecto

```
orquideaviva/
├── backend/              # Express + Prisma API
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   │   ├── auth/
│   ├── services/
│   ├── utils/
│   └── index.js
├── frontend/             # Next.js + Tailwind UI
│   ├── components/
│   │   ├── Products/
│   │   ├── Perfil/
│   │   ├── Orders/
│   │   └── ui/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── public/
│   ├── services/
│   ├── styles/
│   └── utils/
├── prisma/               # Esquema y migraciones de base de datos
├── .env.example          
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Comandos de desarrollo

### 🔧 Backend (Express.js)

```bash
# Instalación
cd backend
npm install

# Servidor en modo desarrollo
npm run dev

# Prisma - generar cliente
npx prisma generate

# Crear migración
npx prisma migrate dev --name init
```

### 💻 Frontend (Next.js)

```bash
# Instalación
cd frontend
npm install

# Servidor local
npm run dev
```

---

## 🔑 Variables de entorno

### 📁 backend/.env.example

```env
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/db
JWT_SECRET=clave_super_secreta
PORT=5000

EMAIL_USER=correo@dominio.com
EMAIL_PASS=clave_correo
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=supersecret
FRONTEND_URL=http://localhost:3000
```

### 📁 frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## ✅ Funcionalidades

### 🛍️ Clientes

- Registro y login con validación
- Exploración del catálogo de productos
- Añadir productos al carrito
- Checkout con Mercado Pago
- Recuperación de contraseña
- Historial de órdenes

### 🌱 Viveristas

- Cambio de rol a viverista
- Edición de perfil personal y de tienda
- Publicación de productos con imágenes
- Gestión de inventario y stock
- Edición y eliminación de productos
- Panel de control privado con pedidos

---

## 🛠️ Tecnologías utilizadas

### Backend

- Node.js + Express.js
- PostgreSQL con Prisma ORM
- Autenticación JWT + bcrypt
- Nodemailer con SMTP (Gmail)
- Cloudinary SDK para imágenes
- Mercado Pago SDK para pagos

### Frontend

- Next.js (React)
- Tailwind CSS + Context API
- Axios modularizado
- Toasts personalizados
- Cloudinary para subida y compresión de imágenes

---

## 📤 Despliegue sugerido

- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Railway](https://railway.app) / Render / Fly.io
- **Base de datos:** Railway PostgreSQL / Supabase
- **Imágenes:** [Cloudinary](https://cloudinary.com)

---

## 📎 Contacto / soporte

Este proyecto fue desarrollado como parte de la opción de grado para el programa de Ingeniería de Sistemas – Universidad de Cundinamarca, sede Fusagasugá.

📫 Para soporte, errores o mejoras, contactar a los desarrolladores listados en este repositorio o escribir a: **orquidea.viva.fusagasuga@gmail.com**

---

© 2025 – OrquideaViva.com
