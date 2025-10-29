// ======================================
// SCRIPT DE LIMPIEZA DE DATOS DE EJEMPLO
// ======================================

/**
 * Función para limpiar todos los datos de ejemplo del sistema AccessLab
 * Ejecutar en la consola del navegador para limpiar localStorage
 */
function limpiarDatosEjemplo() {
    console.log('🧹 Iniciando limpieza de datos de ejemplo...');
    
    // Limpiar datos de asignaciones de laboratorios
    localStorage.removeItem('accesslab_assignments');
    console.log('✅ Datos de asignaciones eliminados');
    
    // Limpiar modo de asignación
    localStorage.removeItem('accesslab_assignment_mode');
    localStorage.removeItem('accesslab_assignment_mode_date');
    console.log('✅ Configuración de modo asignación eliminada');
    
    // Limpiar datos de sesión de usuario (si los hay)
    localStorage.removeItem('userSession');
    localStorage.removeItem('currentUser');
    console.log('✅ Datos de sesión limpiados');
    
    // Limpiar cualquier otro dato que pueda haberse guardado
    const keys = Object.keys(localStorage);
    const accessLabKeys = keys.filter(key => key.startsWith('accesslab_') || key.includes('solicitud') || key.includes('bitacora'));
    
    if (accessLabKeys.length > 0) {
        console.log('🔍 Encontradas claves adicionales:', accessLabKeys);
        accessLabKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`✅ ${key} eliminado`);
        });
    }
    
    console.log('🎉 Limpieza completada! El sistema está vacío y listo para producción.');
    console.log('📌 Nota: Los datos en memoria (JavaScript) ya fueron eliminados de los archivos fuente.');
    
    return {
        status: 'success',
        message: 'Todos los datos de ejemplo han sido eliminados',
        cleanedKeys: ['accesslab_assignments', 'accesslab_assignment_mode', 'accesslab_assignment_mode_date', 'userSession', 'currentUser', ...accessLabKeys]
    };
}

/**
 * Función para verificar el estado de limpieza
 */
function verificarLimpieza() {
    console.log('🔍 Verificando estado del sistema...');
    
    const keys = Object.keys(localStorage);
    const accessLabKeys = keys.filter(key => 
        key.startsWith('accesslab_') || 
        key.includes('solicitud') || 
        key.includes('bitacora') ||
        key.includes('usuario') ||
        key.includes('laboratorio')
    );
    
    if (accessLabKeys.length === 0) {
        console.log('✅ Sistema limpio - No se encontraron datos de ejemplo en localStorage');
        return { clean: true, keys: [] };
    } else {
        console.log('⚠️  Se encontraron datos pendientes:', accessLabKeys);
        return { clean: false, keys: accessLabKeys };
    }
}

// Exportar funciones globalmente para uso en consola
window.limpiarDatosEjemplo = limpiarDatosEjemplo;
window.verificarLimpieza = verificarLimpieza;

// Auto-ejecutar verificación al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Script de limpieza de datos cargado');
    console.log('💡 Usa limpiarDatosEjemplo() para limpiar localStorage');
    console.log('💡 Usa verificarLimpieza() para verificar el estado');
});