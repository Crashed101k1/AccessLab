# Datos de Ejemplo - Sistema de Pestañas de Usuarios

## Usuarios de Ejemplo Implementados

### 👥 **Pestaña Usuarios Activos (7 usuarios)**

| Username | Carrera | Rol | Descripción |
|----------|---------|-----|-------------|
| `juan.perez` | TI | Maestro | Profesor de Tecnologías de la Información |
| `maria.garcia` | IM | Maestro | Profesora de Ingeniería en Mecatrónica |
| `admin.sistemas` | TI | Administrador | Administrador del sistema AccessLab |
| `ana.martinez` | II | Maestro | Profesora de Ingeniería Industrial |
| `tech.laboratorio` | TI | Técnico | Técnico especializado en laboratorios |
| `luis.hernandez` | TC | Maestro | Profesor de Tecnologías de la Construcción |
| `sofia.rodriguez` | GA | Maestro | Profesora de Gestión Administrativa |

### 🚫 **Pestaña Usuarios Inactivos (5 usuarios)**

| Username | Carrera | Rol | Fecha Desactivación | Motivo Ejemplar |
|----------|---------|-----|-------------------|-----------------|
| `carlos.lopez` | GA | Técnico | 15/10/2025 | Técnico temporal |
| `miguel.santos` | IM | Maestro | 22/09/2025 | Profesor con licencia |
| `laura.morales` | II | Maestro | 08/10/2025 | Cambio de área |
| `temp.practicas` | TC | Técnico | 30/08/2025 | Usuario temporal de prácticas |
| `diego.vargas` | TI | Maestro | 12/09/2025 | Profesor en sabático |

## Distribución por Roles

### 📊 **Usuarios Activos:**
- **Administradores**: 1 (admin.sistemas)
- **Maestros**: 5 (juan.perez, maria.garcia, ana.martinez, luis.hernandez, sofia.rodriguez)
- **Técnicos**: 1 (tech.laboratorio)

### 📊 **Usuarios Inactivos:**
- **Maestros**: 3 (miguel.santos, laura.morales, diego.vargas)
- **Técnicos**: 2 (carlos.lopez, temp.practicas)

## Distribución por Carreras

### 🎓 **Tecnologías de la Información (TI):**
- **Activos**: 3 usuarios (juan.perez, admin.sistemas, tech.laboratorio)
- **Inactivos**: 1 usuario (diego.vargas)

### 🎓 **Ingeniería en Mecatrónica (IM):**
- **Activos**: 1 usuario (maria.garcia)
- **Inactivos**: 1 usuario (miguel.santos)

### 🎓 **Ingeniería Industrial (II):**
- **Activos**: 1 usuario (ana.martinez)
- **Inactivos**: 1 usuario (laura.morales)

### 🎓 **Gestión Administrativa (GA):**
- **Activos**: 1 usuario (sofia.rodriguez)
- **Inactivos**: 1 usuario (carlos.lopez)

### 🎓 **Tecnologías de la Construcción (TC):**
- **Activos**: 1 usuario (luis.hernandez)
- **Inactivos**: 1 usuario (temp.practicas)

## Casos de Uso Representados

### 🏢 **Perfiles Administrativos:**
- **Administrador del sistema** (`admin.sistemas`)
- **Técnico de laboratorios** (`tech.laboratorio`)
- **Usuario temporal** (`temp.practicas`)

### 👨‍🏫 **Perfiles Académicos:**
- **Profesores activos** por cada carrera
- **Profesores con diferentes estados** (licencia, sabático, cambio)

### 📅 **Temporalidad de Desactivaciones:**
- **Recientes**: octubre 2025 (carlos.lopez, laura.morales)
- **Medianas**: septiembre 2025 (miguel.santos, diego.vargas)
- **Antiguas**: agosto 2025 (temp.practicas)

## Funcionalidades Demostrables

### ✅ **Con Usuarios Activos:**
1. **Edición de perfiles** - Todos tienen botón editar activo
2. **Desactivación controlada** - Botón desactivar con confirmación
3. **Diversidad de roles** - Administrador, Maestros, Técnico
4. **Cobertura de carreras** - Todas las carreras representadas

### ✅ **Con Usuarios Inactivos:**
1. **Consulta de detalles** - Botón ver información completa
2. **Reactivación selectiva** - Botón reactivar con confirmación
3. **Historial temporal** - Fechas de desactivación variadas
4. **Razones diversas** - Diferentes motivos de inactivación

### ✅ **Contadores Dinámicos:**
- **Badge activos**: Muestra "7" usuarios habilitados
- **Badge inactivos**: Muestra "5" usuarios deshabilitados
- **Actualización automática**: Se recalculan con cada cambio

## Casos de Prueba Disponibles

### 🧪 **Flujo de Desactivación:**
1. Seleccionar cualquier usuario activo (ej: sofia.rodriguez)
2. Click en botón desactivar → Confirmación
3. Usuario se mueve a pestaña inactivos automáticamente
4. Contadores se actualizan: Activos=6, Inactivos=6

### 🧪 **Flujo de Reactivación:**
1. Cambiar a pestaña inactivos
2. Seleccionar usuario (ej: miguel.santos)
3. Click en botón reactivar → Confirmación
4. Usuario se mueve a pestaña activos automáticamente
5. Contadores se actualizan: Activos=8, Inactivos=4

### 🧪 **Visualización de Detalles:**
1. En pestaña inactivos, click en "Ver detalles"
2. Sistema muestra información completa del usuario
3. Incluye fecha de desactivación y contexto

## Beneficios de los Datos de Ejemplo

### 📈 **Para Demostración:**
- **Diversidad completa**: Todos los roles y carreras representados
- **Escenarios reales**: Nombres de usuario profesionales
- **Estados variados**: Diferentes fechas y motivos de inactivación
- **Volumen adecuado**: Suficientes datos para probar funcionalidades

### 📈 **Para Desarrollo:**
- **Testing completo**: Casos de edge cubiertos
- **Interfaz poblada**: Se ve profesional y funcional
- **Patrones de uso**: Simula entorno universitario real
- **Escalabilidad**: Fácil añadir más usuarios de ejemplo

### 📈 **Para Usuarios Finales:**
- **Comprensión inmediata**: Ven cómo funciona el sistema
- **Contexto familiar**: Nombres y roles reconocibles
- **Flujos claros**: Pueden probar sin crear datos desde cero
- **Confianza en el sistema**: Ve datos organizados y profesionales

Este conjunto de datos de ejemplo proporciona una base sólida para demostrar todas las funcionalidades del sistema de pestañas de gestión de usuarios, cubriendo diversos escenarios y casos de uso típicos en un entorno universitario.