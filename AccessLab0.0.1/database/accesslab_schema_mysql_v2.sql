-- ========================================
-- ACCESSLAB - ESQUEMA ACTUALIZADO v2.0
-- Sistema de Solicitudes Rediseñado
-- Fecha: 2025-10-27
-- ========================================

SET sql_mode = 'STRICT_ALL_TABLES';
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS accesslab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE accesslab;

SET FOREIGN_KEY_CHECKS = 0;

-- ===============
-- Eliminación segura
-- ===============
DROP TABLE IF EXISTS usuario_recuperacion;
DROP TABLE IF EXISTS inventario_cambio;
DROP TABLE IF EXISTS respaldo_log;
DROP TABLE IF EXISTS respaldo_horario;
DROP TABLE IF EXISTS notificacion;
DROP TABLE IF EXISTS comentario;
DROP TABLE IF EXISTS aviso;
DROP TABLE IF EXISTS asignacion_horario;
DROP TABLE IF EXISTS asignacion_laboratorio;
DROP TABLE IF EXISTS reserva_laboratorio;
DROP TABLE IF EXISTS solicitud;
DROP TABLE IF EXISTS observacion_bitacora;
DROP TABLE IF EXISTS bitacora_detalle;
DROP TABLE IF EXISTS bitacora;
DROP TABLE IF EXISTS periodo_academico;
DROP TABLE IF EXISTS laboratorios;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- ===============
-- TABLAS BASE
-- ===============

CREATE TABLE usuarios (
  id_usuario        INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo   VARCHAR(120)      NOT NULL,
  email             VARCHAR(120)      NOT NULL UNIQUE,
  contrasena_hash   VARCHAR(255)      NOT NULL,
  carrera           VARCHAR(80)       NULL,
  rol               ENUM('DIRECTOR','SUBDIRECTOR','TECNICO','MAESTRO') NOT NULL,
  activo            TINYINT(1)        NOT NULL DEFAULT 1,
  fecha_creacion    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso     DATETIME          NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE laboratorios (
  id_laboratorio    INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(100)      NOT NULL,
  ubicacion         VARCHAR(120)      NULL,
  id_tecnico        INT               NULL,
  inventario_texto  LONGTEXT          NULL,
  estado            VARCHAR(10)       NULL,
  CONSTRAINT fk_lab_tecnico FOREIGN KEY (id_tecnico)
    REFERENCES usuarios(id_usuario)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE periodo_academico (
  id_periodo        INT AUTO_INCREMENT PRIMARY KEY,
  nombre            VARCHAR(40)       NOT NULL,
  fecha_inicio      DATE              NOT NULL,
  fecha_fin         DATE              NOT NULL,
  estado            ENUM('EN_ACTIVIDAD','EN_ASIGNACION') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bitacora (
  id_bitacora       INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario        INT               NOT NULL,
  id_laboratorio    INT               NOT NULL,
  periodo_id        INT               NULL,
  fecha_inicio      DATE              NULL,
  fecha_fin         DATE              NULL,
  materia           VARCHAR(100)      NULL,
  grupo             VARCHAR(20)       NULL,
  carrera           VARCHAR(80)       NULL,
  cuatrimestre      VARCHAR(30)       NULL,
  parcial           TINYINT           NULL,
  estado            ENUM('ABIERTA','CERRADA','VALIDADA') NOT NULL,
  CONSTRAINT fk_bit_usuario     FOREIGN KEY (id_usuario)     REFERENCES usuarios(id_usuario)     ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_bit_laboratorio FOREIGN KEY (id_laboratorio) REFERENCES laboratorios(id_laboratorio) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_bit_periodo     FOREIGN KEY (periodo_id)     REFERENCES periodo_academico(id_periodo) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE bitacora_detalle (
  id_detalle        INT AUTO_INCREMENT PRIMARY KEY,
  bitacora_id       INT               NOT NULL,
  nombre_practica   VARCHAR(120)      NOT NULL,
  fecha             DATE              NOT NULL,
  hora_entrada      TIME              NOT NULL,
  hora_salida       TIME              NOT NULL,
  horas_sesion      DECIMAL(4,2)      NOT NULL,
  estado_equipo     VARCHAR(60)       NULL,
  es_falta          TINYINT(1)        NOT NULL DEFAULT 0,
  CONSTRAINT fk_bdet_bitacora FOREIGN KEY (bitacora_id) REFERENCES bitacora(id_bitacora)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT ck_bdet_horas CHECK (hora_entrada < hora_salida)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE observacion_bitacora (
  id_observacion    INT AUTO_INCREMENT PRIMARY KEY,
  bitacora_id       INT               NOT NULL,
  usuario_id        INT               NOT NULL,
  contenido         LONGTEXT          NOT NULL,
  fecha             DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  es_tercero        TINYINT(1)        NOT NULL DEFAULT 0,
  CONSTRAINT fk_obs_bitacora FOREIGN KEY (bitacora_id) REFERENCES bitacora(id_bitacora)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_obs_usuario  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id_usuario)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- TABLA SOLICITUD REDISEÑADA
-- ========================================
CREATE TABLE solicitud (
  id_solicitud           INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario             INT               NOT NULL, -- solicitante
  nombre                 VARCHAR(200)      NOT NULL, -- nombre de la solicitud
  telefono               VARCHAR(20)       NULL,
  carrera                VARCHAR(80)       NULL,
  semestre               VARCHAR(10)       NULL,
  descripcion            TEXT              NOT NULL,
  tipo                   ENUM('Reserva','Soporte') NOT NULL,
  estado                 ENUM('pendiente','en-proceso','aprobado','rechazado') NOT NULL,
  destino_rol            ENUM('Director/Subdirector','Técnico') NOT NULL,
  destino_usuario_id     INT               NULL,
  laboratorio_id         INT               NULL, -- requerido
  asignado_a_usuario_id  INT               NULL, -- técnico asignado automáticamente
  fecha_creacion         DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Campos específicos para RESERVA
  fecha_reserva          DATE              NULL,
  hora_inicio            TIME              NULL,
  hora_fin               TIME              NULL,
  participantes          INT               NULL,
  materia                VARCHAR(100)      NULL,
  profesor_responsable   VARCHAR(120)      NULL,
  
  -- Campos específicos para SOPORTE
  tipo_problema          VARCHAR(100)      NULL,
  equipo_afectado        VARCHAR(200)      NULL,
  prioridad              ENUM('Baja','Media','Alta','Crítica') NULL,
  
  -- Campo común adicional
  observaciones          TEXT              NULL,
  
  CONSTRAINT fk_sol_usuario      FOREIGN KEY (id_usuario)            REFERENCES usuarios(id_usuario)            ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_sol_destino_usr  FOREIGN KEY (destino_usuario_id)    REFERENCES usuarios(id_usuario)            ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sol_lab          FOREIGN KEY (laboratorio_id)        REFERENCES laboratorios(id_laboratorio)    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sol_asignado     FOREIGN KEY (asignado_a_usuario_id) REFERENCES usuarios(id_usuario)            ON DELETE SET NULL ON UPDATE CASCADE,
  
  -- Validaciones
  CONSTRAINT ck_sol_horas CHECK (
    (hora_inicio IS NULL AND hora_fin IS NULL) OR 
    (hora_inicio IS NOT NULL AND hora_fin IS NOT NULL AND hora_inicio < hora_fin)
  ),
  CONSTRAINT ck_sol_reserva CHECK (
    (tipo = 'Reserva' AND fecha_reserva IS NOT NULL) OR 
    (tipo = 'Soporte')
  ),
  CONSTRAINT ck_sol_soporte CHECK (
    (tipo = 'Soporte' AND tipo_problema IS NOT NULL AND prioridad IS NOT NULL) OR 
    (tipo = 'Reserva')
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================
-- RESTO DE TABLAS (sin cambios)
-- ========================================

CREATE TABLE reserva_laboratorio (
  id_reserva        INT AUTO_INCREMENT PRIMARY KEY,
  laboratorio_id    INT               NOT NULL,
  solicitante_id    INT               NOT NULL,
  solicitud_id      INT               NULL,
  fecha             DATE              NOT NULL,
  hora_inicio       TIME              NULL,
  hora_fin          TIME              NULL,
  estado            ENUM('pendiente','aprobada','rechazada','cancelada') NOT NULL,
  aprobada_por      INT               NULL,
  CONSTRAINT fk_res_lab       FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id_laboratorio) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_res_solic     FOREIGN KEY (solicitante_id) REFERENCES usuarios(id_usuario)         ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_res_solicitud FOREIGN KEY (solicitud_id)   REFERENCES solicitud(id_solicitud)      ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_res_aprobador FOREIGN KEY (aprobada_por)   REFERENCES usuarios(id_usuario)         ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT ck_res_horas CHECK ((hora_inicio IS NULL AND hora_fin IS NULL) OR (hora_inicio IS NOT NULL AND hora_fin IS NOT NULL AND hora_inicio < hora_fin))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE asignacion_laboratorio (
  id_asignacion     INT AUTO_INCREMENT PRIMARY KEY,
  laboratorio_id    INT               NOT NULL,
  usuario_id        INT               NOT NULL, -- profesor
  carrera           VARCHAR(80)       NOT NULL,
  materia           VARCHAR(100)      NOT NULL,
  periodo_id        INT               NOT NULL,
  creado_por        INT               NOT NULL,
  fecha_asignacion  DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo            TINYINT(1)        NOT NULL DEFAULT 1,
  CONSTRAINT fk_asig_lab     FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id_laboratorio) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_asig_usr     FOREIGN KEY (usuario_id)     REFERENCES usuarios(id_usuario)         ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_asig_periodo FOREIGN KEY (periodo_id)     REFERENCES periodo_academico(id_periodo) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_asig_creado  FOREIGN KEY (creado_por)     REFERENCES usuarios(id_usuario)         ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE asignacion_horario (
  id_horario        INT AUTO_INCREMENT PRIMARY KEY,
  asignacion_id     INT               NOT NULL,
  dia_semana        ENUM('LUN','MAR','MIE','JUE','VIE','SAB') NOT NULL,
  hora_inicio       TIME              NOT NULL,
  hora_fin          TIME              NOT NULL,
  CONSTRAINT fk_ah_asignacion FOREIGN KEY (asignacion_id) REFERENCES asignacion_laboratorio(id_asignacion)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT ck_ah_horas CHECK (hora_inicio < hora_fin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE aviso (
  id_aviso          INT AUTO_INCREMENT PRIMARY KEY,
  titulo            VARCHAR(120)      NULL,
  contenido         VARCHAR(500)      NOT NULL,
  fecha             DATE              NOT NULL DEFAULT (CURRENT_DATE),
  es_global         TINYINT(1)        NOT NULL DEFAULT 1,
  id_usuario        INT               NOT NULL,
  laboratorio_id    INT               NULL,
  CONSTRAINT fk_aviso_usuario     FOREIGN KEY (id_usuario)     REFERENCES usuarios(id_usuario)         ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_aviso_laboratorio FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id_laboratorio) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comentario (
  id_comentario     INT AUTO_INCREMENT PRIMARY KEY,
  contenido         VARCHAR(500)      NOT NULL,
  fecha             DATE              NOT NULL DEFAULT (CURRENT_DATE),
  id_usuario        INT               NOT NULL,
  id_aviso          INT               NOT NULL,
  visible           TINYINT(1)        NOT NULL DEFAULT 1,
  CONSTRAINT fk_com_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_com_aviso   FOREIGN KEY (id_aviso)   REFERENCES aviso(id_aviso)     ON DELETE CASCADE  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notificacion (
  id_notificacion   INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT               NOT NULL, -- receptor
  tipo              ENUM('aviso','solicitud','reserva','bitacora','sistema') NOT NULL,
  titulo            VARCHAR(120)      NULL,
  mensaje           VARCHAR(1000)     NOT NULL,
  entidad_tipo      VARCHAR(20)       NULL,
  entidad_id        INT               NULL,
  leida             TINYINT(1)        NOT NULL DEFAULT 0,
  fecha_creacion    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE respaldo_horario (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  hora              TIME              NOT NULL,
  activo            TINYINT(1)        NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE respaldo_log (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  fecha_ejecucion   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado            VARCHAR(12)       NOT NULL,
  tamano_bytes      BIGINT            NULL,
  detalle_error     LONGTEXT          NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE inventario_cambio (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  laboratorio_id    INT               NOT NULL,
  usuario_id        INT               NOT NULL,
  fecha             DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descripcion       LONGTEXT          NOT NULL,
  CONSTRAINT fk_inv_lab FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id_laboratorio) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_inv_usr FOREIGN KEY (usuario_id)     REFERENCES usuarios(id_usuario)         ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE usuario_recuperacion (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id        INT               NOT NULL,
  token             VARCHAR(200)      NOT NULL,
  fecha_creacion    DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_en         DATETIME          NOT NULL DEFAULT (DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 MINUTE)),
  usado             TINYINT(1)        NOT NULL DEFAULT 0,
  CONSTRAINT fk_urec_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===============
-- ÍNDICES OPTIMIZADOS
-- ===============
CREATE INDEX ix_solicitud_destino ON solicitud (destino_rol, laboratorio_id, destino_usuario_id);
CREATE INDEX ix_solicitud_estado  ON solicitud (estado);
CREATE INDEX ix_solicitud_tipo_estado ON solicitud (tipo, estado);
CREATE INDEX ix_solicitud_laboratorio ON solicitud (laboratorio_id, destino_rol);
CREATE INDEX ix_solicitud_fecha ON solicitud (fecha_creacion DESC);
CREATE INDEX ix_asig_lab          ON asignacion_laboratorio (laboratorio_id, usuario_id, periodo_id);
CREATE INDEX ix_asig_hor          ON asignacion_horario (asignacion_id, dia_semana, hora_inicio);
CREATE INDEX ix_reserva_lab_fecha ON reserva_laboratorio (laboratorio_id, fecha, hora_inicio);
CREATE INDEX ix_notif_usr_fecha   ON notificacion (usuario_id, leida, fecha_creacion);

-- ===============
-- VISTA COMPLETA PARA SOLICITUDES
-- ===============
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

-- ===============
-- DATOS INICIALES
-- ===============

-- Usuarios base del sistema
INSERT INTO usuarios (nombre_completo, email, contrasena_hash, rol, activo) VALUES 
('Director AccessLab', 'director@utm.edu.mx', '$2y$10$dummy_hash_director', 'DIRECTOR', 1),
('Téc. López Martín', 'tecnico.lopez@utm.edu.mx', '$2y$10$dummy_hash_lopez', 'TECNICO', 1),
('Téc. García Ruiz', 'tecnico.garcia@utm.edu.mx', '$2y$10$dummy_hash_garcia', 'TECNICO', 1),
('Téc. Morales Silva', 'tecnico.morales@utm.edu.mx', '$2y$10$dummy_hash_morales', 'TECNICO', 1),
('Téc. Hernández Cruz', 'tecnico.hernandez@utm.edu.mx', '$2y$10$dummy_hash_hernandez', 'TECNICO', 1),
('Téc. Rivera Santos', 'tecnico.rivera@utm.edu.mx', '$2y$10$dummy_hash_rivera', 'TECNICO', 1);

-- Laboratorios con técnicos asignados
INSERT INTO laboratorios (nombre, ubicacion, id_tecnico, estado) VALUES 
('Laboratorio de Redes', 'Edificio A - Planta Baja', 2, 'ACTIVO'),
('Laboratorio de Sistemas', 'Edificio A - Primer Piso', 3, 'ACTIVO'),
('Laboratorio de Electrónica', 'Edificio B - Planta Baja', 4, 'ACTIVO'),
('Laboratorio Industrial', 'Edificio C - Planta Baja', 5, 'ACTIVO'),
('Laboratorio de Física', 'Edificio B - Primer Piso', 6, 'ACTIVO');

-- ===============
-- COMENTARIOS FINALES
-- ===============

/*
ACCESSLAB v2.0 - SISTEMA DE SOLICITUDES REDISEÑADO

PRINCIPALES CAMBIOS:
✓ Tabla solicitud completamente reestructurada
✓ Solo 2 tipos: 'Reserva' y 'Soporte'
✓ Estados simplificados: pendiente, en-proceso, aprobado, rechazado
✓ Campos específicos para cada tipo de solicitud
✓ Asignación automática de técnicos por laboratorio
✓ Vista completa para consultas optimizadas
✓ Validaciones de integridad mejoradas
✓ Índices optimizados para rendimiento

ESTRUCTURA FINAL:
- Reserva: Para reservar laboratorios (dirigida a Director/Subdirector)
- Soporte: Para mantenimiento (dirigida a Técnico o Director/Subdirector)
- Asignación automática de técnicos según laboratorio seleccionado
- Campos dinámicos según el tipo de solicitud
*/