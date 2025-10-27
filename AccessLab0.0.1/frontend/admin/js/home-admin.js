// HomeAdmin - AccessLab JavaScript

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
            showDevelopmentModal('Gestión de Solicitudes');
            break;
        case 'configuracion':
            window.location.href = 'ConfiguracionAdmin.html';
            break;
        default:
            showDevelopmentModal('Módulo');
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

// Animación de entrada
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});