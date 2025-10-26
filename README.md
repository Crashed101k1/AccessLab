# 🏛️ AccessLab - Sistema de Gestión de Laboratorios Universitarios

[![GitHub](https://img.shields.io/badge/GitHub-Crashed101k1%2FAccessLab-blue?logo=github)](https://github.com/Crashed101k1/AccessLab)
[![Versión](https://img.shields.io/badge/Versión-0.0.1-green)](https://github.com/Crashed101k1/AccessLab/releases)
[![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)](https://github.com/Crashed101k1/AccessLab/tree/desarrollo)
[![Universidad](https://img.shields.io/badge/Universidad-UTM-red)](https://www.utm.mx/)

## 📋 Descripción del Proyecto

**AccessLab** es una plataforma web integral diseñada para gestionar el control de acceso, reservas y actividades en laboratorios universitarios. Desarrollado específicamente para la **Universidad Tecnológica de Morelia (UTM)**, este sistema optimiza la administración de recursos académicos y facilita la coordinación entre estudiantes, profesores y personal técnico.

### 🎯 Objetivos Principales
- **Control de Acceso**: Sistema seguro de autenticación por roles
- **Gestión de Reservas**: Programación eficiente de uso de laboratorios
- **Bitácoras Digitales**: Registro detallado de actividades y mantenimiento
- **Gestión de Usuarios**: Administración centralizada de permisos y roles
- **Sistema de Avisos**: Comunicación efectiva entre usuarios

## 🏗️ Arquitectura del Sistema

### 📁 Estructura Principal
```
AccessLab/
├── 📂 AccessLab0.0.1/           # Aplicación principal
│   ├── 📂 backend/              # Servidor Node.js + Express
│   │   ├── 📂 src/
│   │   │   ├── 📂 config/       # Configuraciones
│   │   │   ├── 📂 controllers/  # Controladores por módulo
│   │   │   ├── 📂 middleware/   # Middleware personalizado
│   │   │   ├── 📂 models/       # Modelos de datos
│   │   │   ├── 📂 routes/       # Definición de rutas
│   │   │   ├── 📂 services/     # Lógica de negocio
│   │   │   └── 📂 utils/        # Utilidades generales
│   │   ├── 📂 logs/             # Archivos de registro
│   │   ├── 📂 tests/            # Tests automatizados
│   │   └── 📂 uploads/          # Archivos subidos
│   │
│   ├── 📂 frontend/             # Cliente web HTML/CSS/JS
│   │   ├── 📂 html/             # Páginas por roles
│   │   │   ├── 📂 admin/        # Vista administrador
│   │   │   ├── 📂 teacher/      # Vista profesor
│   │   │   └── 📂 technician/   # Vista técnico
│   │   ├── 📂 css/              # Estilos personalizados
│   │   ├── 📂 js/               # Scripts JavaScript
│   │   └── 📂 public/           # Recursos estáticos
│   │
│   ├── 📂 database/             # Gestión de base de datos
│   │   ├── 📂 migrations/       # Scripts de migración
│   │   ├── 📂 procedures/       # Procedimientos almacenados
│   │   ├── 📂 seeds/            # Datos iniciales
│   │   └── 📂 backups/          # Respaldos automáticos
│   │
│   └── 📂 docs/                 # Documentación técnica
│
├── 📂 Documentación/            # Documentos del proyecto
│   ├── 📂 Doc's/               # Documentos generales
│   ├── 📂 Multimedia/          # Diagramas y mockups
│   ├── 📂 Pdf's/               # Documentos finales
│   └── 📂 Text/                # Notas y requerimientos
│
└── 📄 accesslab_schema_mysql_full.sql  # Esquema de BD completo
```

## 🛠️ Stack Tecnológico

### **Frontend**
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) **HTML5** - Estructura semántica
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3** - Estilos personalizados
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript ES6+** - Interactividad
- ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white) **Bootstrap 5.3** - Framework CSS
- ![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=flat&logo=fontawesome&logoColor=white) **Font Awesome 6.4** - Iconografía

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white) **Node.js** - Runtime de JavaScript
- ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) **Express.js** - Framework web
- ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) **MySQL** - Base de datos relacional

### **Herramientas de Desarrollo**
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) **Git** - Control de versiones
- ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white) **GitHub** - Repositorio remoto
- ![VS Code](https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=visualstudiocode&logoColor=white) **Visual Studio Code** - Editor de código

## 👥 Sistema de Roles y Permisos

### 🔐 **Administrador (Director/Subdirector)**
- ✅ Gestión completa de usuarios
- ✅ Configuración de laboratorios
- ✅ Reportes y estadísticas
- ✅ Gestión de avisos globales
- ✅ Configuración del sistema

### 🔧 **Técnico de Laboratorio**
- ✅ Gestión de solicitudes de acceso
- ✅ Mantenimiento de equipos
- ✅ Publicación de avisos técnicos
- ✅ Reportes de incidencias
- ❌ Configuración de sistema

### 👨‍🏫 **Profesor/Maestro**
- ✅ Registro de bitácoras de clase
- ✅ Solicitudes de uso de laboratorio
- ✅ Consulta de disponibilidad
- ✅ Reporte de observaciones
- ❌ Gestión de usuarios

## 📊 Configuración del Repositorio

### **Información General**
- **Repositorio**: `Crashed101k1/AccessLab`
- **Visibilidad**: Público ✅
- **Branch Principal**: `main`
- **Branch de Desarrollo**: `desarrollo`
- **Creado**: 22 de Octubre, 2025
- **Última Actualización**: 24 de Octubre, 2025

### **Configuración de Branches**
- **Protección de `main`**: ✅ Activada
- **Pull Request Reviews**: 1 revisión requerida
- **Merge Methods**: Todos permitidos (merge, rebase, squash)
- **Force Push**: ❌ Bloqueado
- **Branch Deletion**: ❌ Bloqueado

### **Colaboradores**
- **👑 Owner**: `Crashed101k1` (Admin completo)
- **👥 Invitado**: `JONYSKULL` (Pendiente de aceptación)

## 🚀 Instalación y Configuración

### **Prerrequisitos**
```bash
# Verificar versiones requeridas
node --version    # v16.0.0 o superior
npm --version     # v8.0.0 o superior
mysql --version   # v8.0.0 o superior
```

### **Configuración del Proyecto**
```bash
# 1. Clonar el repositorio
git clone https://github.com/Crashed101k1/AccessLab.git
cd AccessLab/AccessLab0.0.1

# 2. Configurar Backend
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run dev

# 3. Configurar Base de Datos
mysql -u root -p < ../database/accesslab_schema_mysql_full.sql
mysql -u root -p < ../database/seeds/initial_data.sql

# 4. Configurar Frontend
cd ../frontend
# Abrir html/login.html en navegador o servidor local
```

### **Variables de Entorno (.env)**
```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=accesslab
DB_USER=your_username
DB_PASS=your_password

# Servidor
PORT=3000
NODE_ENV=development

# Autenticación
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret
```

## 📈 Flujo de Desarrollo

### **Workflow de Git**
```bash
# 1. Trabajar en branch de desarrollo
git checkout desarrollo
git pull origin desarrollo

# 2. Crear feature branch
git checkout -b feature/nueva-funcionalidad

# 3. Realizar cambios y commit
git add .
git commit -m "feat: descripción de la funcionalidad"

# 4. Push y crear PR
git push origin feature/nueva-funcionalidad
gh pr create --title "Nueva funcionalidad" --body "Descripción detallada"

# 5. Merge después de revisión
# (Requiere 1 aprovación antes de merge a main)
```

### **Comandos Útiles**
```bash
# Backend
npm run dev          # Servidor en modo desarrollo
npm run start        # Servidor en producción
npm run test         # Ejecutar tests
npm run lint         # Validar código

# Base de datos
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Poblar datos iniciales
npm run db:backup    # Crear respaldo
```

## 🎨 Características de la Interfaz

### **Diseño Responsivo**
- ✅ Adaptable a dispositivos móviles
- ✅ Optimizado para tablets
- ✅ Interfaz desktop completa

### **Paleta de Colores**
- **Primary**: `#cfe4e9` (Header/Footer)
- **Background**: `#f9f6f3` (Fondo principal)
- **Text**: `#2c3e50` (Texto principal)
- **Accent**: `#ff4757` (Cerrar sesión)
- **Cards**: `#ffffff` (Fondo de tarjetas)

### **Tipografía**
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Tamaños**: Responsive desde 24px (móvil) hasta 32px (desktop)

## 📋 Roadmap de Desarrollo

### **Fase 1: Maquetado Frontend** ✅
- [x] Login page con validación
- [x] Dashboard de administrador
- [x] Estructura de roles
- [x] Sistema responsive

### **Fase 2: Backend Development** 🔄
- [ ] API REST completa
- [ ] Sistema de autenticación JWT
- [ ] Middleware de seguridad
- [ ] Conexión con MySQL

### **Fase 3: Integración** 📅
- [ ] Conectar frontend con backend
- [ ] Sistema de sesiones
- [ ] Validaciones del lado servidor
- [ ] Manejo de errores

### **Fase 4: Testing y Deploy** 📅
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Documentación API
- [ ] Despliegue en producción

## 👨‍💻 Equipo de Desarrollo

### **Desarrolladores Principales**
- **🎯 Gael Maximiliano Velázquez Barrera** - Full Stack Developer
- **🎯 Jonhatan Gabriel Francisco** - Full Stack Developer

### **Asesores Académicos**
- **📚 L.I.A. José Francisco Carrillo Mastache** - Asesor Externo
- **📚 P.T.C. Gustavo** - Asesor Académico

### **Institución**
- **🏛️ Universidad Tecnológica de Morelia (UTM)**
- **📧 Contacto**: [utm.mx](https://www.utm.mx/)

## 📞 Contacto y Soporte

### **Repositorio**
- **🔗 URL**: https://github.com/Crashed101k1/AccessLab
- **📋 Issues**: [Reportar problemas](https://github.com/Crashed101k1/AccessLab/issues)
- **🔀 Pull Requests**: [Contribuciones](https://github.com/Crashed101k1/AccessLab/pulls)

### **Documentación**
- **📖 Wiki**: [Documentación completa](https://github.com/Crashed101k1/AccessLab/wiki)
- **🎥 Demos**: Ver carpeta `Documentación/Multimedia/`
- **📄 Specs**: Ver carpeta `Documentación/Text/`

---

## 📄 Licencia

Este proyecto es desarrollado como **proyecto académico** para la Universidad Tecnológica de Morelia. Todos los derechos reservados.

**© 2025 AccessLab - Universidad Tecnológica de Morelia**

---

⭐ **¡Dale una estrella al proyecto si te resulta útil!** ⭐