// Gestión de Usuarios - JavaScript
// Funcionalidades para la vista de gestión de usuarios

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    loadUsers();
});

// === FUNCIONES DEL FORMULARIO ===

// Inicializar el formulario
function initializeForm() {
    const form = document.getElementById('usuarioForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Manejar el envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    handleSaveButton();
}

// Manejar clic en botón guardar/actualizar
function handleSaveButton() {
    const formData = getFormData();
    const isEditMode = document.getElementById('editMode').value === 'true';
    
    if (validateForm(formData)) {
        if (isEditMode) {
            updateUser(formData);
        } else {
            createUser(formData);
        }
    }
}

// Obtener datos del formulario
function getFormData() {
    return {
        id: document.getElementById('editingUserId').value,
        nombre: document.getElementById('nombreUsuario').value.trim(),
        carrera: document.getElementById('carreraUsuario').value,
        rol: document.getElementById('rolUsuario').value,
        password: document.getElementById('passwordUsuario').value
    };
}

// Validar formulario
function validateForm(data) {
    const isEditMode = document.getElementById('editMode').value === 'true';
    
    if (!data.nombre) {
        showAlert('Por favor ingresa el nombre del usuario', 'error');
        return false;
    }
    
    // Validación de carrera: obligatoria en modo crear, opcional en modo editar
    if (!isEditMode && !data.carrera) {
        showAlert('Por favor selecciona una carrera', 'error');
        return false;
    }
    
    if (!data.rol) {
        showAlert('Por favor selecciona un rol', 'error');
        return false;
    }
    
    // Validación de contraseña: obligatoria en modo crear, opcional en modo editar
    if (isEditMode) {
        // En modo edición, validar solo si se proporciona una nueva contraseña
        if (data.password && data.password.length < 6) {
            showAlert('Si proporcionas una nueva contraseña, debe tener al menos 6 caracteres', 'error');
            return false;
        }
    } else {
        // En modo crear, la contraseña es obligatoria
        if (!data.password || data.password.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
            return false;
        }
    }
    
    return true;
}

// Crear usuario
function createUser(userData) {
    // Simular creación de usuario (aquí iría la llamada al backend)
    console.log('Creando usuario:', userData);
    
    // Asignar ID único al usuario
    userData.id = generateUserId();
    
    // Mostrar mensaje de éxito
    showAlert('Usuario creado exitosamente', 'success');
    
    // Limpiar formulario y resetear modo
    resetFormToCreateMode();
    
    // Recargar tabla (simulado)
    addUserToTable(userData);
}

// Actualizar usuario
function updateUser(userData) {
    // Preparar mensaje de actualización
    let updateMessage = `Usuario "${userData.nombre}" actualizado`;
    let changesArray = [];
    
    // Encontrar y actualizar la fila en la tabla
    const userId = userData.id;
    const userRow = findUserRowById(userId);
    
    if (userRow) {
        // Verificar qué cambios se realizaron
        const oldData = extractUserDataFromRow(userRow);
        
        // Preparar datos actualizados manteniendo valores originales si están vacíos
        const updatedData = { ...userData };
        
        if (oldData.nombre !== userData.nombre) {
            changesArray.push('nombre');
        }
        
        // Solo actualizar carrera si se proporcionó un nuevo valor
        if (userData.carrera && userData.carrera.trim() !== '') {
            if (getCarreraAbrev(oldData.carrera) !== getCarreraAbrev(userData.carrera)) {
                changesArray.push('carrera');
            }
        } else {
            // Mantener carrera original si está vacía
            updatedData.carrera = oldData.carrera;
        }
        
        if (oldData.rol !== userData.rol) {
            changesArray.push('rol');
        }
        
        if (userData.password && userData.password.trim() !== '') {
            changesArray.push('contraseña');
        }
        
        // Actualizar la fila con los nuevos datos
        updateUserRow(userRow, updatedData);
        
        // Mostrar mensaje específico de cambios
        if (changesArray.length > 0) {
            updateMessage += `. Campos modificados: ${changesArray.join(', ')}`;
        }
        
        // Simular actualización de usuario (aquí iría la llamada al backend)
        console.log('Actualizando usuario:', updatedData);
        console.log('Cambios realizados:', changesArray);
        
        showAlert(updateMessage, 'success');
    } else {
        showAlert('Error: No se pudo encontrar el usuario', 'error');
    }
    
    // Resetear formulario a modo crear
    resetFormToCreateMode();
}

// === FUNCIONES DE LA TABLA ===

// Cargar usuarios (simulado)
function loadUsers() {
    // Aquí cargarías los usuarios desde el backend
    console.log('Cargando usuarios...');
}

// Agregar usuario a la tabla
function addUserToTable(userData) {
    const tableBody = document.getElementById('usuariosTableBody');
    const newRow = createUserRow(userData);
    
    // Insertar al inicio de la tabla
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // Agregar efecto de aparición
    newRow.style.opacity = '0';
    setTimeout(() => {
        newRow.style.transition = 'opacity 0.5s ease';
        newRow.style.opacity = '1';
    }, 100);
}

// Crear fila de usuario
function createUserRow(userData) {
    const row = document.createElement('tr');
    row.dataset.userId = userData.id; // Agregar ID como data attribute
    
    row.innerHTML = `
        <td class="usuario-name">${userData.nombre}</td>
        <td class="carrera-name">${getCarreraAbrev(userData.carrera)}</td>
        <td class="rol-badge">
            <span class="rol-${userData.rol.toLowerCase()}">${userData.rol}</span>
        </td>
        <td class="password-field">*******</td>
        <td class="acciones-cell">
            <button class="action-btn edit-btn" title="Editar" onclick="editUser(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn toggle-btn" title="Activar/Desactivar Usuario" onclick="toggleUserStatus(this)">
                <i class="fas fa-power-off"></i>
            </button>
            <button class="action-btn assign-btn" title="Asignar/Ver Laboratorios" onclick="manageUserLabs(this)">
                <i class="fas fa-calendar-alt"></i>
            </button>
        </td>
    `;
    
    // Configurar estado inicial del usuario (activo por defecto)
    const toggleBtn = row.querySelector('.toggle-btn');
    const toggleIcon = toggleBtn.querySelector('i');
    
    // Por defecto los usuarios nuevos están activos
    toggleIcon.style.color = '#28a745'; // Verde para activo
    toggleBtn.title = 'Desactivar Usuario';
    
    return row;
}

// Obtener abreviación de carrera
function getCarreraAbrev(carrera) {
    const carreras = {
        'Tecnologías de la Información': 'TI',
        'Ingeniería en Mecatrónica': 'IM',
        'Ingeniería Industrial': 'II',
        'Gestión Administrativa': 'GA',
        'Tecnologías de la Construcción': 'TC'
    };
    return carreras[carrera] || carrera;
}

// === ACCIONES DE USUARIO ===

// Editar usuario
function editUser(button) {
    const row = button.closest('tr');
    const userData = extractUserDataFromRow(row);
    
    // Cambiar formulario a modo edición
    setFormToEditMode(userData);
    
    // Scroll suave al formulario
    document.querySelector('.formulario-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    showAlert(`Editando usuario: ${userData.nombre}`, 'info');
}

// Activar/Desactivar usuario
function toggleUserStatus(button) {
    const row = button.closest('tr');
    const nombre = row.querySelector('.usuario-name').textContent;
    const userId = row.dataset.userId;
    
    // Verificar el estado actual del usuario
    const isActive = !row.classList.contains('user-inactive');
    const action = isActive ? 'desactivar' : 'activar';
    const newStatus = isActive ? 'inactivo' : 'activo';
    
    if (confirm(`¿Deseas ${action} al usuario "${nombre}"?\n\nUn usuario ${newStatus === 'inactivo' ? 'inactivo no podrá acceder al sistema' : 'activo podrá acceder normalmente al sistema'}.`)) {
        // Cambiar estado visual del usuario
        if (isActive) {
            row.classList.add('user-inactive');
            button.querySelector('i').style.color = '#dc3545'; // Rojo para inactivo
            button.title = 'Activar Usuario';
        } else {
            row.classList.remove('user-inactive');
            button.querySelector('i').style.color = '#28a745'; // Verde para activo
            button.title = 'Desactivar Usuario';
        }
        
        // Aquí enviarías el cambio de estado al backend
        console.log(`Usuario ${nombre} (${userId}) cambiado a estado: ${newStatus}`);
        
        showAlert(`Usuario ${nombre} ${action === 'desactivar' ? 'desactivado' : 'activado'} exitosamente`, 'success');
    }
}

// Gestionar laboratorios del usuario (asignar/visualizar)
function manageUserLabs(button) {
    const row = button.closest('tr');
    const nombre = row.querySelector('.usuario-name').textContent;
    const rolElement = row.querySelector('.rol-badge span');
    const rol = rolElement.textContent;
    const userId = row.dataset.userId;
    
    // Determinar si es temporada de asignaciones (simulado)
    const isAssignmentSeason = checkIfAssignmentSeason();
    
    if (rol.toLowerCase() === 'maestro') {
        if (isAssignmentSeason) {
            showAssignLabsModal(nombre, userId);
        } else {
            showViewLabsModal(nombre, userId);
        }
    } else {
        showAlert('Esta función solo está disponible para usuarios con rol de Maestro', 'warning');
    }
}

// Verificar si es temporada de asignaciones (función simulada)
function checkIfAssignmentSeason() {
    // En una implementación real, esto consultaría al backend
    // Por ahora simulamos que siempre es temporada de asignación
    return true;
}

// Mostrar modal para asignar laboratorios
function showAssignLabsModal(nombre, userId) {
    showLabModal(
        'Asignar Laboratorios y Horarios',
        nombre,
        'asignar',
        `Esta función permite asignar laboratorios y horarios específicos al profesor <strong>${nombre}</strong> durante la temporada de asignaciones.<br><br>
        <strong>Funcionalidades que incluirá:</strong><br>
        • Selección de laboratorios disponibles<br>
        • Configuración de horarios por día<br>
        • Gestión de materias por laboratorio<br>
        • Validación de conflictos de horarios<br>
        • Guardado automático de asignaciones`
    );
}

// Mostrar modal para visualizar laboratorios asignados
function showViewLabsModal(nombre, userId) {
    showLabModal(
        'Laboratorios y Horarios Asignados',
        nombre,
        'visualizar',
        `Esta función muestra todos los laboratorios y horarios asignados al profesor <strong>${nombre}</strong>.<br><br>
        <strong>Información que mostrará:</strong><br>
        • Laboratorios asignados con sus nombres<br>
        • Horarios detallados por día de la semana<br>
        • Materias impartidas en cada laboratorio<br>
        • Duración de las sesiones<br>
        • Historial de asignaciones anteriores`
    );
}

// Función genérica para mostrar modal de laboratorios
function showLabModal(title, nombre, action, description) {
    // Crear modal dinámicamente
    const modalHtml = `
        <div class="modal fade" id="labModal" tabindex="-1" aria-labelledby="labModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="labModalLabel">
                            <i class="fas fa-calendar-alt me-2"></i>${title}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info mb-3">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Función en Desarrollo</strong>
                        </div>
                        <div class="user-info mb-3">
                            <h6><i class="fas fa-user me-2"></i>Profesor: ${nombre}</h6>
                        </div>
                        <div class="function-description">
                            <p>${description}</p>
                        </div>
                        <div class="development-note mt-4 p-3 bg-light rounded">
                            <h6><i class="fas fa-code me-2"></i>Estado de Desarrollo:</h6>
                            <p class="mb-0">Esta funcionalidad está siendo desarrollada y estará disponible en próximas versiones del sistema.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cerrar
                        </button>
                        <button type="button" class="btn btn-primary" disabled>
                            <i class="fas fa-${action === 'asignar' ? 'plus' : 'eye'} me-2"></i>
                            ${action === 'asignar' ? 'Asignar Laboratorios' : 'Ver Asignaciones'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente si lo hay
    const existingModal = document.getElementById('labModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('labModal'));
    modal.show();
    
    // Limpiar modal al cerrarse
    document.getElementById('labModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// === FUNCIONES DEL FORMULARIO ===

// Alternar visibilidad de contraseña
function togglePassword() {
    const passwordInput = document.getElementById('passwordUsuario');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Limpiar formulario
function limpiarFormulario() {
    const isEditMode = document.getElementById('editMode').value === 'true';
    
    document.getElementById('usuarioForm').reset();
    
    // Resetear el toggle de contraseña
    const passwordInput = document.getElementById('passwordUsuario');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
    
    // Mantener placeholder correcto según el modo
    if (isEditMode) {
        passwordInput.placeholder = 'Dejar vacío para mantener la contraseña actual';
    } else {
        passwordInput.placeholder = 'Ingresa la contraseña';
    }
    
    showAlert('Formulario limpiado', 'info');
}

// Cancelar formulario
function cancelarFormulario() {
    const isEditMode = document.getElementById('editMode').value === 'true';
    const message = isEditMode ? 
        '¿Estás seguro de que deseas cancelar la edición? Se perderán los cambios.' :
        '¿Estás seguro de que deseas cancelar? Se perderán los datos ingresados.';
        
    if (confirm(message)) {
        resetFormToCreateMode();
    }
}

// === FUNCIONES DE MODO DEL FORMULARIO ===

// Cambiar formulario a modo edición
function setFormToEditMode(userData) {
    // Cambiar título y estado
    document.getElementById('formTitle').textContent = 'Editar Usuario';
    document.getElementById('editMode').value = 'true';
    document.getElementById('editingUserId').value = userData.id;
    document.getElementById('saveButton').textContent = 'Actualizar';
    
    // Llenar campos con datos del usuario
    document.getElementById('nombreUsuario').value = userData.nombre;
    document.getElementById('rolUsuario').value = userData.rol;
    
    // Configurar campo de carrera para edición (vacío por defecto)
    const carreraInput = document.getElementById('carreraUsuario');
    carreraInput.value = ''; // Limpiar campo para permitir mantener valor actual
    carreraInput.placeholder = `Dejar vacío para mantener: ${userData.carrera}`;
    
    // Configurar campo de contraseña para edición
    const passwordInput = document.getElementById('passwordUsuario');
    passwordInput.value = ''; // Limpiar campo de contraseña
    passwordInput.placeholder = 'Dejar vacío para mantener la contraseña actual';
    
    // Quitar validación HTML5 requerida para campos opcionales en modo edición
    carreraInput.removeAttribute('required');
    passwordInput.removeAttribute('required');
    
    // Agregar clase visual para modo edición
    const formCard = document.querySelector('.form-card');
    formCard.classList.add('edit-mode');
    
    // Mostrar ayuda sobre contraseña y carrera
    addPasswordEditHelp();
    addCarreraEditHelp();
}

// Resetear formulario a modo crear
function resetFormToCreateMode() {
    // Cambiar título y estado
    document.getElementById('formTitle').textContent = 'Crear Usuario';
    document.getElementById('editMode').value = 'false';
    document.getElementById('editingUserId').value = '';
    document.getElementById('saveButton').textContent = 'Guardar';
    
    // Limpiar formulario
    document.getElementById('usuarioForm').reset();
    
    // Resetear placeholder de contraseña
    const passwordInput = document.getElementById('passwordUsuario');
    passwordInput.placeholder = 'Ingresa la contraseña';
    
    // Resetear placeholder de carrera
    const carreraInput = document.getElementById('carreraUsuario');
    carreraInput.placeholder = 'Ingresa la carrera del usuario';
    
    // Restaurar validación HTML5 requerida para modo crear
    carreraInput.setAttribute('required', '');
    passwordInput.setAttribute('required', '');
    
    // Resetear toggle de contraseña
    const toggleIcon = document.getElementById('passwordToggleIcon');
    passwordInput.type = 'password';
    toggleIcon.classList.remove('fa-eye-slash');
    toggleIcon.classList.add('fa-eye');
    
    // Remover clase visual de modo edición
    const formCard = document.querySelector('.form-card');
    formCard.classList.remove('edit-mode');
    
    // Remover ayuda de contraseña y carrera si existe
    removePasswordEditHelp();
    removeCarreraEditHelp();
}

// Extraer datos del usuario de una fila de la tabla
function extractUserDataFromRow(row) {
    const userId = row.dataset.userId || generateUserId();
    row.dataset.userId = userId; // Asegurar que la fila tenga ID
    
    return {
        id: userId,
        nombre: row.querySelector('.usuario-name').textContent,
        carrera: row.querySelector('.carrera-name').textContent,
        rol: row.querySelector('.rol-badge span').textContent,
        password: '' // No extraemos la contraseña por seguridad
    };
}

// Encontrar fila de usuario por ID
function findUserRowById(userId) {
    const rows = document.querySelectorAll('#usuariosTableBody tr');
    return Array.from(rows).find(row => row.dataset.userId === userId);
}

// Actualizar fila de usuario en la tabla
function updateUserRow(row, userData) {
    row.querySelector('.usuario-name').textContent = userData.nombre;
    row.querySelector('.carrera-name').textContent = getCarreraAbrev(userData.carrera);
    
    const rolSpan = row.querySelector('.rol-badge span');
    rolSpan.textContent = userData.rol;
    rolSpan.className = `rol-${userData.rol.toLowerCase()}`;
    
    // Si se actualizó la contraseña, mostrar indicador temporal
    if (userData.password && userData.password.trim() !== '') {
        const passwordCell = row.querySelector('.password-field');
        passwordCell.textContent = '••••••• ✓';
        passwordCell.style.color = '#28a745';
        
        setTimeout(() => {
            passwordCell.textContent = '*******';
            passwordCell.style.color = '#6c757d';
        }, 3000);
    }
    
    // Agregar efecto visual de actualización
    row.style.backgroundColor = '#d4edda';
    row.style.transform = 'scale(1.02)';
    
    setTimeout(() => {
        row.style.backgroundColor = '';
        row.style.transform = 'scale(1)';
        row.style.transition = 'all 0.5s ease';
    }, 1000);
}

// Obtener nombre completo de carrera desde abreviación
function getCarreraCompleta(abreviacion) {
    const carreras = {
        'TI': 'Tecnologías de la Información',
        'IM': 'Ingeniería en Mecatrónica', 
        'II': 'Ingeniería Industrial',
        'GA': 'Gestión Administrativa',
        'TC': 'Tecnologías de la Construcción'
    };
    return carreras[abreviacion] || abreviacion;
}

// Generar ID único para usuario
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Agregar ayuda sobre contraseña en modo edición
function addPasswordEditHelp() {
    // Verificar si ya existe la ayuda
    if (document.getElementById('passwordEditHelp')) {
        return;
    }
    
    const passwordGroup = document.getElementById('passwordUsuario').closest('.form-group');
    const helpText = document.createElement('small');
    helpText.id = 'passwordEditHelp';
    helpText.className = 'password-help-text';
    helpText.innerHTML = '<i class="fas fa-info-circle"></i> Deja el campo vacío si no deseas cambiar la contraseña';
    
    passwordGroup.appendChild(helpText);
}

// Remover ayuda sobre contraseña
function removePasswordEditHelp() {
    const helpElement = document.getElementById('passwordEditHelp');
    if (helpElement) {
        helpElement.remove();
    }
}

// Agregar ayuda sobre carrera en modo edición
function addCarreraEditHelp() {
    // Verificar si ya existe la ayuda
    if (document.getElementById('carreraEditHelp')) {
        return;
    }
    
    const carreraGroup = document.getElementById('carreraUsuario').closest('.form-group');
    const helpText = document.createElement('small');
    helpText.id = 'carreraEditHelp';
    helpText.className = 'carrera-help-text';
    helpText.innerHTML = '<i class="fas fa-info-circle"></i> Deja el campo vacío si no deseas cambiar la carrera';
    
    carreraGroup.appendChild(helpText);
}

// Remover ayuda sobre carrera
function removeCarreraEditHelp() {
    const helpElement = document.getElementById('carreraEditHelp');
    if (helpElement) {
        helpElement.remove();
    }
}

// === FUNCIONES AUXILIARES ===

// Generar contraseña aleatoria
function generateRandomPassword(length = 8) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
}

// Mostrar alertas
function showAlert(message, type = 'info') {
    // Crear elemento de alerta
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Estilos de la alerta
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        transform: translateX(100%);
    `;
    
    // Colores según el tipo
    switch(type) {
        case 'success':
            alert.style.background = '#28a745';
            break;
        case 'error':
            alert.style.background = '#dc3545';
            break;
        case 'warning':
            alert.style.background = '#ffc107';
            alert.style.color = '#212529';
            break;
        case 'info':
        default:
            alert.style.background = '#17a2b8';
            break;
    }
    
    // Agregar al DOM
    document.body.appendChild(alert);
    
    // Animación de entrada
    setTimeout(() => {
        alert.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        }, 300);
    }, 3000);
}

// === EVENTOS ADICIONALES ===

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const nombreInput = document.getElementById('nombreUsuario');
    const passwordInput = document.getElementById('passwordUsuario');
    
    if (nombreInput) {
        nombreInput.addEventListener('input', function() {
            // Remover caracteres especiales del nombre
            this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordStrengthIndicator(strength);
        });
    }
});

// Calcular fortaleza de contraseña
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    return strength;
}

// Actualizar indicador de fortaleza
function updatePasswordStrengthIndicator(strength) {
    // Esta función se puede expandir para mostrar un indicador visual
    console.log('Password strength:', strength);
}