// HomeAdmin - AccessLab JavaScript

// Función para navegar a diferentes secciones
function navigateTo(section) {
    switch(section) {
        case 'bitacoras':
            window.location.href = 'Bitacoras.html';
            break;
        case 'laboratorios':
            alert('Navegando a Gestión de Laboratorios...');
            break;
        case 'usuarios':
            alert('Navegando a Gestión de Usuarios...');
            break;
        case 'avisos':
            alert('Navegando a Tablón de Avisos...');
            break;
        case 'solicitudes':
            alert('Navegando a Solicitudes...');
            break;
        case 'configuracion':
            window.location.href = 'ConfiguracionAdmin.html';
            break;
        default:
            alert('Sección en desarrollo...');
    }
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        window.location.href = '../../shared/login.html';
    }
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