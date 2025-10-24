# AccessLab Frontend

## Descripción
Interfaz de usuario web para el sistema AccessLab. Proporciona una experiencia intuitiva para todos los roles de usuario.

## Estructura

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── auth/       # Componentes de autenticación
│   │   ├── layout/     # Layout y navegación
│   │   ├── forms/      # Formularios
│   │   └── tables/     # Tablas de datos
│   ├── pages/          # Páginas por rol
│   │   ├── admin/      # Dashboard del director
│   │   ├── teacher/    # Dashboard del maestro
│   │   └── technician/ # Dashboard del técnico
│   ├── services/       # Servicios para API calls
│   ├── utils/          # Utilidades y helpers
│   ├── hooks/          # Custom hooks (React)
│   ├── context/        # Context providers
│   └── assets/         # Recursos estáticos
│       ├── images/     # Imágenes y logos
│       └── styles/     # Estilos CSS
├── public/             # Archivos públicos
├── tests/              # Pruebas de componentes
└── README.md          # Este archivo
```

## Tecnologías
- **Framework**: React.js o Vanilla JS + Bootstrap
- **Estado**: Context API o Redux
- **HTTP Client**: Axios
- **Routing**: React Router
- **UI Framework**: Bootstrap 5 o Material-UI
- **Build Tool**: Vite o Create React App
- **Testing**: Jest + React Testing Library

## Instalación

1. Navegar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con la URL del backend
```

4. Ejecutar en modo desarrollo:
```bash
npm run dev
```

## Scripts disponibles
- `npm run dev` - Modo desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm test` - Ejecutar pruebas
- `npm run lint` - Linter de código

## Características de UI/UX

### Diseño Responsivo
- Compatible con dispositivos móviles y escritorio
- Navegación adaptativa según el rol del usuario

### Accesibilidad
- Tipografía legible y de buen tamaño
- Contraste adecuado para usuarios con discapacidad visual
- Navegación por teclado

### Temas por Rol
- **Director/Subdirector**: Panel administrativo completo
- **Técnico**: Enfoque en solicitudes y avisos
- **Maestro**: Centrado en bitácoras y observaciones

## Páginas Principales

### Autenticación
- Login con email y contraseña
- Recuperación de contraseña
- Cambio de contraseña

### Dashboard por Rol
#### Director/Subdirector
- Gestión de usuarios
- Gestión de laboratorios
- Reportes y estadísticas
- Configuración del sistema

#### Técnico
- Visualización de bitácoras
- Gestión de solicitudes
- Publicación de avisos
- Inventario de laboratorios

#### Maestro
- Creación de bitácoras
- Observaciones personales
- Consulta de horarios
- Tablón de avisos

## Integración con Backend
```javascript
// Configuración de API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Ejemplo de servicio
export const authService = {
  login: (email, password) => axios.post(`${API_BASE_URL}/auth/login`, { email, password }),
  logout: () => axios.post(`${API_BASE_URL}/auth/logout`),
  // ... más métodos
};
```

## Funcionalidades Clave

### Sistema de Bitácoras
- Formulario intuitivo para registro
- Validaciones en tiempo real
- Guardado automático de borradores
- Descarga en PDF

### Gestión de Solicitudes
- Flujo de aprobación visual
- Notificaciones en tiempo real
- Historial de solicitudes
- Filtros y búsqueda

### Tablón de Avisos
- Feed de avisos en tiempo real
- Sistema de comentarios
- Categorización por laboratorio
- Notificaciones push

## Seguridad
- Autenticación JWT automática
- Rutas protegidas por rol
- Sanitización de inputs
- Logout automático por inactividad

## Variables de Entorno
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_APP_NAME=AccessLab
REACT_APP_VERSION=0.0.1
REACT_APP_ENVIRONMENT=development
```