# AccessLab Frontend - Maquetado# AccessLab Frontend - Maquetado# Visualización Local - AccessLab Frontend# AccessLab Frontend



## 📋 Descripción

Maquetado estático de las vistas de AccessLab organizadas por roles. Solo HTML, CSS y JavaScript básico para validación simple.

## 📋 Descripción

## 📁 Estructura Actualizada

Maquetado estático de las vistas de AccessLab. Solo HTML, CSS y JavaScript básico para validación simple.

```

frontend/## 📋 Descripción## Descripción

├── html/

│   ├── login.html           # Página de login principal## 📁 Estructura Actual

│   ├── admin/

│   │   └── HomeAdmin.html   # Dashboard de administradorEste directorio contiene únicamente el **maquetado estático** de las vistas de AccessLab. Interfaz de usuario web para el sistema AccessLab. Proporciona una experiencia intuitiva para todos los roles de usuario.

│   ├── tecnico/             # Vistas del técnico (pendientes)

│   └── maestro/             # Vistas del maestro (pendientes)```

├── css/

│   └── login.css            # Estilos del loginfrontend/No incluye funcionalidad de backend ni conexión a base de datos.

├── js/

│   └── login.js             # Validación simple de login├── html/

└── public/

    └── images/│   ├── login.html      # Página de login## Estructura

        └── AccessLabLogo.png  # Logo de AccessLab

```│   └── HomeAdmin.html  # Dashboard de administrador



## 🚀 Cómo Probar├── css/## 📁 Estructura Actual



### Iniciar con el Login│   └── login.css       # Estilos del login

1. Ve a: `C:\Users\delab\Desktop\AccessLab\AccessLab0.0.1\frontend\html\`

2. Abre `login.html` en tu navegador├── js/```

3. Usa las credenciales de prueba

│   └── login.js        # Validación simple de login

### 🔐 Credenciales de Prueba

- **Rol**: Director/Subdirector└── public/```frontend/

- **Usuario**: `admin`

- **Contraseña**: `admin123`    └── images/



Al hacer login correctamente, se redirige a `admin/HomeAdmin.html`        └── AccessLabLogo.png  # Logo de AccessLabfrontend/├── src/



## 🎯 Funcionalidades```



✅ **Implementado:**├── index.html          # Página de inicio/splash│   ├── components/      # Componentes reutilizables

- Login con validación simple

- Redirección organizada por roles## 🚀 Cómo Probar

- Dashboard básico de admin con cards informativos

- Diseño responsive├── html/│   │   ├── auth/       # Componentes de autenticación

- Botón de cerrar sesión

- Estructura de carpetas por roles### Iniciar con el Login



❌ **NO Implementado:**1. Ve a: `C:\Users\delab\Desktop\AccessLab\AccessLab0.0.1\frontend\html\`│   └── login.html      # Página de login│   │   ├── layout/     # Layout y navegación

- Autenticación real

- Backend/API2. Abre `login.html` en tu navegador

- Base de datos

- Vistas para técnico y maestro3. Usa las credenciales de prueba├── css/│   │   ├── forms/      # Formularios



## 📂 Organización por Roles

- **`admin/`**: Vistas del Director/Subdirector

- **`tecnico/`**: Vistas del Técnico (pendiente)### 🔐 Credenciales de Prueba│   └── login.css       # Estilos del login│   │   └── tables/     # Tablas de datos

- **`maestro/`**: Vistas del Maestro (pendiente)

- **Rol**: Director/Subdirector

---

**Desarrollado por**: Gael Maximiliano Velázquez Barrera- **Usuario**: `admin`├── js/│   ├── pages/          # Páginas por rol

- **Contraseña**: `admin123`

│   └── login.js        # Efectos visuales básicos (sin backend)│   │   ├── admin/      # Dashboard del director

Al hacer login correctamente, se redirige a `HomeAdmin.html`

└── public/│   │   ├── teacher/    # Dashboard del maestro

## 🎯 Funcionalidades

    └── images/│   │   └── technician/ # Dashboard del técnico

✅ **Implementado:**

- Login con validación simple        └── AccessLabLogo.png  # Logo de AccessLab│   ├── services/       # Servicios para API calls

- Redirección a dashboard de admin

- Dashboard básico con cards informativos```│   ├── utils/          # Utilidades y helpers

- Diseño responsive

- Botón de cerrar sesión│   ├── hooks/          # Custom hooks (React)



❌ **NO Implementado:**## 🚀 Cómo Visualizar Localmente│   ├── context/        # Context providers

- Autenticación real

- Backend/API│   └── assets/         # Recursos estáticos

- Base de datos

- Otras vistas (técnico, maestro)### Opción 1: Abrir directamente en navegador│       ├── images/     # Imágenes y logos



---1. Ve a la carpeta: `C:\Users\delab\Desktop\AccessLab\AccessLab0.0.1\frontend\`│       └── styles/     # Estilos CSS

**Desarrollado por**: Gael Maximiliano Velázquez Barrera
2. Haz doble clic en `index.html`├── public/             # Archivos públicos

3. Se abrirá en tu navegador predeterminado├── tests/              # Pruebas de componentes

└── README.md          # Este archivo

### Opción 2: Usar navegador específico```

1. Abre tu navegador preferido (Chrome, Firefox, Edge)

2. Arrastra el archivo `index.html` a la ventana del navegador## Tecnologías

3. O usa Ctrl+O para abrir archivo y selecciona `index.html`- **Framework**: React.js o Vanilla JS + Bootstrap

- **Estado**: Context API o Redux

## 🎨 Páginas Disponibles- **HTTP Client**: Axios

- **Routing**: React Router

### 🏠 Página de Inicio (`index.html`)- **UI Framework**: Bootstrap 5 o Material-UI

- Splash screen con logo de AccessLab- **Build Tool**: Vite o Create React App

- Redirige automáticamente al login después de 2 segundos- **Testing**: Jest + React Testing Library

- Click para acceder más rápido

## Instalación

### 🔐 Página de Login (`html/login.html`)

- Formulario de login con selector de roles (Director, Técnico, Maestro)1. Navegar a la carpeta frontend:

- Campos: Usuario y Contraseña```bash

- Efectos visuales y validaciones básicascd frontend

- Fondo degradado verde agua a azul```

- **Nota**: Solo maquetado visual, sin autenticación real

2. Instalar dependencias:

## 🎯 Estado Actual - Solo Maquetado```bash

npm install

✅ **Implementado:**```

- Diseño responsive para móvil y escritorio

- Validación visual de formularios3. Configurar variables de entorno:

- Efectos de hover y focus```bash

- Animaciones CSS básicascp .env.example .env

- Estados de carga simulados# Editar .env con la URL del backend

- Logo integrado correctamente```



❌ **NO Implementado (pendiente):**4. Ejecutar en modo desarrollo:

- Autenticación real```bash

- Conexión a base de datosnpm run dev

- Navegación entre páginas```

- Funcionalidad de backend

- Otras vistas del sistema## Scripts disponibles

- `npm run dev` - Modo desarrollo

## 📝 Tecnologías Usadas- `npm run build` - Build para producción

- **HTML5** - Estructura de páginas- `npm run preview` - Preview del build

- **CSS3** - Estilos y animaciones- `npm test` - Ejecutar pruebas

- **JavaScript** - Efectos visuales básicos (sin backend)- `npm run lint` - Linter de código



## 🔄 Próximos Pasos## Características de UI/UX

1. ✅ Completar maquetado del login 

2. ⏳ Crear maquetado de dashboards por rol### Diseño Responsivo

3. ⏳ Implementar navegación entre páginas- Compatible con dispositivos móviles y escritorio

4. ⏳ Desarrollar backend con Node.js/Express- Navegación adaptativa según el rol del usuario

5. ⏳ Conectar con base de datos MySQL

### Accesibilidad

---- Tipografía legible y de buen tamaño

**Estado**: Maquetado de login completado  - Contraste adecuado para usuarios con discapacidad visual

**Desarrollado por**: Gael Maximiliano Velázquez Barrera  - Navegación por teclado

**Institución**: Universidad Tecnológica de Morelia
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