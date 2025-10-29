# Sistema de Pestañas para Gestión de Usuarios

## Implementación Completada

### 🏷️ **Estructura de Pestañas**

#### **Pestaña 1: Usuarios Activos**
- **Icono**: `fas fa-users` 
- **Funcionalidad**: Mostrar usuarios que pueden acceder al sistema
- **Columnas**: Usuario | Carrera | Rol | Contraseña | Acciones
- **Acciones disponibles**:
  - ✏️ **Editar**: Modificar información del usuario
  - 🚫 **Desactivar**: Mover usuario a pestaña inactivos

#### **Pestaña 2: Usuarios Inactivos**  
- **Icono**: `fas fa-user-slash`
- **Funcionalidad**: Mostrar usuarios deshabilitados del sistema
- **Columnas**: Usuario | Carrera | Rol | Fecha Desactivación | Acciones
- **Acciones disponibles**:
  - 👁️ **Ver Detalles**: Mostrar información completa
  - ↩️ **Reactivar**: Mover usuario a pestaña activos

### 🎨 **Características Visuales**

#### **Navegación de Pestañas:**
```
┌─────────────────┬──────────────────┐
│ 👥 Usuarios     │ 🚫 Usuarios      │
│    Activos  2   │    Inactivos  1  │
└─────────────────┴──────────────────┘
```

#### **Indicadores:**
- **Contador dinámico**: Badge con número de usuarios en cada pestaña
- **Estados visuales**: Pestaña activa destacada con color azul
- **Transiciones suaves**: Cambio animado entre pestañas

### ⚙️ **Funcionalidades Implementadas**

#### **1. Cambio de Pestañas**
```javascript
function switchTab(tabName) {
    // Cambio visual entre pestañas activos/inactivos
    // Actualización automática de contadores
}
```

#### **2. Gestión de Estados**
```javascript
function toggleUserStatus(userId, newStatus) {
    // Confirmación antes de cambiar estado
    // Movimiento automático entre pestañas
}
```

#### **3. Contadores Automáticos**
```javascript
function updateTabCounts() {
    // Cuenta usuarios activos e inactivos
    // Actualiza badges en tiempo real
}
```

### 📊 **Datos de Ejemplo Incluidos**

#### **Usuarios Activos:**
- `juan.perez` - TI - Maestro
- `maria.garcia` - IM - Maestro

#### **Usuarios Inactivos:**  
- `carlos.lopez` - GA - Técnico (Desactivado: 15/10/2025)

### 🔄 **Flujos de Usuario**

#### **Escenario 1: Desactivar Usuario**
1. Usuario está en pestaña "Usuarios Activos"
2. Click en botón 🚫 "Desactivar Usuario"
3. Confirmación: "¿Está seguro que desea desactivar este usuario?"
4. Usuario se mueve automáticamente a pestaña "Usuarios Inactivos"
5. Contadores se actualizan automáticamente

#### **Escenario 2: Reactivar Usuario**
1. Usuario cambia a pestaña "Usuarios Inactivos" 
2. Click en botón ↩️ "Reactivar Usuario"
3. Confirmación: "¿Está seguro que desea reactivar este usuario?"
4. Usuario se mueve automáticamente a pestaña "Usuarios Activos"
5. Contadores se actualizan automáticamente

#### **Escenario 3: Ver Detalles de Usuario Inactivo**
1. En pestaña "Usuarios Inactivos"
2. Click en botón 👁️ "Ver Detalles"  
3. Muestra información completa del usuario
4. Historial de desactivación disponible

### 🎯 **Elementos de Interfaz**

#### **Botones de Acción Diferenciados:**
- **Usuarios Activos**:
  - ✏️ Editar (Verde): `#28a745`
  - 🚫 Desactivar (Naranja): `#fd7e14`

- **Usuarios Inactivos**:
  - 👁️ Ver Detalles (Morado): `#6f42c1` 
  - ↩️ Reactivar (Verde-azul): `#20c997`

#### **Sistema de Notificaciones:**
- **Desactivación**: Notificación naranja con ⚠️
- **Reactivación**: Notificación verde con ✅
- **Auto-dismissal**: Desaparece automáticamente en 3 segundos
- **Animación**: Desliza desde la derecha

### 🔧 **Aspectos Técnicos**

#### **HTML Estructurado:**
```html
<div class="tabs-navigation">
  <button class="tab-btn active" id="activosTab">
    <i class="fas fa-users me-2"></i>Usuarios Activos
    <span class="tab-count" id="activosCount">0</span>
  </button>
</div>

<div class="tab-content active" id="activosContent">
  <table class="usuarios-table">
    <!-- Contenido de usuarios activos -->
  </table>
</div>
```

#### **CSS Responsivo:**
```css
.tab-btn {
  flex: 1;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: white;
  color: #0d6efd;
  border-bottom: 3px solid #0d6efd;
}
```

#### **JavaScript Modular:**
- Funciones separadas para cada acción
- Manejo de eventos con confirmaciones
- Actualización automática de UI
- Persistencia de estado visual

### 📈 **Beneficios de la Implementación**

#### **Para Administradores:**
- **Organización clara**: Separación visual entre usuarios activos e inactivos
- **Gestión eficiente**: Acciones contextuales según estado del usuario
- **Información rápida**: Contadores muestran estadísticas al instante
- **Flujo intuitivo**: Confirmaciones antes de acciones críticas

#### **Para el Sistema:**
- **Escalabilidad**: Soporta gran cantidad de usuarios en ambas pestañas
- **Mantenimiento**: Historial de desactivaciones con fechas
- **Seguridad**: Confirmaciones previenen acciones accidentales
- **Performance**: Solo se muestran usuarios relevantes por pestaña

### 🎨 **Resultado Visual**

La interfaz ahora presenta una experiencia organizada donde:
- Los usuarios activos tienen acciones de gestión inmediata
- Los usuarios inactivos tienen opciones de consulta y reactivación
- Los contadores proporcionan visibilidad inmediata del estado del sistema
- Las transiciones suaves mejoran la experiencia de usuario

Esta implementación transforma la gestión de usuarios de una tabla única a un sistema organizado por estados, facilitando la administración y el mantenimiento del sistema AccessLab.