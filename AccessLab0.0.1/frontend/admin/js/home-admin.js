// HomeAdmin - AccessLab JavaScript

// === CONSTANTES Y CONFIGURACIÓN ===
const ASSIGNMENT_MODE_KEY = 'accesslab_assignment_mode';
const ASSIGNMENT_MODE_DATE_KEY = 'accesslab_assignment_mode_date';

// === FUNCIONES DE MODO ASIGNACIÓN ===

// Verificar si está en modo asignación
function isAssignmentMode() {
    return localStorage.getItem(ASSIGNMENT_MODE_KEY) === 'true';
}

// Activar modo asignación
function enableAssignmentMode() {
    localStorage.setItem(ASSIGNMENT_MODE_KEY, 'true');
    localStorage.setItem(ASSIGNMENT_MODE_DATE_KEY, new Date().toISOString());
    console.log('Modo Asignación activado');
}

// Desactivar modo asignación
function disableAssignmentMode() {
    localStorage.removeItem(ASSIGNMENT_MODE_KEY);
    localStorage.removeItem(ASSIGNMENT_MODE_DATE_KEY);
    console.log('Modo Asignación desactivado');
}

// Obtener fecha de activación del modo asignación
function getAssignmentModeDate() {
    const dateStr = localStorage.getItem(ASSIGNMENT_MODE_DATE_KEY);
    return dateStr ? new Date(dateStr) : null;
}

// Función para navegar a diferentes secciones
function navigateTo(section) {
    switch(section) {
        case 'bitacoras':
            window.location.href = 'Bitacoras.html';
            break;
        case 'laboratorios':
            window.location.href = 'GestiónDeLaboratorios.html';
            break;
        case 'usuarios':
            window.location.href = 'GestionUsuarios.html';
            break;
        case 'avisos':
            window.location.href = 'TablonAvisos.html';
            break;
        case 'solicitudes':
            window.location.href = 'solicitudes.html';
            break;
        case 'configuracion':
            window.location.href = 'ConfiguracionAdmin.html';
            break;
        case 'asignar-laboratorios':
            window.location.href = 'AsignarLaboratorios.html';
            break;
        default:
            showDevelopmentModal('Módulo');
    }
}

// === FUNCIONES DE INTEGRACIÓN CON CONFIGURACIÓN ===

// Esta función será llamada desde configuración cuando se active el modo asignación
window.activateAssignmentModeFromConfig = function() {
    enableAssignmentMode();
    
    // Mostrar notificación de que el modo se activó
    setTimeout(() => {
        if (confirm('El Modo de Asignación ha sido activado.\n¿Deseas ir al Dashboard para ver los cambios?')) {
            window.location.href = 'HomeAdmin.html';
        }
    }, 500);
}

// Esta función será llamada desde configuración cuando se desactive el modo asignación  
window.deactivateAssignmentModeFromConfig = function() {
    disableAssignmentMode();
    
    // Mostrar notificación de que el modo se desactivó
    setTimeout(() => {
        if (confirm('El Modo de Asignación ha sido desactivado.\n¿Deseas ir al Dashboard para ver los cambios?')) {
            window.location.href = 'HomeAdmin.html';
        }
    }, 500);
}

// Función para ir a configuración (reemplaza el modal de salida)
function goToConfiguration() {
    if (confirm('Para cambiar el estado del modo asignación, ve a la sección de Configuración.\n\n¿Deseas ir ahora?')) {
        window.location.href = 'ConfiguracionAdmin.html';
    }
}



// Función para cerrar sesión
function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        window.location.href = '../../shared/login.html';
    }
}

// Función para mostrar modal de desarrollo
function showDevelopmentModal(moduleName) {
    const modalHtml = `
        <div class="modal fade" id="developmentModal" tabindex="-1" aria-labelledby="developmentModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content development-modal">
                    <div class="modal-header">
                        <h5 class="modal-title" id="developmentModalLabel">
                            <i class="fas fa-tools me-2"></i>Función en Desarrollo
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="development-icon mb-4">
                            <i class="fas fa-code fa-4x text-primary"></i>
                        </div>
                        <h6 class="development-title mb-3">${moduleName}</h6>
                        <p class="development-description text-muted">
                            Esta funcionalidad está actualmente en desarrollo y estará disponible en futuras versiones del sistema.
                        </p>
                        <div class="alert alert-info mb-3">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>AccessLab v0.0.1</strong><br>
                            <small>Gracias por tu paciencia mientras trabajamos en mejorar la plataforma.</small>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                            <i class="fas fa-check me-2"></i>Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente si lo hay
    const existingModal = document.getElementById('developmentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('developmentModal'));
    modal.show();
    
    // Limpiar modal cuando se cierre
    document.getElementById('developmentModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// === INICIALIZACIÓN Y CONTROL DE VISTA ===

// Inicializar dashboard según el modo activo
function initializeDashboard() {
    const isAssignment = isAssignmentMode();
    const normalCards = document.getElementById('normalModeCards');
    const assignmentCards = document.getElementById('assignmentModeCards');
    const assignmentIndicator = document.getElementById('assignmentModeIndicator');
    
    if (isAssignment) {
        // Modo Asignación: mostrar solo cards limitadas
        if (normalCards) normalCards.style.display = 'none';
        if (assignmentCards) assignmentCards.style.display = 'block';
        if (assignmentIndicator) assignmentIndicator.style.display = 'flex';
        
        // Actualizar título del header
        updateHeaderForAssignmentMode();
    } else {
        // Modo Normal: mostrar todas las cards
        if (normalCards) normalCards.style.display = 'block';
        if (assignmentCards) assignmentCards.style.display = 'none';
        if (assignmentIndicator) assignmentIndicator.style.display = 'none';
    }
}

// Actualizar header para modo asignación
function updateHeaderForAssignmentMode() {
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText && isAssignmentMode()) {
        const originalText = welcomeText.textContent;
        if (!originalText.includes('Modo Asignación')) {
            welcomeText.innerHTML = `${originalText} <span class="assignment-badge">- Modo Asignación</span>`;
        }
    }
}

// Animación de entrada
function animateCards() {
    const cards = document.querySelectorAll('.dashboard-card:not([style*="display: none"])');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150 + 100);
    });
}

// Evento de carga del DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dashboard según el modo
    initializeDashboard();
    
    // Animar cards después de inicializar
    setTimeout(() => {
        animateCards();
    }, 200);
    
    // Debug: mostrar estado actual en consola
    console.log('Dashboard initialized - Assignment Mode:', isAssignmentMode());
    if (isAssignmentMode()) {
        const date = getAssignmentModeDate();
        console.log('Assignment Mode activated on:', date);
    }
});