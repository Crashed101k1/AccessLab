-- ========================================
-- ACTUALIZACIÓN SISTEMA DE SOLICITUDES
-- AccessLab - Migración a nueva estructura
-- Fecha: 2025-10-27
-- ========================================

USE accesslab;

-- Crear tabla temporal de respaldo antes de modificar
CREATE TABLE solicitud_backup AS SELECT * FROM solicitud;

-- ========================================
-- MODIFICACIÓN TABLA SOLICITUDES
-- ========================================

-- 1. Agregar nuevas columnas
ALTER TABLE solicitud 
ADD COLUMN nombre VARCHAR(200) NULL AFTER id_usuario,
ADD COLUMN telefono VARCHAR(20) NULL AFTER nombre,
ADD COLUMN carrera VARCHAR(80) NULL AFTER telefono,
ADD COLUMN semestre VARCHAR(10) NULL AFTER carrera,
ADD COLUMN participantes INT NULL AFTER hora_fin,
ADD COLUMN materia VARCHAR(100) NULL AFTER participantes,
ADD COLUMN profesor_responsable VARCHAR(120) NULL AFTER materia,
ADD COLUMN tipo_problema VARCHAR(100) NULL AFTER profesor_responsable,
ADD COLUMN equipo_afectado VARCHAR(200) NULL AFTER tipo_problema,
ADD COLUMN prioridad ENUM('Baja','Media','Alta','Crítica') NULL AFTER equipo_afectado,
ADD COLUMN observaciones TEXT NULL AFTER prioridad;

-- 2. Modificar ENUM de tipo para alinear con el nuevo sistema
ALTER TABLE solicitud 
MODIFY COLUMN tipo ENUM('Reserva','Soporte') NOT NULL;

-- 3. Actualizar ENUM de estado para coincidir con el frontend
ALTER TABLE solicitud 
MODIFY COLUMN estado ENUM('pendiente','en-proceso','aprobado','rechazado') NOT NULL;

-- 4. Modificar destino_rol para que coincida con los nuevos roles
ALTER TABLE solicitud 
MODIFY COLUMN destino_rol ENUM('Director/Subdirector','Técnico') NOT NULL;

-- 5. Renombrar columna fecha por fecha_reserva para mayor claridad
ALTER TABLE solicitud 
CHANGE COLUMN fecha fecha_reserva DATE NULL;

-- ========================================
-- MIGRAR DATOS EXISTENTES (si los hay)
-- ========================================

-- Actualizar tipos existentes
UPDATE solicitud SET tipo = 'Soporte' WHERE tipo = 'APOYO';
UPDATE solicitud SET tipo = 'Reserva' WHERE tipo = 'RESERVA';

-- Actualizar estados existentes
UPDATE solicitud SET estado = 'pendiente' WHERE estado = 'PENDIENTE';
UPDATE solicitud SET estado = 'en-proceso' WHERE estado = 'EN_PROCESO';
UPDATE solicitud SET estado = 'aprobado' WHERE estado = 'COMPLETADO';
UPDATE solicitud SET estado = 'rechazado' WHERE estado = 'RECHAZADO';

-- Actualizar destino_rol existentes
UPDATE solicitud SET destino_rol = 'Director/Subdirector' WHERE destino_rol IN ('DIRECTOR', 'SUBDIRECTOR');
UPDATE solicitud SET destino_rol = 'Técnico' WHERE destino_rol = 'TECNICO';

-- ========================================
-- CREAR VISTA PARA SOLICITUDES COMPLETAS
-- ========================================

CREATE OR REPLACE VIEW vista_solicitudes_completas AS
SELECT 
    s.id_solicitud,
    s.nombre,
    s.tipo,
    s.estado,
    s.destino_rol,
    
    -- Datos del solicitante
    u.nombre_completo as solicitante,
    u.email as solicitante_email,
    s.telefono,
    s.carrera,
    s.semestre,
    
    -- Datos del laboratorio
    l.nombre as laboratorio_nombre,
    l.ubicacion as laboratorio_ubicacion,
    
    -- Técnico asignado (si aplica)
    t.nombre_completo as tecnico_asignado,
    t.email as tecnico_email,
    
    -- Usuario de destino (si aplica)
    d.nombre_completo as destino_usuario,
    d.email as destino_email,
    
    -- Datos específicos de reserva
    s.fecha_reserva,
    s.hora_inicio,
    s.hora_fin,
    s.participantes,
    s.materia,
    s.profesor_responsable,
    
    -- Datos específicos de soporte
    s.tipo_problema,
    s.equipo_afectado,
    s.prioridad,
    
    -- Campos comunes
    s.descripcion,
    s.observaciones,
    s.fecha_creacion
    
FROM solicitud s
LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
LEFT JOIN laboratorios l ON s.laboratorio_id = l.id_laboratorio
LEFT JOIN usuarios t ON l.id_tecnico = t.id_usuario
LEFT JOIN usuarios d ON s.destino_usuario_id = d.id_usuario;

-- ========================================
-- INSERTAR DATOS DE PRUEBA
-- ========================================

-- Limpiar datos existentes para evitar conflictos
DELETE FROM solicitud;

-- Insertar solicitudes de prueba que coincidan con el frontend
INSERT INTO solicitud (
    id_usuario, nombre, telefono, carrera, semestre, tipo, destino_rol, laboratorio_id,
    descripcion, fecha_reserva, hora_inicio, hora_fin, participantes, materia, 
    profesor_responsable, estado, fecha_creacion
) VALUES 
(1, 'Reserva Lab Redes - Grupo 7A', '443-123-4567', 'Ingeniería en Sistemas', '7mo', 
 'Reserva', 'Director/Subdirector', 1,
 'Solicito la reserva del laboratorio de redes para realizar prácticas de configuración de switches y routers con el grupo 7A de Ingeniería en Sistemas. La práctica forma parte del proyecto final de la materia Redes de Computadoras.',
 '2025-11-01', '09:00:00', '11:00:00', 25, 'Redes de Computadoras', 'Ing. Roberto Jiménez',
 'pendiente', '2025-10-25 09:30:00');

INSERT INTO solicitud (
    id_usuario, nombre, telefono, carrera, semestre, tipo, destino_rol, laboratorio_id,
    descripcion, tipo_problema, equipo_afectado, prioridad, estado, fecha_creacion,
    asignado_a_usuario_id
) VALUES 
(2, 'Soporte PC Lab Industrial', '443-987-6543', 'Ingeniería Industrial', '6to',
 'Soporte', 'Técnico', 4,
 'La computadora del puesto 15 presenta fallos intermitentes y se reinicia constantemente durante las prácticas. Esto afecta el desarrollo normal de las clases y el trabajo de los estudiantes.',
 'Mantenimiento de Hardware', 'PC-Industrial-15', 'Alta', 'en-proceso', '2025-10-24 14:20:00',
 4); -- Asumiendo que el usuario 4 es el técnico del lab industrial

INSERT INTO solicitud (
    id_usuario, nombre, telefono, carrera, semestre, tipo, destino_rol, laboratorio_id,
    descripcion, fecha_reserva, hora_inicio, hora_fin, participantes, materia, 
    profesor_responsable, estado, fecha_creacion, observaciones
) VALUES 
(3, 'Reserva Lab Electrónica - Proyecto Final', '443-555-1234', 'Ingeniería Electrónica', '8vo',
 'Reserva', 'Director/Subdirector', 3,
 'Solicito la reserva del laboratorio de electrónica para realizar las pruebas finales del proyecto de titulación. Necesitamos acceso a osciloscopios y fuentes de alimentación para validar el funcionamiento del circuito desarrollado.',
 '2025-10-30', '14:00:00', '18:00:00', 4, 'Proyecto de Titulación', 'Dr. Luis Ramírez',
 'aprobado', '2025-10-23 16:10:00', 'Proyecto aprobado por la academia, requiere equipos especializados.');

-- ========================================
-- ACTUALIZAR DATOS DE LABORATORIOS
-- ========================================

-- Asegurar que los laboratorios tengan técnicos asignados para el sistema
INSERT INTO laboratorios (nombre, ubicacion, id_tecnico, estado) VALUES 
('Laboratorio de Redes', 'Edificio A - Planta Baja', 2, 'ACTIVO'),
('Laboratorio de Sistemas', 'Edificio A - Primer Piso', 3, 'ACTIVO'),
('Laboratorio de Electrónica', 'Edificio B - Planta Baja', 4, 'ACTIVO'),
('Laboratorio Industrial', 'Edificio C - Planta Baja', 5, 'ACTIVO'),
('Laboratorio de Física', 'Edificio B - Primer Piso', 6, 'ACTIVO')
ON DUPLICATE KEY UPDATE 
    ubicacion = VALUES(ubicacion),
    id_tecnico = VALUES(id_tecnico),
    estado = VALUES(estado);

-- ========================================
-- CREAR USUARIOS TÉCNICOS SI NO EXISTEN
-- ========================================

INSERT INTO usuarios (nombre_completo, email, contrasena_hash, rol, activo) VALUES 
('Téc. López Martín', 'tecnico.lopez@utm.edu.mx', '$2y$10$dummy_hash_lopez', 'TECNICO', 1),
('Téc. García Ruiz', 'tecnico.garcia@utm.edu.mx', '$2y$10$dummy_hash_garcia', 'TECNICO', 1),
('Téc. Morales Silva', 'tecnico.morales@utm.edu.mx', '$2y$10$dummy_hash_morales', 'TECNICO', 1),
('Téc. Hernández Cruz', 'tecnico.hernandez@utm.edu.mx', '$2y$10$dummy_hash_hernandez', 'TECNICO', 1),
('Téc. Rivera Santos', 'tecnico.rivera@utm.edu.mx', '$2y$10$dummy_hash_rivera', 'TECNICO', 1)
ON DUPLICATE KEY UPDATE 
    nombre_completo = VALUES(nombre_completo),
    rol = VALUES(rol),
    activo = VALUES(activo);

-- ========================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ========================================

DELIMITER //

-- Procedimiento para obtener técnico asignado por laboratorio
CREATE OR REPLACE PROCEDURE sp_obtener_tecnico_laboratorio(IN lab_id INT)
BEGIN
    SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.email
    FROM usuarios u 
    INNER JOIN laboratorios l ON u.id_usuario = l.id_tecnico
    WHERE l.id_laboratorio = lab_id AND u.activo = 1;
END //

-- Procedimiento para crear solicitud completa
CREATE OR REPLACE PROCEDURE sp_crear_solicitud(
    IN p_usuario_id INT,
    IN p_nombre VARCHAR(200),
    IN p_telefono VARCHAR(20),
    IN p_carrera VARCHAR(80),
    IN p_semestre VARCHAR(10),
    IN p_tipo ENUM('Reserva','Soporte'),
    IN p_destino_rol ENUM('Director/Subdirector','Técnico'),
    IN p_laboratorio_id INT,
    IN p_descripcion TEXT,
    IN p_fecha_reserva DATE,
    IN p_hora_inicio TIME,
    IN p_hora_fin TIME,
    IN p_participantes INT,
    IN p_materia VARCHAR(100),
    IN p_profesor_responsable VARCHAR(120),
    IN p_tipo_problema VARCHAR(100),
    IN p_equipo_afectado VARCHAR(200),
    IN p_prioridad ENUM('Baja','Media','Alta','Crítica'),
    IN p_observaciones TEXT
)
BEGIN
    DECLARE tecnico_id INT DEFAULT NULL;
    
    -- Si es para técnico, obtener el técnico asignado del laboratorio
    IF p_destino_rol = 'Técnico' AND p_laboratorio_id IS NOT NULL THEN
        SELECT id_tecnico INTO tecnico_id 
        FROM laboratorios 
        WHERE id_laboratorio = p_laboratorio_id;
    END IF;
    
    -- Insertar la solicitud
    INSERT INTO solicitud (
        id_usuario, nombre, telefono, carrera, semestre, tipo, destino_rol, 
        laboratorio_id, asignado_a_usuario_id, descripcion, fecha_reserva, 
        hora_inicio, hora_fin, participantes, materia, profesor_responsable,
        tipo_problema, equipo_afectado, prioridad, observaciones, estado
    ) VALUES (
        p_usuario_id, p_nombre, p_telefono, p_carrera, p_semestre, p_tipo, 
        p_destino_rol, p_laboratorio_id, tecnico_id, p_descripcion, p_fecha_reserva,
        p_hora_inicio, p_hora_fin, p_participantes, p_materia, p_profesor_responsable,
        p_tipo_problema, p_equipo_afectado, p_prioridad, p_observaciones, 'pendiente'
    );
    
    SELECT LAST_INSERT_ID() as id_solicitud;
END //

DELIMITER ;

-- ========================================
-- ÍNDICES ADICIONALES
-- ========================================

CREATE INDEX ix_solicitud_tipo_estado ON solicitud (tipo, estado);
CREATE INDEX ix_solicitud_laboratorio ON solicitud (laboratorio_id, destino_rol);
CREATE INDEX ix_solicitud_fecha ON solicitud (fecha_creacion DESC);

-- ========================================
-- COMENTARIOS FINALES
-- ========================================

/*
RESUMEN DE CAMBIOS:
1. Tabla solicitud expandida con nuevos campos específicos
2. Tipos actualizados: 'Reserva' y 'Soporte'  
3. Estados actualizados: 'pendiente', 'en-proceso', 'aprobado', 'rechazado'
4. Destino_rol simplificado: 'Director/Subdirector', 'Técnico'
5. Campos específicos para cada tipo de solicitud
6. Vista completa para consultas
7. Datos de prueba insertados
8. Procedimientos almacenados para operaciones comunes

NOTAS:
- La tabla solicitud_backup contiene respaldo de datos originales
- Los técnicos se asignan automáticamente por laboratorio
- La vista vista_solicitudes_completas facilita las consultas del frontend
*/