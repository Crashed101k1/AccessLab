// Configuración Admin - JavaScript para AccessLab

// Variables globales
let systemInfo = {
    version: '0.0.0',
    lastBackup: null,
    lastReport: null,
    activitiesActive: true // Por defecto las actividades están activas
};

// === CONSTANTES PARA MODO ASIGNACIÓN ===
const ASSIGNMENT_MODE_KEY = 'accesslab_assignment_mode';
const ASSIGNMENT_MODE_DATE_KEY = 'accesslab_assignment_mode_date';

// === FUNCIONES DE MODO ASIGNACIÓN ===

// Verificar si está en modo asignación
function isAssignmentMode() {
    return localStorage.getItem(ASSIGNMENT_MODE_KEY) === 'true';
}

// Activar modo asignación
function activateAssignmentMode() {
    localStorage.setItem(ASSIGNMENT_MODE_KEY, 'true');
    localStorage.setItem(ASSIGNMENT_MODE_DATE_KEY, new Date().toISOString());
    console.log('Modo Asignación activado desde configuración');
}

// Desactivar modo asignación
function deactivateAssignmentMode() {
    localStorage.removeItem(ASSIGNMENT_MODE_KEY);
    localStorage.removeItem(ASSIGNMENT_MODE_DATE_KEY);
    console.log('Modo Asignación desactivado desde configuración');
}

// Obtener fecha de activación del modo asignación
function getAssignmentModeDate() {
    const dateStr = localStorage.getItem(ASSIGNMENT_MODE_DATE_KEY);
    return dateStr ? new Date(dateStr) : null;
}

// Función para navegar a diferentes secciones
// Función para regresar a la página anterior
function goBack() {
    try {
        // Agregar efecto visual al botón
        const backButton = event.target.closest('button');
        if (backButton) {
            backButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                backButton.style.transform = 'scale(1)';
            }, 100);
        }
        
        // Verificar si hay historial disponible
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Si no hay historial, ir al home por defecto
            window.location.href = 'HomeAdmin.html';
        }
    } catch (error) {
        // En caso de error, navegar al home como fallback
        console.log('Error al regresar, navegando al home:', error);
        window.location.href = 'HomeAdmin.html';
    }
}

function navigateTo(section) {
    switch(section) {
        case 'home':
            window.location.href = 'HomeAdmin.html';
            break;
        default:
            console.log(`Navegando a: ${section}`);
    }
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        // Limpiar datos de sesión si existen
        sessionStorage.clear();
        localStorage.removeItem('userSession');
        
        // Redirigir al login
        window.location.href = '../login.html';
    }
}

// Variables para respaldos
let scheduledBackups = [];

// Función para manejar respaldos
function handleBackup() {
    showBackupModal();
}

// Función para manejar reportes
function handleReports() {
    // Solo mostrar mensaje de maqueta
    alert('📊 Función en desarrollo\n\nEsta funcionalidad será implementada en la fase de backend.');
}

// Función para manejar el toggle de actividades
function handleActivityToggle() {
    if (systemInfo.activitiesActive) {
        // Mostrar modal de confirmación para terminar actividades
        showTerminateModal();
    } else {
        // Mostrar modal de confirmación para iniciar actividades
        showStartModal();
    }
}

// Funciones para el modal de Terminar Actividades
function showTerminateModal() {
    const modal = document.getElementById('terminateModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeTerminateModal() {
    const modal = document.getElementById('terminateModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function confirmTerminateAction() {
    systemInfo.activitiesActive = false;
    updateActivityButton();
    closeTerminateModal();
    
    // Activar modo asignación en el sistema
    activateAssignmentMode();
    
    // Mostrar mensaje de confirmación
    setTimeout(() => {
        alert('✅ Término de Actividades Confirmado\n\n' +
              'Se ha activado el Modo de Asignación.\n\n' +
              '📋 Funcionalidades disponibles:\n' +
              '• Asignar Laboratorios\n' +
              '• Gestión de Usuarios\n\n' +
              'Las demás funciones estarán restringidas hasta el inicio del próximo periodo.');
    }, 300);
}

// Funciones para el modal de Iniciar Actividades
function showStartModal() {
    const modal = document.getElementById('startModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeStartModal() {
    const modal = document.getElementById('startModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function confirmStartAction() {
    systemInfo.activitiesActive = true;
    updateActivityButton();
    closeStartModal();
    
    // Desactivar modo asignación en el sistema
    deactivateAssignmentMode();
    
    // Mostrar mensaje de confirmación
    setTimeout(() => {
        alert('✅ Inicio de Actividades Confirmado\n\n' +
              'Se ha desactivado el Modo de Asignación.\n\n' +
              '🎓 Todas las funcionalidades del sistema están ahora disponibles.\n\n' +
              'Los usuarios Maestro y Técnico pueden acceder normalmente a todas las opciones.');
    }, 300);
}

// Funciones para el modal de Respaldos
function showBackupModal() {
    const modal = document.getElementById('backupModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updateScheduleList();
}

function closeBackupModal() {
    const modal = document.getElementById('backupModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    // Limpiar selección
    document.getElementById('backupTimeSelect').value = '';
}

function addSchedule() {
    const timeSelect = document.getElementById('backupTimeSelect');
    const selectedTime = timeSelect.value;
    
    if (!selectedTime) {
        alert('⚠️ Por favor selecciona una hora para el respaldo');
        return;
    }
    
    // Verificar si ya existe ese horario
    if (scheduledBackups.includes(selectedTime)) {
        alert('⚠️ Este horario ya está programado');
        return;
    }
    
    // Agregar el horario
    scheduledBackups.push(selectedTime);
    scheduledBackups.sort();
    
    // Actualizar la lista visual
    updateScheduleList();
    
    // Limpiar selección
    timeSelect.value = '';
}

function removeSchedule(time) {
    scheduledBackups = scheduledBackups.filter(backup => backup !== time);
    updateScheduleList();
}

function updateScheduleList() {
    const scheduleList = document.getElementById('scheduleList');
    
    if (scheduledBackups.length === 0) {
        scheduleList.innerHTML = '<p style="text-align: center; color: #6c757d; font-style: italic; margin: 20px 0;">No hay horarios programados</p>';
        return;
    }
    
    scheduleList.innerHTML = scheduledBackups.map(time => `
        <div class="schedule-item">
            <span class="schedule-time">${time}</span>
            <button class="remove-schedule" onclick="removeSchedule('${time}')" title="Eliminar horario">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function saveBackupSchedule() {
    if (scheduledBackups.length === 0) {
        alert('⚠️ No hay horarios programados para guardar');
        return;
    }
    
    // Simular guardado
    alert(`✅ Configuración guardada exitosamente\n\nHorarios programados:\n${scheduledBackups.join('\n')}\n\nLos respaldos se ejecutarán automáticamente en los horarios especificados.`);
    closeBackupModal();
}

function backupNow() {
    // Simular respaldo inmediato
    if (confirm('🔄 ¿Deseas crear un respaldo completo del sistema ahora?\n\nEste proceso puede tomar varios minutos.')) {
        // Simular proceso
        alert('🔄 Iniciando respaldo...\n\nEste es un mensaje de demostración.\nEn la implementación real se mostraría una barra de progreso.');
        
        setTimeout(() => {
            alert('✅ Respaldo completado exitosamente\n\nFecha: ' + new Date().toLocaleString('es-ES') + '\nUbicación: /database/backups/');
        }, 2000);
    }
}

// Función para actualizar el botón según el estado
function updateActivityButton() {
    const button = document.getElementById('activity-toggle-btn');
    
    if (systemInfo.activitiesActive) {
        // Estado: Actividades activas - Mostrar botón para terminar
        button.textContent = 'Termino de Actividades';
        button.className = 'action-btn terminate-btn';
    } else {
        // Estado: Actividades terminadas - Mostrar botón para iniciar
        button.textContent = 'Inicio de Actividades';
        button.className = 'action-btn start-btn';
    }
}





// Función para inicializar la página
function initializeConfigPage() {
    console.log('Página de configuración inicializada');
    
    // Sincronizar estado del sistema con el modo asignación
    syncSystemStateWithAssignmentMode();
    
    // Agregar animaciones de entrada
    const configContainer = document.querySelector('.config-container');
    if (configContainer) {
        configContainer.style.opacity = '0';
        configContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            configContainer.style.transition = 'all 0.6s ease';
            configContainer.style.opacity = '1';
            configContainer.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Sincronizar estado del sistema con el modo asignación
function syncSystemStateWithAssignmentMode() {
    const assignmentModeActive = isAssignmentMode();
    
    // Si el modo asignación está activo, las actividades deben estar inactivas
    if (assignmentModeActive) {
        systemInfo.activitiesActive = false;
    }
    
    // Actualizar el botón según el estado sincronizado
    updateActivityButton();
    
    // Mostrar información del modo asignación si está activo
    if (assignmentModeActive) {
        const activationDate = getAssignmentModeDate();
        console.log('Modo Asignación detectado, activado el:', activationDate);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeConfigPage();
    
    // Cerrar modal de terminar actividades al hacer clic fuera de él
    const terminateModal = document.getElementById('terminateModal');
    terminateModal.addEventListener('click', function(e) {
        if (e.target === terminateModal) {
            closeTerminateModal();
        }
    });
    
    // Cerrar modal de iniciar actividades al hacer clic fuera de él
    const startModal = document.getElementById('startModal');
    startModal.addEventListener('click', function(e) {
        if (e.target === startModal) {
            closeStartModal();
        }
    });
    
    // Cerrar modal de respaldos al hacer clic fuera de él
    const backupModal = document.getElementById('backupModal');
    backupModal.addEventListener('click', function(e) {
        if (e.target === backupModal) {
            closeBackupModal();
        }
    });
    
    // Cerrar modales con la tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTerminateModal();
            closeStartModal();
            closeBackupModal();
        }
    });
    
    // Permitir agregar horario con Enter
    document.getElementById('backupTimeSelect').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            addSchedule();
        }
    });
    
    // Inicializar estado del botón
    updateActivityButton();
    
    console.log('AccessLab - Configuración Admin cargada correctamente');
});