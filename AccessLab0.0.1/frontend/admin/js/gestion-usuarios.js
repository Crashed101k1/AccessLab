// Gestión de Usuarios - JavaScript
// Funcionalidades para la vista de gestión de usuarios

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    loadUsers();
    setupTabs();
});

// Configuración simple de pestañas
function setupTabs() {
    // Asegurar estado inicial correcto
    const activosContent = document.getElementById('activosContent');
    const inactivosContent = document.getElementById('inactivosContent');
    
    if (activosContent) activosContent.style.display = 'block';
    if (inactivosContent) inactivosContent.style.display = 'none';
    
    console.log('Pestañas configuradas');
}

// switchTab se hace globalmente disponible al final del archivo

// Función simple para probar agregar usuario
function testAddUser() {
    const newUserId = 'user_' + Date.now();
    const newUserRow = `
        <tr data-user-id="${newUserId}" data-status="active">
            <td class="usuario-name">nuevo.usuario</td>
            <td class="carrera-name">TI</td>
            <td class="rol-badge">
                <span class="rol-maestro">Maestro</span>
            </td>
            <td class="password-field">*******</td>
            <td class="acciones-cell">
                <button class="action-btn edit-btn" title="Editar" onclick="editarUsuario('${newUserId}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn deactivate-btn" title="Desactivar Usuario" onclick="toggleUserStatus('${newUserId}', 'inactive')">
                    <i class="fas fa-ban"></i>
                </button>
            </td>
        </tr>
    `;
    
    const activosTable = document.getElementById('usuariosActivosTableBody');
    if (activosTable) {
        activosTable.insertAdjacentHTML('beforeend', newUserRow);
        updateUserCounts();
        console.log('Usuario de prueba agregado');
    }
}

// testAddUser se hace globalmente disponible al final del archivo

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
    // Los usuarios ya están en el HTML, solo verificamos que estén visibles
    console.log('Usuarios cargados desde HTML');
    
    // Contar usuarios para actualizar badges
    updateUserCounts();
}

function updateUserCounts() {
    const activosTable = document.getElementById('usuariosActivosTableBody');
    const inactivosTable = document.getElementById('usuariosInactivosTableBody');
    
    if (activosTable) {
        const activosCount = activosTable.querySelectorAll('tr').length;
        const activosCountElement = document.getElementById('activosCount');
        if (activosCountElement) {
            activosCountElement.textContent = activosCount;
        }
    }
    
    if (inactivosTable) {
        const inactivosCount = inactivosTable.querySelectorAll('tr').length;
        const inactivosCountElement = document.getElementById('inactivosCount');
        if (inactivosCountElement) {
            inactivosCountElement.textContent = inactivosCount;
        }
    }
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
}

// === FUNCIONES DE PESTAÑAS ===

// Cambiar entre pestañas de usuarios activos e inactivos - VERSIÓN SIMPLIFICADA
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Ocultar ambos contenidos
    const activosContent = document.getElementById('activosContent');
    const inactivosContent = document.getElementById('inactivosContent');
    
    if (activosContent) activosContent.style.display = 'none';
    if (inactivosContent) inactivosContent.style.display = 'none';
    
    // Remover active de ambos botones
    const activosTab = document.getElementById('activosTab');
    const inactivosTab = document.getElementById('inactivosTab');
    
    if (activosTab) activosTab.classList.remove('active');
    if (inactivosTab) inactivosTab.classList.remove('active');
    
    // Mostrar el contenido seleccionado
    if (tabName === 'activos') {
        if (activosContent) activosContent.style.display = 'block';
        if (activosTab) activosTab.classList.add('active');
    } else if (tabName === 'inactivos') {
        if (inactivosContent) inactivosContent.style.display = 'block';
        if (inactivosTab) inactivosTab.classList.add('active');
    }
    
    console.log('Tab switched to:', tabName);
}

// Actualizar contadores de usuarios en las pestañas
function updateTabCounts() {
    const activosRows = document.querySelectorAll('#usuariosActivosTableBody tr[data-status="active"]');
    const inactivosRows = document.querySelectorAll('#usuariosInactivosTableBody tr[data-status="inactive"]');
    
    const activosCountElement = document.getElementById('activosCount');
    const inactivosCountElement = document.getElementById('inactivosCount');
    
    if (activosCountElement) {
        activosCountElement.textContent = activosRows.length;
    }
    
    if (inactivosCountElement) {
        inactivosCountElement.textContent = inactivosRows.length;
    }
    
    console.log('Contadores actualizados - Activos:', activosRows.length, 'Inactivos:', inactivosRows.length);
}

// Cambiar estado de usuario entre activo e inactivo
function toggleUserStatus(userId, newStatus) {
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (!userRow) return;
    
    if (newStatus === 'inactive') {
        // Confirmar desactivación
        if (confirm('¿Está seguro que desea desactivar este usuario?')) {
            deactivateUser(userId);
        }
    } else {
        // Confirmar reactivación
        if (confirm('¿Está seguro que desea reactivar este usuario?')) {
            activateUser(userId);
        }
    }
}

// Desactivar usuario
function deactivateUser(userId) {
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (!userRow) return;
    
    // Obtener datos del usuario
    const userData = {
        id: userId,
        name: userRow.querySelector('.usuario-name').textContent,
        career: userRow.querySelector('.carrera-name').textContent,
        role: userRow.querySelector('.rol-badge span').textContent,
        deactivationDate: new Date().toLocaleDateString('es-ES')
    };
    
    // Remover de tabla activos
    userRow.remove();
    
    // Añadir a tabla inactivos
    addUserToInactiveTable(userData);
    
    // Actualizar contadores
    updateTabCounts();
    
    showNotification('Usuario desactivado exitosamente', 'warning');
}

// Reactivar usuario
function activateUser(userId) {
    const userRow = document.querySelector(`tr[data-user-id="${userId}"]`);
    if (!userRow) return;
    
    // Obtener datos del usuario
    const userData = {
        id: userId,
        name: userRow.querySelector('.usuario-name').textContent,
        career: userRow.querySelector('.carrera-name').textContent,
        role: userRow.querySelector('.rol-badge span').textContent
    };
    
    // Remover de tabla inactivos
    userRow.remove();
    
    // Añadir a tabla activos
    addUserToActiveTable(userData);
    
    // Actualizar contadores
    updateTabCounts();
    
    showNotification('Usuario reactivado exitosamente', 'success');
}

// Añadir usuario a tabla de activos
function addUserToActiveTable(userData) {
    const tbody = document.getElementById('usuariosActivosTableBody');
    const row = document.createElement('tr');
    row.dataset.userId = userData.id;
    row.dataset.status = 'active';
    
    row.innerHTML = `
        <td class="usuario-name">${userData.name}</td>
        <td class="carrera-name">${userData.career}</td>
        <td class="rol-badge">
            <span class="rol-${userData.role.toLowerCase()}">${userData.role}</span>
        </td>
        <td class="password-field">*******</td>
        <td class="acciones-cell">
            <button class="action-btn edit-btn" title="Editar" onclick="editarUsuario('${userData.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn deactivate-btn" title="Desactivar Usuario" onclick="toggleUserStatus('${userData.id}', 'inactive')">
                <i class="fas fa-ban"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Añadir usuario a tabla de inactivos
function addUserToInactiveTable(userData) {
    const tbody = document.getElementById('usuariosInactivosTableBody');
    const row = document.createElement('tr');
    row.dataset.userId = userData.id;
    row.dataset.status = 'inactive';
    
    row.innerHTML = `
        <td class="usuario-name">${userData.name}</td>
        <td class="carrera-name">${userData.career}</td>
        <td class="rol-badge">
            <span class="rol-${userData.role.toLowerCase()}">${userData.role}</span>
        </td>
        <td class="date-field">${userData.deactivationDate}</td>
        <td class="acciones-cell">
            <button class="action-btn view-btn" title="Ver Detalles" onclick="verDetallesUsuario('${userData.id}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn activate-btn" title="Reactivar Usuario" onclick="toggleUserStatus('${userData.id}', 'active')">
                <i class="fas fa-undo"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Ver detalles de usuario inactivo
function verDetallesUsuario(userId) {
    // Esta función se puede expandir para mostrar un modal con detalles
    alert(`Ver detalles del usuario: ${userId}`);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Hacer funciones disponibles globalmente
window.switchTab = switchTab;
window.testAddUser = testAddUser;
window.editarUsuario = editarUsuario;
window.toggleUserStatus = toggleUserStatus;
window.verDetallesUsuario = verDetallesUsuario;
window.updateUserCounts = updateUserCounts;