-- =====================================================
-- PRUEBAS DE VALIDACIÓN - Sistema de Solicitudes v2.0
-- =====================================================
-- Archivo: validacion_sistema_solicitudes.sql
-- Propósito: Validar que la migración se ejecutó correctamente
-- Fecha: 2025-01-27
-- Autor: Sistema AccessLab

-- =====================================================
-- 1. VERIFICACIÓN DE ESTRUCTURA DE TABLA
-- =====================================================

-- Mostrar estructura completa de la tabla solicitud
DESCRIBE solicitud;

-- Verificar que todos los campos existen
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_TYPE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'solicitud' 
    AND TABLE_SCHEMA = DATABASE()
ORDER BY ORDINAL_POSITION;

-- =====================================================
-- 2. VERIFICACIÓN DE ENUMERACIONES
-- =====================================================

-- Verificar tipos válidos
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'solicitud' 
    AND COLUMN_NAME = 'tipo';

-- Verificar estados válidos
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'solicitud' 
    AND COLUMN_NAME = 'estado';

-- Verificar destino_rol válidos
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'solicitud' 
    AND COLUMN_NAME = 'destino_rol';

-- Verificar prioridad válida
SELECT COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'solicitud' 
    AND COLUMN_NAME = 'prioridad';

-- =====================================================
-- 3. VERIFICACIÓN DE CONSTRAINTS
-- =====================================================

-- Mostrar todas las constraints de la tabla
SELECT 
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE,
    CHECK_CLAUSE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
LEFT JOIN INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc ON tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME = 'solicitud' 
    AND tc.TABLE_SCHEMA = DATABASE();

-- =====================================================
-- 4. VERIFICACIÓN DE ÍNDICES
-- =====================================================

-- Mostrar todos los índices de la tabla
SHOW INDEX FROM solicitud;

-- =====================================================
-- 5. VERIFICACIÓN DE VISTA
-- =====================================================

-- Verificar que la vista existe
SELECT TABLE_NAME, VIEW_DEFINITION 
FROM INFORMATION_SCHEMA.VIEWS 
WHERE TABLE_NAME = 'vista_solicitudes_completas'
    AND TABLE_SCHEMA = DATABASE();

-- Probar la vista con datos de ejemplo
SELECT 
    id_solicitud,
    nombre_solicitud,
    tipo,
    estado,
    laboratorio_nombre,
    tecnico_asignado,
    fecha_creacion
FROM vista_solicitudes_completas
LIMIT 5;

-- =====================================================
-- 6. VERIFICACIÓN DE PROCEDIMIENTO ALMACENADO
-- =====================================================

-- Verificar que el procedimiento existe
SELECT 
    ROUTINE_NAME,
    ROUTINE_TYPE,
    CREATED,
    LAST_ALTERED
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_NAME = 'sp_crear_solicitud'
    AND ROUTINE_SCHEMA = DATABASE();

-- =====================================================
-- 7. PRUEBAS DE INSERCIÓN - SOLICITUD DE RESERVA
-- =====================================================

-- Test 1: Solicitud de Reserva válida
INSERT INTO solicitud (
    id_usuario, nombre, telefono, carrera, semestre, descripcion,
    tipo, estado, destino_rol, laboratorio_id,
    fecha_reserva, hora_inicio, hora_fin, participantes, 
    materia, profesor_responsable, observaciones
) VALUES (
    7, -- ID de Juan Pérez (Maestro)
    'Reserva Lab Redes - Práctica CISCO',
    '555-0001',
    'Ingeniería en Sistemas',
    '8vo',
    'Necesito reservar el laboratorio para práctica de configuración de routers CISCO',
    'Reserva',
    'pendiente',
    'Director/Subdirector',
    1, -- Laboratorio de Redes
    '2025-02-15',
    '09:00:00',
    '11:00:00',
    25,
    'Redes de Computadoras II',
    'Dr. García Hernández',
    'Se requieren 25 equipos funcionando'
);

-- Verificar inserción
SELECT * FROM solicitud WHERE nombre LIKE 'Reserva Lab Redes%';

-- =====================================================
-- 8. PRUEBAS DE INSERCIÓN - SOLICITUD DE SOPORTE
-- =====================================================

-- Test 2: Solicitud de Soporte válida
INSERT INTO solicitud (
    id_usuario, nombre, telefono, carrera, descripcion,
    tipo, estado, destino_rol, laboratorio_id,
    tipo_problema, equipo_afectado, prioridad, observaciones,
    asignado_a_usuario_id
) VALUES (
    8, -- ID de María González (Maestro)
    'Problema con Switches - Lab Sistemas',
    '555-0002',
    'Ingeniería en Computación',
    'Los switches principales no están respondiendo, sin conectividad de red',
    'Soporte',
    'pendiente',
    'Técnico',
    2, -- Laboratorio de Sistemas
    'Conectividad de Red',
    'Switch Cisco Catalyst 2960 (x3)',
    'Alta',
    'Problema comenzó esta mañana, afecta todas las prácticas',
    3 -- Téc. García Ruiz
);

-- Verificar inserción
SELECT * FROM solicitud WHERE nombre LIKE 'Problema con Switches%';

-- =====================================================
-- 9. PRUEBAS DE VALIDACIÓN DE CONSTRAINTS
-- =====================================================

-- Test 3: Intentar insertar Reserva sin fecha (debe fallar)
-- ESTA CONSULTA DEBE FALLAR
/*
INSERT INTO solicitud (
    id_usuario, nombre, descripcion, tipo, estado, destino_rol, laboratorio_id
) VALUES (
    7, 'Test Reserva Inválida', 'Sin fecha', 'Reserva', 'pendiente', 'Director/Subdirector', 1
);
*/

-- Test 4: Intentar insertar Soporte sin tipo_problema (debe fallar)
-- ESTA CONSULTA DEBE FALLAR
/*
INSERT INTO solicitud (
    id_usuario, nombre, descripcion, tipo, estado, destino_rol, laboratorio_id
) VALUES (
    8, 'Test Soporte Inválido', 'Sin tipo problema', 'Soporte', 'pendiente', 'Técnico', 2
);
*/

-- Test 5: Intentar insertar horario inválido (debe fallar)
-- ESTA CONSULTA DEBE FALLAR
/*
INSERT INTO solicitud (
    id_usuario, nombre, descripcion, tipo, estado, destino_rol, laboratorio_id,
    fecha_reserva, hora_inicio, hora_fin
) VALUES (
    7, 'Test Horario Inválido', 'Fin antes que inicio', 'Reserva', 'pendiente', 'Director/Subdirector', 1,
    '2025-02-20', '15:00:00', '14:00:00'
);
*/

-- =====================================================
-- 10. PRUEBA DE ASIGNACIÓN AUTOMÁTICA DE TÉCNICOS
-- =====================================================

-- Verificar que los técnicos están correctamente asignados a laboratorios
SELECT 
    l.id_laboratorio,
    l.nombre AS laboratorio,
    l.id_tecnico,
    u.nombre_completo AS tecnico_asignado
FROM laboratorios l
JOIN usuarios u ON l.id_tecnico = u.id_usuario
WHERE u.rol = 'Técnico'
ORDER BY l.id_laboratorio;

-- =====================================================
-- 11. PRUEBA DE PROCEDIMIENTO ALMACENADO
-- =====================================================

-- Test con procedimiento almacenado - Reserva
CALL sp_crear_solicitud(
    7, -- id_usuario
    'Reserva mediante SP - Lab Electrónica', -- nombre
    '555-0003', -- telefono
    'Ingeniería Electrónica', -- carrera
    '6to', -- semestre
    'Reserva', -- tipo
    'Director/Subdirector', -- destino_rol
    3, -- laboratorio_id (Electrónica)
    'Práctica de circuitos integrados digitales', -- descripcion
    '2025-02-20', -- fecha_reserva
    '14:00:00', -- hora_inicio
    '16:00:00', -- hora_fin
    20, -- participantes
    'Electrónica Digital II', -- materia
    'Ing. Morales López', -- profesor_responsable
    NULL, -- tipo_problema
    NULL, -- equipo_afectado
    NULL, -- prioridad
    'Requiere osciloscopios digitales' -- observaciones
);

-- Test con procedimiento almacenado - Soporte
CALL sp_crear_solicitud(
    8, -- id_usuario
    'Soporte mediante SP - Equipos Dañados', -- nombre
    '555-0004', -- telefono
    'Ingeniería Industrial', -- carrera
    '4to', -- semestre
    'Soporte', -- tipo
    'Técnico', -- destino_rol
    4, -- laboratorio_id (Industrial)
    'Varios equipos de medición no funcionan correctamente', -- descripcion
    NULL, -- fecha_reserva
    NULL, -- hora_inicio
    NULL, -- hora_fin
    NULL, -- participantes
    NULL, -- materia
    NULL, -- profesor_responsable
    'Equipos de Medición', -- tipo_problema
    'Multímetros Fluke (x5), Generador de Señales', -- equipo_afectado
    'Media', -- prioridad
    'Problema reportado por estudiantes' -- observaciones
);

-- =====================================================
-- 12. VERIFICACIÓN FINAL DE DATOS
-- =====================================================

-- Contar solicitudes por tipo
SELECT 
    tipo,
    COUNT(*) as cantidad,
    MIN(fecha_creacion) as primera_solicitud,
    MAX(fecha_creacion) as ultima_solicitud
FROM solicitud 
GROUP BY tipo;

-- Contar solicitudes por estado
SELECT 
    estado,
    COUNT(*) as cantidad
FROM solicitud 
GROUP BY estado;

-- Contar solicitudes por destino
SELECT 
    destino_rol,
    COUNT(*) as cantidad
FROM solicitud 
GROUP BY destino_rol;

-- Verificar solicitudes con técnico asignado
SELECT 
    COUNT(*) as solicitudes_con_tecnico
FROM solicitud 
WHERE asignado_a_usuario_id IS NOT NULL;

-- =====================================================
-- 13. PRUEBA COMPLETA DE LA VISTA
-- =====================================================

-- Ver todas las solicitudes con información completa
SELECT 
    id_solicitud,
    nombre_solicitud,
    solicitante,
    tipo,
    estado,
    laboratorio_nombre,
    tecnico_asignado,
    destino_rol,
    DATE(fecha_creacion) as fecha
FROM vista_solicitudes_completas
ORDER BY fecha_creacion DESC;

-- =====================================================
-- 14. RESUMEN DE VALIDACIÓN
-- =====================================================

SELECT 
    '=== RESUMEN DE VALIDACIÓN ===' as titulo;

SELECT 
    'Estructura de tabla' as verificacion,
    CASE 
        WHEN COUNT(*) >= 20 THEN '✅ CORRECTO' 
        ELSE '❌ ERROR' 
    END as resultado
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'solicitud';

SELECT 
    'Vista creada' as verificacion,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ CORRECTO' 
        ELSE '❌ ERROR' 
    END as resultado
FROM INFORMATION_SCHEMA.VIEWS 
WHERE TABLE_NAME = 'vista_solicitudes_completas';

SELECT 
    'Procedimiento almacenado' as verificacion,
    CASE 
        WHEN COUNT(*) = 1 THEN '✅ CORRECTO' 
        ELSE '❌ ERROR' 
    END as resultado
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_NAME = 'sp_crear_solicitud';

SELECT 
    'Datos de prueba' as verificacion,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ CORRECTO' 
        ELSE '❌ ERROR' 
    END as resultado
FROM solicitud;

SELECT 
    'Técnicos asignados' as verificacion,
    CASE 
        WHEN COUNT(*) = 5 THEN '✅ CORRECTO' 
        ELSE '❌ ERROR' 
    END as resultado
FROM laboratorios 
WHERE id_tecnico IS NOT NULL;

-- =====================================================
-- FIN DE PRUEBAS DE VALIDACIÓN
-- =====================================================

SELECT 
    '🎉 VALIDACIÓN COMPLETADA' as mensaje,
    NOW() as fecha_ejecucion;