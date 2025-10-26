/**
 * Utilidades de navegación para AccessLab
 * Funciones comunes para navegación entre páginas
 */

// Función universal para regresar a la página anterior
function goBack() {
    try {
        // Agregar efecto visual al botón
        if (typeof event !== 'undefined' && event.target) {
            const backButton = event.target.closest('button');
            if (backButton) {
                backButton.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    backButton.style.transform = 'scale(1)';
                }, 100);
            }
        }
        
        // Verificar si hay historial disponible
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Si no hay historial, determinar la página de inicio según el rol
            const currentPath = window.location.pathname;
            if (currentPath.includes('/admin/')) {
                window.location.href = 'HomeAdmin.html';
            } else if (currentPath.includes('/maestro/')) {
                window.location.href = 'HomeMaestro.html';
            } else if (currentPath.includes('/tecnico/')) {
                window.location.href = 'HomeTecnico.html';
            } else {
                // Fallback genérico
                window.location.href = '../shared/login.html';
            }
        }
    } catch (error) {
        // En caso de error, navegar según el contexto
        console.log('Error al regresar, navegando al inicio:', error);
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin/')) {
            window.location.href = 'HomeAdmin.html';
        } else {
            window.location.href = '../shared/login.html';
        }
    }
}

// Función universal para ir al home según el rol
function goToHome() {
    try {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin/')) {
            window.location.href = 'HomeAdmin.html';
        } else if (currentPath.includes('/maestro/')) {
            window.location.href = 'HomeMaestro.html';
        } else if (currentPath.includes('/tecnico/')) {
            window.location.href = 'HomeTecnico.html';
        } else {
            // Fallback al login si no se puede determinar el rol
            window.location.href = '../shared/login.html';
        }
    } catch (error) {
        console.log('Error al navegar al home:', error);
        window.location.href = '../login.html';
    }
}

// Función de navegación genérica (mantener compatibilidad)
function navigateTo(section) {
    switch(section) {
        case 'home':
            goToHome();
            break;
        case 'back':
            goBack();
            break;
        default:
            console.log(`Navegando a: ${section}`);
    }
}

// Función de logout universal
function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        try {
            // Limpiar datos de sesión
            sessionStorage.clear();
            localStorage.removeItem('userSession');
            localStorage.removeItem('currentUser');
            
            // Redirigir al login
            window.location.href = 'login.html';
        } catch (error) {
            console.log('Error durante logout:', error);
            window.location.href = 'login.html';
        }
    }
}