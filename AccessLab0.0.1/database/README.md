# AccessLab Database

## Descripción
Esquemas, scripts y documentación de la base de datos MySQL para AccessLab.

## Estructura de Archivos

```
database/
├── accesslab_schema_mysql_full.sql  # Esquema completo de la BD
├── migrations/                      # Migraciones de esquema
├── seeds/                          # Datos de prueba
├── backups/                        # Respaldos automáticos
├── procedures/                     # Stored procedures
└── README.md                       # Este archivo
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