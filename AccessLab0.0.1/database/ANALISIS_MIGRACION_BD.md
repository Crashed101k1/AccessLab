# 📊 Análisis y Migración de Base de Datos - Sistema de Solicitudes

## 🎯 **Objetivo**
Adaptar la estructura de base de datos para soportar el nuevo sistema de solicitudes con solo 2 tipos: **Reserva** y **Soporte**, incluyendo asignación automática de técnicos y campos específicos para cada tipo.

---

## 📋 **Comparación: Esquema Anterior vs Nuevo**

### **🔴 Esquema Anterior:**
```sql
CREATE TABLE solicitud (
  id_solicitud           INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario             INT NOT NULL,
  descripcion            VARCHAR(500) NOT NULL,
  tipo                   ENUM('APOYO','RESERVA') NOT NULL,
  estado                 ENUM('PENDIENTE','EN_PROCESO','COMPLETADO','RECHAZADO') NOT NULL,
  destino_rol            ENUM('DIRECTOR','SUBDIRECTOR','TECNICO') NOT NULL,
  -- Campos básicos limitados...
);
```

### **🟢 Esquema Nuevo:**
```sql
CREATE TABLE solicitud (
  -- Campos base expandidos
  id_solicitud           INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario             INT NOT NULL,
  nombre                 VARCHAR(200) NOT NULL,
  telefono               VARCHAR(20) NULL,
  carrera                VARCHAR(80) NULL,
  semestre               VARCHAR(10) NULL,
  descripcion            TEXT NOT NULL,
  
  -- Tipos y estados actualizados
  tipo                   ENUM('Reserva','Soporte') NOT NULL,
  estado                 ENUM('pendiente','en-proceso','aprobado','rechazado') NOT NULL,
  destino_rol            ENUM('Director/Subdirector','Técnico') NOT NULL,
  
  -- Campos específicos para RESERVA
  fecha_reserva          DATE NULL,
  hora_inicio            TIME NULL,
  hora_fin               TIME NULL,
  participantes          INT NULL,
  materia                VARCHAR(100) NULL,
  profesor_responsable   VARCHAR(120) NULL,
  
  -- Campos específicos para SOPORTE
  tipo_problema          VARCHAR(100) NULL,
  equipo_afectado        VARCHAR(200) NULL,
  prioridad              ENUM('Baja','Media','Alta','Crítica') NULL,
  
  -- Campo común adicional
  observaciones          TEXT NULL,
  
  -- Validaciones mejoradas...
);
```

---

## 🔄 **Principales Cambios Implementados**

### **1. Campos Nuevos Agregados:**
| Campo | Tipo | Propósito |
|-------|------|-----------|
| `nombre` | VARCHAR(200) | Nombre descriptivo de la solicitud |
| `telefono` | VARCHAR(20) | Contacto opcional del solicitante |
| `carrera` | VARCHAR(80) | Carrera del estudiante solicitante |
| `semestre` | VARCHAR(10) | Semestre actual del estudiante |
| `participantes` | INT | Número de participantes (solo Reserva) |
| `materia` | VARCHAR(100) | Materia relacionada (solo Reserva) |
| `profesor_responsable` | VARCHAR(120) | Profesor a cargo (solo Reserva) |
| `tipo_problema` | VARCHAR(100) | Categoría del problema (solo Soporte) |
| `equipo_afectado` | VARCHAR(200) | Equipos con problemas (solo Soporte) |
| `prioridad` | ENUM | Urgencia del soporte (solo Soporte) |
| `observaciones` | TEXT | Comentarios adicionales |

### **2. Enumeraciones Actualizadas:**

#### **Tipos de Solicitud:**
- ❌ **ANTES:** `'APOYO','RESERVA'`
- ✅ **AHORA:** `'Reserva','Soporte'`

#### **Estados:**
- ❌ **ANTES:** `'PENDIENTE','EN_PROCESO','COMPLETADO','RECHAZADO'`
- ✅ **AHORA:** `'pendiente','en-proceso','aprobado','rechazado'`

#### **Destinatarios:**
- ❌ **ANTES:** `'DIRECTOR','SUBDIRECTOR','TECNICO'`
- ✅ **AHORA:** `'Director/Subdirector','Técnico'`

### **3. Validaciones de Integridad:**
```sql
-- Validación de horarios
CONSTRAINT ck_sol_horas CHECK (
  (hora_inicio IS NULL AND hora_fin IS NULL) OR 
  (hora_inicio IS NOT NULL AND hora_fin IS NOT NULL AND hora_inicio < hora_fin)
),

-- Validación de campos específicos por tipo
CONSTRAINT ck_sol_reserva CHECK (
  (tipo = 'Reserva' AND fecha_reserva IS NOT NULL) OR (tipo = 'Soporte')
),
CONSTRAINT ck_sol_soporte CHECK (
  (tipo = 'Soporte' AND tipo_problema IS NOT NULL AND prioridad IS NOT NULL) OR 
  (tipo = 'Reserva')
)
```

---

## 🏗️ **Archivos Generados**

### **1. Script de Migración:** `2025-10-27_actualizar_sistema_solicitudes.sql`
- ✅ Respaldo automático de datos existentes
- ✅ Modificación incremental de la tabla
- ✅ Migración de datos existentes 
- ✅ Inserción de datos de prueba
- ✅ Creación de procedimientos almacenados
- ✅ Índices optimizados

### **2. Esquema Completo Nuevo:** `accesslab_schema_mysql_v2.sql`
- ✅ Base de datos completa desde cero
- ✅ Todas las tablas actualizadas
- ✅ Vista `vista_solicitudes_completas`
- ✅ Usuarios y laboratorios de prueba
- ✅ Documentación integrada

---

## 🎯 **Mapeo de Funcionalidades**

### **🏢 Solicitudes de RESERVA:**
```sql
-- Campos requeridos:
- nombre, tipo='Reserva', destino_rol='Director/Subdirector'
- laboratorio_id, fecha_reserva, hora_inicio, hora_fin
- participantes, descripcion

-- Campos opcionales:
- materia, profesor_responsable, telefono, observaciones
```

### **🔧 Solicitudes de SOPORTE:**
```sql
-- Campos requeridos:
- nombre, tipo='Soporte', laboratorio_id
- tipo_problema, prioridad, descripcion

-- Asignación automática:
- Si destino_rol='Técnico' → asignado_a_usuario_id = técnico del laboratorio

-- Campos opcionales:
- equipo_afectado, telefono, observaciones
```

---

## 🤖 **Funcionalidades Automáticas**

### **1. Asignación de Técnicos:**
```sql
-- Mapeo automático laboratorio → técnico
"Laboratorio de Redes" → Téc. López Martín (ID: 2)
"Laboratorio de Sistemas" → Téc. García Ruiz (ID: 3)  
"Laboratorio de Electrónica" → Téc. Morales Silva (ID: 4)
"Laboratorio Industrial" → Téc. Hernández Cruz (ID: 5)
"Laboratorio de Física" → Téc. Rivera Santos (ID: 6)
```

### **2. Procedimiento Almacenado:**
```sql
CALL sp_crear_solicitud(
  usuario_id, nombre, telefono, carrera, semestre, tipo, destino_rol,
  laboratorio_id, descripcion, fecha_reserva, hora_inicio, hora_fin,
  participantes, materia, profesor_responsable, tipo_problema, 
  equipo_afectado, prioridad, observaciones
);
```

### **3. Vista Completa:**
```sql
SELECT * FROM vista_solicitudes_completas 
WHERE laboratorio_nombre = 'Laboratorio de Redes';
-- Incluye datos del solicitante, laboratorio, técnico asignado, etc.
```

---

## 📈 **Mejoras de Rendimiento**

### **Índices Optimizados:**
```sql
CREATE INDEX ix_solicitud_tipo_estado ON solicitud (tipo, estado);
CREATE INDEX ix_solicitud_laboratorio ON solicitud (laboratorio_id, destino_rol);
CREATE INDEX ix_solicitud_fecha ON solicitud (fecha_creacion DESC);
```

### **Consultas Optimizadas:**
- ✅ Búsqueda por tipo y estado
- ✅ Filtrado por laboratorio y destinatario
- ✅ Ordenamiento por fecha de creación
- ✅ Join optimizado con técnicos asignados

---

## 🔧 **Instrucciones de Aplicación**

### **Para Base de Datos Nueva:**
```bash
mysql -u root -p < accesslab_schema_mysql_v2.sql
```

### **Para Migrar Base Existente:**
```bash
mysql -u root -p accesslab < 2025-10-27_actualizar_sistema_solicitudes.sql
```

### **Verificación Post-Migración:**
```sql
-- Verificar estructura
DESCRIBE solicitud;

-- Verificar datos de prueba
SELECT COUNT(*) FROM solicitud WHERE tipo IN ('Reserva', 'Soporte');

-- Verificar vista
SELECT * FROM vista_solicitudes_completas LIMIT 5;

-- Verificar técnicos asignados
SELECT l.nombre, u.nombre_completo 
FROM laboratorios l 
JOIN usuarios u ON l.id_tecnico = u.id_usuario;
```

---

## ✅ **Validación de Integridad**

### **Checklist Post-Migración:**
- [ ] Tabla `solicitud` tiene todos los campos nuevos
- [ ] ENUMs actualizados correctamente
- [ ] Datos existentes migrados sin pérdida
- [ ] Técnicos asignados a laboratorios
- [ ] Vista `vista_solicitudes_completas` funcional
- [ ] Procedimiento `sp_crear_solicitud` operativo
- [ ] Índices creados correctamente
- [ ] Validaciones CHECK funcionando

---

## 🎊 **Resultado Final**

La base de datos ahora soporta completamente:

✅ **2 tipos de solicitudes** bien definidos  
✅ **Campos específicos** para cada tipo  
✅ **Asignación automática** de técnicos  
✅ **Estados sincronizados** con el frontend  
✅ **Validaciones de integridad** robustas  
✅ **Rendimiento optimizado** con índices  
✅ **Consultas simplificadas** con vistas  
✅ **Datos de prueba** listos para usar

¡La base de datos está perfectamente alineada con el nuevo sistema de solicitudes! 🚀