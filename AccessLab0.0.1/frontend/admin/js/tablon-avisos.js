// ======================================
// TABLÓN DE AVISOS - JAVASCRIPT
// ======================================

// Datos de prueba
let noticesData = [
    {
        id: 1,
        author: "Dr. Martinez",
        role: "Director",
        date: "2025-10-27 09:30",
        title: "Mantenimiento programado del laboratorio de química",
        content: "Se informa que el próximo viernes 1 de noviembre se realizará mantenimiento preventivo en el laboratorio de química. Las clases programadas para ese día se reprogramarán. Por favor revisar el nuevo horario en el tablón físico.",
        comments: [
            {
                id: 1,
                author: "Mtro. García",
                role: "Maestro",
                date: "2025-10-27 10:15",
                content: "Perfecto, ya informé a mis grupos. ¿El laboratorio de física también estará en mantenimiento?"
            },
            {
                id: 2,
                author: "Téc. López",
                role: "Técnico",
                date: "2025-10-27 11:00",
                content: "Solo el laboratorio de química. El de física permanecerá abierto normalmente."
            }
        ],
        type: "normal"
    },
    {
        id: 2,
        author: "Subdirectora Hernández",
        role: "Subdirectora",
        date: "2025-10-26 14:20",
        title: "Nueva normativa para el uso de equipos especializados",
        content: "A partir del lunes 4 de noviembre entra en vigor la nueva normativa para el uso de equipos especializados. Todos los usuarios deben completar el curso de capacitación antes de usar los equipos. El material de estudio está disponible en la plataforma digital.",
        comments: [
            {
                id: 3,
                author: "Mtra. Rodríguez",
                role: "Maestro", 
                date: "2025-10-26 15:45",
                content: "¿Dónde exactamente puedo acceder al material de capacitación? No lo encuentro en la plataforma."
            }
        ],
        type: "highlighted"
    },
    {
        id: 3,
        author: "Téc. Morales",
        role: "Técnico",
        date: "2025-10-25 16:10",
        title: "URGENTE: Falla en sistema de ventilación Lab 3",
        content: "Se reporta falla en el sistema de ventilación del laboratorio 3. Por seguridad, el laboratorio permanece CERRADO hasta nueva orden. Las prácticas programadas se realizarán en el laboratorio 2. Disculpen las molestias.",
        comments: [],
        type: "urgent"
    }
];

// Simulación del usuario actual
let currentUser = {
    name: "Admin Sistema",
    role: "Director", // Puede ser: "Director", "Subdirector", "Técnico", "Maestro"
    initials: "AS"
};

// ======================================
// INICIALIZACIÓN
// ======================================
document.addEventListener('DOMContentLoaded', function() {
    renderNotices();
    setupEventListeners();
    updateUserInterface();
});

// ======================================
// RENDERIZADO DE AVISOS
// ======================================
function renderNotices() {
    const container = document.getElementById('notices-container');
    container.innerHTML = '';

    if (noticesData.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No hay avisos publicados</h5>
                <p class="text-muted">Sé el primero en publicar un aviso</p>
            </div>
        `;
        return;
    }

    // Ordenar avisos por fecha (más recientes primero)
    const sortedNotices = [...noticesData].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedNotices.forEach(notice => {
        const noticeHTML = createNoticeHTML(notice);
        container.appendChild(noticeHTML);
    });
}

function createNoticeHTML(notice) {
    const noticeDiv = document.createElement('div');
    noticeDiv.className = `notice-card ${notice.type}`;
    noticeDiv.setAttribute('data-notice-id', notice.id);

    const canDelete = currentUser.role === 'Director' || currentUser.role === 'Subdirector' || 
                     (currentUser.name === notice.author);

    noticeDiv.innerHTML = `
        <div class="notice-header">
            <div class="notice-user-info">
                <div class="user-avatar">${getInitials(notice.author)}</div>
                <div class="user-details">
                    <h6>${notice.author}</h6>
                    <small class="text-muted">${notice.role} • ${formatDate(notice.date)}</small>
                </div>
            </div>
            <div class="notice-actions-header">
                ${canDelete ? `
                    <button class="btn-delete-notice" onclick="deleteNotice(${notice.id})" title="Eliminar aviso">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </div>
        
        <div class="notice-content">
            <h6 class="fw-bold mb-2">${notice.title}</h6>
            <p>${notice.content}</p>
        </div>
        
        <div class="comments-section">
            <button class="comments-toggle" data-bs-toggle="collapse" data-bs-target="#comments-${notice.id}" 
                    aria-expanded="false" onclick="toggleComments(${notice.id})">
                <i class="fas fa-comments"></i> 
                ${notice.comments.length} comentario${notice.comments.length !== 1 ? 's' : ''}
                <i class="fas fa-chevron-down"></i>
            </button>
            
            <div class="collapse" id="comments-${notice.id}">
                <div class="comments-container">
                    <div id="comments-list-${notice.id}">
                        ${notice.comments.map(comment => createCommentHTML(comment)).join('')}
                    </div>
                    
                    <div class="new-comment-form">
                        <textarea class="form-control comment-input" id="comment-input-${notice.id}" 
                                placeholder="Escribe tu comentario..." rows="2"></textarea>
                        <button class="btn btn-comment" onclick="addComment(${notice.id})">
                            <i class="fas fa-paper-plane"></i> Comentar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    return noticeDiv;
}

function createCommentHTML(comment) {
    return `
        <div class="comment-item">
            <div class="comment-header">
                <div class="comment-user">
                    <div class="comment-avatar">${getInitials(comment.author)}</div>
                    <span class="comment-user-name">${comment.author}</span>
                </div>
                <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <p class="comment-text">${comment.content}</p>
        </div>
    `;
}

// ======================================
// FUNCIONES DE INTERACCIÓN
// ======================================
function setupEventListeners() {
    // Formulario de crear aviso
    const publishBtn = document.getElementById('publish-notice-btn');
    const titleInput = document.getElementById('notice-title');
    const contentInput = document.getElementById('notice-content');

    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            if (title && content) {
                createNewNotice(title, content);
                titleInput.value = '';
                contentInput.value = '';
                showNotification('Aviso publicado exitosamente', 'success');
            } else {
                showNotification('Por favor completa el título y contenido', 'error');
            }
        });
    }

    // Enter en inputs para enviar
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            if (e.target.id === 'notice-content') {
                publishBtn.click();
            } else if (e.target.classList.contains('comment-input')) {
                const noticeId = e.target.id.split('-')[2];
                addComment(parseInt(noticeId));
            }
        }
    });
}

function createNewNotice(title, content) {
    const newNotice = {
        id: Date.now(),
        author: currentUser.name,
        role: currentUser.role,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        title: title,
        content: content,
        comments: [],
        type: "normal"
    };

    noticesData.unshift(newNotice);
    renderNotices();
}

function addComment(noticeId) {
    const commentInput = document.getElementById(`comment-input-${noticeId}`);
    const commentText = commentInput.value.trim();

    if (!commentText) {
        showNotification('El comentario no puede estar vacío', 'error');
        return;
    }

    const notice = noticesData.find(n => n.id === noticeId);
    if (notice) {
        const newComment = {
            id: Date.now(),
            author: currentUser.name,
            role: currentUser.role,
            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            content: commentText
        };

        notice.comments.push(newComment);
        commentInput.value = '';
        renderNotices();
        
        // Mantener el collapse abierto
        setTimeout(() => {
            const collapseElement = document.getElementById(`comments-${noticeId}`);
            if (collapseElement) {
                collapseElement.classList.add('show');
            }
        }, 100);

        showNotification('Comentario agregado', 'success');
    }
}

function deleteNotice(noticeId) {
    const notice = noticesData.find(n => n.id === noticeId);
    if (!notice) return;

    // Modal de confirmación personalizado
    if (confirm(`¿Estás seguro de que deseas eliminar el aviso "${notice.title}"?`)) {
        noticesData = noticesData.filter(n => n.id !== noticeId);
        renderNotices();
        showNotification('Aviso eliminado', 'success');
    }
}

function toggleComments(noticeId) {
    // Bootstrap se encarga del toggle, solo actualizamos el ícono
    setTimeout(() => {
        const toggleBtn = document.querySelector(`[data-bs-target="#comments-${noticeId}"]`);
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        const icon = toggleBtn.querySelector('.fa-chevron-down');
        
        if (icon) {
            icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }, 100);
}

// ======================================
// FUNCIONES AUXILIARES
// ======================================
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return `Hoy ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 2) {
        return `Ayer ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays <= 7) {
        return `Hace ${diffDays - 1} días`;
    } else {
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function updateUserInterface() {
    // Mostrar/ocultar sección de crear aviso según el rol
    const canCreateNotice = ['Director', 'Subdirector', 'Técnico'].includes(currentUser.role);
    const createSection = document.getElementById('create-notice-section');
    
    if (createSection) {
        createSection.style.display = canCreateNotice ? 'block' : 'none';
    }

    // Actualizar información del usuario en header si es necesario
    const userInfo = document.querySelector('.user-info-header');
    if (userInfo) {
        userInfo.textContent = `${currentUser.name} (${currentUser.role})`;
    }
}

function showNotification(message, type) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ======================================
// FUNCIONES DE SIMULACIÓN PARA PRUEBAS
// ======================================
function changeUserRole(newRole) {
    currentUser.role = newRole;
    updateUserInterface();
    renderNotices();
    console.log(`Rol cambiado a: ${newRole}`);
}

// Función para probar diferentes roles (solo para desarrollo)
function simulateRoles() {
    const roles = ['Director', 'Subdirector', 'Técnico', 'Maestro'];
    let currentIndex = roles.indexOf(currentUser.role);
    currentIndex = (currentIndex + 1) % roles.length;
    changeUserRole(roles[currentIndex]);
}

// ======================================
// ESTILOS CSS DINÁMICOS
// ======================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-toast {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(style);

// Debug: Agregar función global para cambiar roles fácilmente
window.switchRole = simulateRoles;