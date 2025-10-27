# 🗄️ Base de Datos AccessLab

Esta carpeta contiene todos los archivos relacionados con la base de datos del sistema AccessLab.

## 📁 **Estructura de Archivos**

### **📋 Esquemas de Base de Datos:**
- `accesslab_schema_mysql_full.sql` - ⚠️ **Esquema original** (versión 1.0)
- `accesslab_schema_mysql_v2.sql` - ✅ **Esquema actualizado** (versión 2.0)

### **🔄 Migraciones:**
- `2025-10-27_actualizar_sistema_solicitudes.sql` - **Script de migración** de v1.0 a v2.0

### **✅ Validación y Pruebas:**
- `validacion_sistema_solicitudes.sql` - **Pruebas completas** del nuevo sistema

### **📚 Documentación:**
- `ANALISIS_MIGRACION_BD.md` - **Análisis detallado** de cambios realizados
- `README.md` - Este archivo de documentación

### **🗂️ Otras Carpetas:**
- `seeds/` - Datos iniciales del sistema
- `backups/` - Respaldos de la base de datos
- `procedures/` - Procedimientos almacenados adicionales
- `migrations/` - Historial de migraciones

---

## 🚀 **Instalación Rápida**

### **Para Base de Datos Nueva (Recomendado):**
```bash
mysql -u root -p -e "CREATE DATABASE accesslab;"
mysql -u root -p accesslab < accesslab_schema_mysql_v2.sql
```

### **Para Migrar Base Existente:**
```bash
# 1. Hacer backup primero
mysqldump -u root -p accesslab > backup_antes_migracion.sql

# 2. Ejecutar migración
mysql -u root -p accesslab < 2025-10-27_actualizar_sistema_solicitudes.sql

# 3. Validar migración
mysql -u root -p accesslab < validacion_sistema_solicitudes.sql
```

---

## 🔄 **Sistema de Solicitudes v2.0**

### **📊 Principales Mejoras:**

#### **1. Solo 2 Tipos de Solicitudes:**
- 🏢 **Reserva** - Para reservar laboratorios
- 🔧 **Soporte** - Para problemas técnicos

#### **2. Campos Específicos por Tipo:**

**📋 Reserva de Laboratorio:**
- ✅ Fecha y horario de reserva
- ✅ Número de participantes
- ✅ Materia y profesor responsable
- ✅ Enrutamiento a Director/Subdirector

**🛠️ Soporte Técnico:**
- ✅ Tipo de problema y prioridad
- ✅ Equipos afectados
- ✅ Asignación automática de técnico
- ✅ Enrutamiento directo al técnico del laboratorio

#### **3. Asignación Automática de Técnicos:**
```sql
"Laboratorio de Redes"      → Téc. López Martín
"Laboratorio de Sistemas"   → Téc. García Ruiz  
"Laboratorio de Electrónica" → Téc. Morales Silva
"Laboratorio Industrial"    → Téc. Hernández Cruz
"Laboratorio de Física"     → Téc. Rivera Santos
```

---

## 📋 **Uso del Procedimiento Almacenado**

### **Crear Solicitud de Reserva:**
```sql
CALL sp_crear_solicitud(
    7,                                    -- id_usuario
    'Reserva Lab Redes - Práctica CISCO', -- nombre
    '555-0001',                           -- telefono
    'Ingeniería en Sistemas',             -- carrera
    '8vo',                                -- semestre
    'Reserva',                            -- tipo
    'Director/Subdirector',               -- destino_rol
    1,                                    -- laboratorio_id
    'Práctica de configuración routers',  -- descripcion
    '2025-02-15',                         -- fecha_reserva
    '09:00:00',                           -- hora_inicio
    '11:00:00',                           -- hora_fin
    25,                                   -- participantes
    'Redes de Computadoras II',           -- materia
    'Dr. García Hernández',               -- profesor_responsable
    NULL, NULL, NULL,                     -- campos de soporte
    'Se requieren equipos funcionando'     -- observaciones
);
```

### **Crear Solicitud de Soporte:**
```sql
CALL sp_crear_solicitud(
    8,                                    -- id_usuario
    'Problema Switches - Lab Sistemas',   -- nombre
    '555-0002',                           -- telefono
    'Ingeniería en Computación',          -- carrera
    NULL,                                 -- semestre
    'Soporte',                            -- tipo
    'Técnico',                            -- destino_rol
    2,                                    -- laboratorio_id
    'Switches no responden',              -- descripcion
    NULL, NULL, NULL, NULL, NULL, NULL,   -- campos de reserva
    'Conectividad de Red',                -- tipo_problema
    'Switch Cisco Catalyst 2960 (x3)',   -- equipo_afectado
    'Alta',                               -- prioridad
    'Problema desde esta mañana'          -- observaciones
);
```

---

## 🔍 **Vista Completa de Solicitudes**

### **Consultar todas las solicitudes:**
```sql
SELECT 
    id_solicitud,
    nombre_solicitud,
    solicitante,
    tipo,
    estado,
    laboratorio_nombre,
    tecnico_asignado,
    destino_rol,
    fecha_creacion
FROM vista_solicitudes_completas
ORDER BY fecha_creacion DESC;
```

### **Filtrar por laboratorio:**
```sql
SELECT * FROM vista_solicitudes_completas 
WHERE laboratorio_nombre = 'Laboratorio de Redes';
```

### **Filtrar por tipo:**
```sql
SELECT * FROM vista_solicitudes_completas 
WHERE tipo = 'Soporte' AND estado = 'pendiente';
```

## Arquitectura de la Base de Datos

### Tablas Principales

#### Gestión de Usuarios
- **usuarios**: Información base de usuarios del sistema
  - Roles: DIRECTOR, SUBDIRECTOR, TECNICO, MAESTRO
  - Autenticación con hash de contraseña
  - Control de actividad y último acceso

#### Gestión de Laboratorios
- **laboratorios**: Registro de laboratorios disponibles
- **asignacion_laboratorio**: Asignación de profesores a laboratorios
- **asignacion_horario**: Horarios de uso por materia
- **periodo_academico**: Períodos académicos activos

#### Sistema de Bitácoras
- **bitacora**: Registro principal de uso de laboratorios
- **bitacora_detalle**: Detalles de cada sesión/práctica
- **observacion_bitacora**: Observaciones por usuario

#### Gestión de Solicitudes
- **solicitud**: Solicitudes de apoyo y reservas
- **reserva_laboratorio**: Reservas específicas de laboratorios

#### Sistema de Comunicación
- **aviso**: Avisos del sistema
- **comentario**: Comentarios en avisos
- **notificacion**: Notificaciones a usuarios

#### Sistema de Respaldos
- **respaldo_horario**: Configuración de respaldos automáticos
- **respaldo_log**: Log de respaldos ejecutados
- **inventario_cambio**: Historial de cambios en inventario

#### Seguridad
- **usuario_recuperacion**: Tokens para recuperación de contraseña

## Instalación

### Requisitos
- MySQL 8.0+ o MariaDB 10.5+
- phpMyAdmin (recomendado para desarrollo)

### Pasos de Instalación

1. **Crear base de datos**:
```sql
CREATE DATABASE accesslab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Ejecutar esquema completo**:
```bash
mysql -u root -p accesslab < accesslab_schema_mysql_full.sql
```

O desde phpMyAdmin:
- Importar el archivo `accesslab_schema_mysql_full.sql`

### Configuración Recomendada

#### Variables MySQL
```sql
SET sql_mode = 'STRICT_ALL_TABLES';
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 1;
```

#### Usuario de la Aplicación
```sql
-- Crear usuario específico para la aplicación
CREATE USER 'accesslab_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON accesslab.* TO 'accesslab_user'@'localhost';
FLUSH PRIVILEGES;
```

## Diagrama de Relaciones

Las principales relaciones son:

```
usuarios (1) ---> (N) laboratorios (técnico encargado)
usuarios (1) ---> (N) bitacora (creador)
usuarios (1) ---> (N) solicitud (solicitante)
laboratorios (1) ---> (N) bitacora (laboratorio usado)
bitacora (1) ---> (N) bitacora_detalle (sesiones)
```

## Consultas Importantes

### Bitácoras por Usuario
```sql
SELECT b.*, l.nombre as laboratorio, u.nombre_completo 
FROM bitacora b
JOIN laboratorios l ON b.id_laboratorio = l.id_laboratorio
JOIN usuarios u ON b.id_usuario = u.id_usuario
WHERE b.id_usuario = ?;
```

### Solicitudes Pendientes por Rol
```sql
SELECT * FROM solicitud 
WHERE destino_rol = ? 
  AND estado = 'PENDIENTE' 
ORDER BY fecha_creacion DESC;
```

### Uso de Laboratorio por Período
```sql
SELECT l.nombre, COUNT(b.id_bitacora) as total_usos
FROM laboratorios l
LEFT JOIN bitacora b ON l.id_laboratorio = b.id_laboratorio
WHERE b.periodo_id = ?
GROUP BY l.id_laboratorio, l.nombre;
```

## Sistema de Respaldos

El sistema incluye respaldos automáticos configurables:

### Configurar Horario de Respaldo
```sql
INSERT INTO respaldo_horario (hora, activo) VALUES ('02:00:00', 1);
```

### Consultar Log de Respaldos
```sql
SELECT * FROM respaldo_log 
ORDER BY fecha_ejecucion DESC 
LIMIT 10;
```

## Índices de Performance

Los siguientes índices están configurados para optimizar consultas:

```sql
-- Solicitudes por destino y estado
CREATE INDEX ix_solicitud_destino ON solicitud (destino_rol, laboratorio_id, destino_usuario_id);

-- Asignaciones de laboratorio
CREATE INDEX ix_asig_lab ON asignacion_laboratorio (laboratorio_id, usuario_id, periodo_id);

-- Reservas por fecha
CREATE INDEX ix_reserva_lab_fecha ON reserva_laboratorio (laboratorio_id, fecha, hora_inicio);

-- Notificaciones por usuario
CREATE INDEX ix_notif_usr_fecha ON notificacion (usuario_id, leida, fecha_creacion);
```

## Mantenimiento

### Limpieza de Datos Antiguos
```sql
-- Limpiar tokens de recuperación expirados
DELETE FROM usuario_recuperacion WHERE expira_en < NOW();

-- Limpiar notificaciones antiguas leídas (6 meses)
DELETE FROM notificacion 
WHERE leida = 1 
  AND fecha_creacion < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### Análisis de Uso
```sql
-- Usuarios más activos
SELECT u.nombre_completo, COUNT(b.id_bitacora) as bitacoras_creadas
FROM usuarios u
LEFT JOIN bitacora b ON u.id_usuario = b.id_usuario
WHERE b.fecha_inicio >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
GROUP BY u.id_usuario, u.nombre_completo
ORDER BY bitacoras_creadas DESC;
```

## Consideraciones de Seguridad

1. **Contraseñas**: Siempre usar hash (implementado en aplicación)
2. **Conexiones**: Usar conexiones cifradas SSL en producción
3. **Usuarios**: Principio de menor privilegio para usuarios de BD
4. **Respaldos**: Cifrar respaldos y almacenar fuera del servidor
5. **Logs**: Auditar accesos y cambios críticos

## Notas de Desarrollo

- Charset: UTF-8 para soporte completo de caracteres
- Engine: InnoDB para transacciones ACID
- Claves foráneas: Configuradas con restricciones apropiadas
- Campos fecha: Uso de DATETIME para timestamps precisos