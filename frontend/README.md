
# 🌿 OrquideaViva.com – E-commerce para Viveristas

OrquideaViva es una plataforma de comercio electrónico pensada para viveros colombianos en la ciudad de Fusagasugá que desean digitalizar su oferta y conectar con nuevos compradores.

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
├── prisma/               
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

# Iniciar servidor (dev)
npm run dev

# Generar cliente Prisma (después de modificar schema)
npx prisma generate

# Migraciones
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

### Clientes

- Registro / Login
- Carrito de compras
- Recuperación de contraseña
- Historial de órdenes

### Viveristas

- Crear productos
- Ver pedidos recibidos
- Cambiar estado de órdenes
- Panel privado de gestión

---

## 🛠️ Tecnologías usadas

### Backend

- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT + bcrypt
- Nodemailer (Gmail SMTP)
- Cloudinary SDK

### Frontend

- Next.js + React
- Tailwind CSS + Context API
- Toast global personalizado
- Axios + servicios modulares
- Cloudinary para imágenes

---

## 📤 Despliegue sugerido

- **Frontend:** Vercel (Next.js)
- **Backend:** Railway / Render / Fly.io
- **DB:** Railway PostgreSQL / Supabase
- **Imágenes:** Cloudinary

---

## 📎 Contacto / soporte

Este proyecto fue desarrollado como opción de grado por estudiantes de **Ingeniería de Sistemas – Universidad de Cundinamarca, sede Fusagasugá**.

📫 Para soporte técnico o despliegue, contactar a los desarrolladores registrados en este repositorio.
