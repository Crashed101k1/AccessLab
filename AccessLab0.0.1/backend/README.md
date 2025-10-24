# AccessLab Backend

## Descripción
API REST para el sistema AccessLab. Maneja la lógica de negocio, autenticación y conexión con la base de datos.

## Estructura

```
backend/
├── src/
│   ├── controllers/     # Controladores por módulo
│   │   ├── auth/       # Autenticación y autorización
│   │   ├── users/      # Gestión de usuarios
│   │   ├── laboratories/ # Gestión de laboratorios
│   │   ├── bitacoras/  # Registro de bitácoras
│   │   ├── solicitudes/ # Manejo de solicitudes
│   │   └── avisos/     # Sistema de avisos
│   ├── models/         # Modelos de datos
│   ├── routes/         # Definición de rutas
│   ├── services/       # Lógica de negocio
│   ├── middleware/     # Middlewares (auth, cors, etc.)
│   ├── utils/          # Utilidades y helpers
│   └── config/         # Configuración de BD y app
├── tests/              # Pruebas unitarias y de integración
├── uploads/            # Archivos subidos
├── logs/              # Logs del sistema
└── README.md          # Este archivo
```

## Tecnologías
- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de datos**: MySQL/MariaDB
- **ORM/Query Builder**: Sequelize o MySQL2
- **Autenticación**: JWT
- **Validación**: Joi o Express-validator
- **Logging**: Winston
- **Testing**: Jest

## Instalación

1. Navegar a la carpeta backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tu configuración
```

4. Ejecutar en modo desarrollo:
```bash
npm run dev
```

## 🔧 Scripts disponibles
- `npm run dev` - Modo desarrollo con nodemon
- `npm start` - Producción
- `npm test` - Ejecutar pruebas
- `npm run lint` - Linter de código

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/recover-password` - Recuperar contraseña

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Laboratorios
- `GET /api/laboratories` - Listar laboratorios
- `POST /api/laboratories` - Crear laboratorio
- `PUT /api/laboratories/:id` - Actualizar laboratorio

### Bitácoras
- `GET /api/bitacoras` - Listar bitácoras
- `POST /api/bitacoras` - Crear bitácora
- `PUT /api/bitacoras/:id` - Actualizar bitácora
- `GET /api/bitacoras/:id/download` - Descargar PDF

## Autenticación y Autorización
El sistema usa JWT para autenticación y middleware de roles para autorización basada en:
- DIRECTOR/SUBDIRECTOR: Acceso completo
- TECNICO: Gestión limitada
- MAESTRO: Solo bitácoras propias

## Variables de Entorno
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=accesslab
DB_USER=root
DB_PASS=password
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
```