-- Datos iniciales para AccessLab
-- Ejecutar después de crear el esquema principal

USE accesslab;

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (nombre_completo, email, contrasena_hash, rol, activo) VALUES 
('Administrador del Sistema', 'admin@utm.edu.mx', '$2b$10$example_hash_for_password', 'DIRECTOR', 1);

-- Insertar períodos académicos
INSERT INTO periodo_academico (nombre, fecha_inicio, fecha_fin, estado) VALUES 
('Cuatrimestre Sep-Dic 2025', '2025-09-01', '2025-12-15', 'EN_ACTIVIDAD'),
('Cuatrimestre Ene-Abr 2026', '2026-01-15', '2026-04-30', 'EN_ASIGNACION');

-- Insertar laboratorios de ejemplo
INSERT INTO laboratorios (nombre, ubicacion, estado) VALUES 
('Laboratorio de Cómputo 1', 'Edificio A - Planta Baja', 'ACTIVO'),
('Laboratorio de Redes', 'Edificio B - Primer Piso', 'ACTIVO'),
('Laboratorio de Electrónica', 'Edificio C - Planta Baja', 'ACTIVO');

-- Configurar horario de respaldo automático (2:00 AM diario)
INSERT INTO respaldo_horario (hora, activo) VALUES ('02:00:00', 1);

-- Insertar aviso de bienvenida
INSERT INTO aviso (titulo, contenido, es_global, id_usuario) VALUES 
('Bienvenido a AccessLab', 'Sistema de gestión de laboratorios de la Universidad Tecnológica de Morelia. Por favor lee las instrucciones antes de usar el sistema.', 1, 1);