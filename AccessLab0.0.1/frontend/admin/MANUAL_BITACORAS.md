# 📋 Sistema de Bitácoras - Manual de Usuario

## 🎯 **Funcionalidades Principales**

### **👀 Visualización de Bitácoras**
El sistema permite a técnicos y directores/subdirectores **visualizar** las bitácoras de los profesores en **modo solo lectura**, cumpliendo con los siguientes requisitos:

#### **📊 Vista Principal (Lista de Bitácoras)**
- **Tabla filtrable** con todas las bitácoras del sistema
- **Estados visuales**: Abierta, Cerrada, Validada
- **Botones de acción** por bitácora:
  - **👁️ Ver**: Abre la vista detallada de la bitácora
  - **📥 Descargar**: Genera y descarga PDF de la bitácora

#### **📝 Vista Detallada de Bitácora**
Basada en el mockup proporcionado, incluye:

**📋 Información General:**
- Nombre del profesor y datos de contacto
- Laboratorio asignado y materia
- Grupo, carrera y cuatrimestre
- Fechas de inicio y terminación
- Número de parcial seleccionado

**📊 Tabla de Registros:**
- Número de sesión consecutivo
- Nombre de la práctica o actividad realizada
- Fecha de la actividad
- Horarios de entrada y salida
- **Horas de sesión** (calculadas automáticamente)
- **Estado del equipo** (Aceptable, En mal estado, Anormal)

**💬 Sistema de Observaciones:**
- **Observaciones del profesor** (solo lectura)
- **Formulario de observaciones** para técnicos/directores
- **Historial de observaciones** con autor, fecha y comentarios

---

## 👥 **Permisos por Rol**

### **🧑‍🏫 Maestro/Profesor:**
- ❌ **No puede acceder** a la vista detallada de otras bitácoras
- ✅ **Puede llenar sus propias bitácoras** con todos los campos
- ✅ **Selecciona estado del equipo** (Aceptable, En mal estado, Anormal)
- ✅ **Registra horas de sesión** y actividades realizadas

### **🔧 Técnico:**
- ✅ **Ver bitácoras** de todos los profesores (solo lectura)
- ✅ **Agregar observaciones** técnicas
- ✅ **Descargar PDF** de cualquier bitácora
- ❌ **No puede modificar** registros de prácticas

### **👨‍💼 Director/Subdirector:**
- ✅ **Ver bitácoras** de todos los profesores (solo lectura)
- ✅ **Agregar observaciones** administrativas
- ✅ **Descargar PDF** de cualquier bitácora
- ❌ **No puede modificar** registros de prácticas

---

## 🛠️ **Cómo Usar el Sistema**

### **1. Acceder a Bitácoras**
```
Home Admin → Bitácoras → Lista de bitácoras
```

### **2. Visualizar una Bitácora**
1. **Localizar** la bitácora en la tabla principal
2. **Hacer clic** en el botón **"👁️ Ver"**
3. Se abrirá la **vista detallada** con toda la información

### **3. Agregar Observaciones** (Solo Técnicos/Directores)
1. En la vista detallada, ir a **"Observaciones de Revisión"**
2. **Escribir** la observación en el textarea
3. **Hacer clic** en **"💾 Guardar"** para confirmar
4. La observación se agregará al **historial** con fecha y autor

### **4. Descargar Bitácora en PDF**
- **Desde la lista**: Botón **"📥 Descargar"** 
- **Desde el detalle**: Botón **"📄 Generar"** en la sección de parciales

### **5. Cambiar Rol** (Solo para Demo)
- Usar el **botón demo** en la esquina inferior izquierda
- Seleccionar rol para probar diferentes permisos

---

## 📱 **Estados de la Bitácora**

### **🟢 Bitácora Abierta**
- **Indicador verde**: "🔓 Bitácora Abierta"
- Los registros pueden mostrar actividades **"En proceso"**
- El profesor aún puede agregar nuevas sesiones

### **🔒 Bitácora Cerrada**
- **Indicador azul**: "🔒 Bitácora Cerrada"
- Todos los registros están **completados**
- No se pueden agregar más actividades
- **Fecha de terminación** definida

---

## 📊 **Estados del Equipo**

### **✅ Aceptable**
- **Badge verde**: Equipos funcionando correctamente
- Sin problemas detectados durante la sesión
- Condiciones normales de operación

### **❌ En mal estado**
- **Badge rojo**: Equipos con fallas evidentes
- Requieren reparación o reemplazo
- Impactan negativamente en las prácticas

### **🟡 Anormal**
- **Badge amarillo**: Comportamiento irregular de equipos
- Funcionan pero con anomalías
- Requieren revisión técnica preventiva

### **⏱️ Cálculo de Horas de Sesión**
- **Automático**: Se calcula la diferencia entre hora de entrada y salida
- **Formato decimal**: Ejemplo: 2.5 horas para 2 horas 30 minutos
- **Editable por maestros**: Durante el llenado de bitácoras

---

## 🔧 **Funciones Técnicas**

### **📥 Generación de PDF**
```javascript
// El sistema genera PDFs con:
- Información completa de la bitácora
- Tabla de registros formateada
- Observaciones del profesor
- Historial de observaciones técnicas/administrativas
- Formato oficial de la institución
```

### **💾 Sistema de Observaciones**
```javascript
// Cada observación incluye:
- Autor (nombre y rol)
- Fecha y hora exacta
- Texto de la observación
- Clasificación por tipo de usuario
```

### **🔍 Filtrado de Bitácoras**
```javascript
// Filtros disponibles:
- Por profesor/usuario
- Por laboratorio
- Por materia
- Por grupo
- Por carrera
- Por parcial
- Por cuatrimestre
- Por estado
```

---

## 🎨 **Características de la Interfaz**

### **📋 Vista Detallada (Según Mockup)**
- **Layout de 2 columnas** para observaciones
- **Tabla responsiva** para registros de actividades
- **Formulario integrado** para nuevas observaciones
- **Badges de estado** claramente diferenciados
- **Botones de acción** con iconos intuitivos

### **🎨 Estilos y Animaciones**
- **Transiciones suaves** en hover
- **Colores diferenciados** por estado y rol
- **Iconos de Font Awesome** para mejor UX
- **Diseño responsivo** para móviles y tablets

### **🔔 Notificaciones del Sistema**
- **Confirmación** al guardar observaciones
- **Progreso** durante generación de PDF
- **Errores** si falta información requerida
- **Información** sobre cambios de estado

---

## 📊 **Datos de Ejemplo Incluidos**

### **🧑‍🏫 Bitácora de "Hermelindo Buenrostro"**
- **Materia**: Desarrollo de Software I
- **Grupo**: 3C
- **Laboratorio**: Redes P2
- **Estado**: Abierta
- **Registros**: 4 sesiones (2 completadas, 2 en proceso)

### **💬 Observaciones Preexistentes**
- **Director**: Observación de progreso general
- **Técnico**: Reporte de mantenimiento de equipos

---

## 🔄 **Flujo de Trabajo Típico**

```
1. 👨‍💼 Director accede a lista de bitácoras
2. 🔍 Filtra por laboratorio o profesor específico
3. 👁️ Hace clic en "Ver" para abrir detalle
4. 📖 Revisa registros de actividades del profesor
5. 📝 Lee observaciones existentes del profesor
6. 💬 Agrega observación administrativa si es necesario
7. 📥 Descarga PDF si requiere documentación física
8. ✅ Cierra la vista detallada
```

---

## 🛡️ **Seguridad y Validaciones**

### **🔒 Control de Acceso**
- **Verificación de rol** antes de mostrar formularios
- **Solo lectura** para campos del profesor
- **Validación** de permisos por funcionalidad

### **✅ Validaciones de Entrada**
- **Observación obligatoria** antes de guardar
- **Formato de fecha** validado
- **Longitud máxima** de comentarios
- **Caracteres especiales** filtrados

---

## 🚀 **Próximas Mejoras**

1. **📧 Notificaciones por email** cuando se agreguen observaciones
2. **📊 Reportes estadísticos** de uso de laboratorios
3. **🔄 Sincronización** con sistema de calificaciones
4. **📱 Aplicación móvil** para técnicos en campo
5. **🤖 Validación automática** de horarios y equipos

---

**¡El sistema de bitácoras está completamente implementado y listo para uso en producción! 🎉**