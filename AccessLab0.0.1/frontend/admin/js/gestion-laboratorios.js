// Funcionalidades para la vista de gestión de laboratorios

// Variables globales para paginación
let currentPage = 1;
let itemsPerPage = 5;
let totalItems = 0;
let allLaboratories = [];
let filteredLaboratories = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeLaboratoriesView();
    loadLaboratories();
    initializeScrollProgressBar();
});

// === INICIALIZACIÓN ===

// Inicializar la vista de laboratorios
function initializeLaboratoriesView() {
    // Agregar evento al input de búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                searchLaboratories();
            }
        });
        
        // Búsqueda en tiempo real
        searchInput.addEventListener('input', function() {
            debounceSearch();
        });
    }
}

// === FUNCIONES DE BÚSQUEDA ===

let searchTimeout;

function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchLaboratories();
    }, 300);
}

function searchLaboratories() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredLaboratories = [...allLaboratories];
    } else {
        filteredLaboratories = allLaboratories.filter(lab => {
            return lab.name.toLowerCase().includes(searchTerm) || 
                   lab.location.toLowerCase().includes(searchTerm) || 
                   lab.technician.toLowerCase().includes(searchTerm);
        });
    }
    
    totalItems = filteredLaboratories.length;
    currentPage = 1; // Resetear a la primera página después de búsqueda
    updatePagination();
    renderCurrentPage();
}



// === FUNCIONES DE GESTIÓN DE LABORATORIOS ===

// Cargar laboratorios (simulado)
function loadLaboratories() {
    console.log('Cargando laboratorios...');
    
    // Array vacío para producción
    allLaboratories = [];
    
    filteredLaboratories = [...allLaboratories];
    totalItems = filteredLaboratories.length;
    updatePagination();
    renderCurrentPage();
}

// === FUNCIONES DE PAGINACIÓN ===

// Renderizar la página actual
function renderCurrentPage() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredLaboratories.slice(startIndex, endIndex);
    
    const tableBody = document.getElementById('laboratoriesTableBody');
    tableBody.innerHTML = '';
    
    if (currentItems.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="no-labs-message">
                    <i class="fas fa-search-minus mb-2"></i><br>
                    No se encontraron laboratorios
                </td>
            </tr>
        `;
    } else {
        currentItems.forEach(lab => {
            const row = createLaboratoryRow(lab);
            tableBody.appendChild(row);
        });
    }
    
    updateResultsInfo();
}

// Crear fila de laboratorio
function createLaboratoryRow(lab) {
    const row = document.createElement('tr');
    row.dataset.labId = lab.id;
    
    // Determinar clases y contenido basado en el estado
    const isActive = lab.status === 'active';
    const rowClass = isActive ? '' : 'lab-inactive';
    const statusIcon = isActive ? 'fas fa-toggle-on' : 'fas fa-toggle-off';
    const statusTitle = isActive ? 'Desactivar Laboratorio' : 'Activar Laboratorio';
    const statusClass = isActive ? 'status-btn active' : 'status-btn inactive';
    
    row.className = rowClass;
    
    row.innerHTML = `
        <td class="lab-name">
            <a href="#" class="lab-link ${!isActive ? 'lab-disabled' : ''}" onclick="viewLabDetails('${lab.id}')">
                ${lab.name}
                ${!isActive ? '<span class="lab-status-badge">Inactivo</span>' : ''}
            </a>
        </td>
        <td class="lab-location">${lab.location}</td>
        <td class="lab-technician">${lab.technician}</td>
        <td class="acciones-cell">
            <button class="action-btn edit-btn" title="Editar Laboratorio" onclick="editLaboratory(this)" ${!isActive ? 'disabled' : ''}>
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn ${statusClass}" title="${statusTitle}" onclick="toggleLabStatus(this)">
                <i class="${statusIcon}"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Actualizar información de resultados
function updateResultsInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
    
    document.getElementById('resultsCount').textContent = 
        `Mostrando ${startIndex}-${endIndex} de ${totalItems} resultados`;
}

// Actualizar controles de paginación
function updatePagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Actualizar información de página
    document.getElementById('paginationInfo').textContent = 
        `Página ${currentPage} de ${totalPages}`;
    
    // Actualizar botones de navegación
    document.getElementById('firstPageBtn').disabled = currentPage === 1;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages || totalPages === 0;
    document.getElementById('lastPageBtn').disabled = currentPage === totalPages || totalPages === 0;
    
    // Actualizar números de página
    updatePageNumbers(totalPages);
}

// Actualizar números de página
function updatePageNumbers(totalPages) {
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

// Navegar a una página específica
function goToPage(page) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderCurrentPage();
        updatePagination();
    }
}

// Página anterior
function previousPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

// Página siguiente
function nextPage() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

// Ir a la última página
function goToLastPage() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages > 0) {
        goToPage(totalPages);
    }
}

// Cambiar elementos por página
function changeItemsPerPage() {
    const select = document.getElementById('itemsPerPage');
    itemsPerPage = parseInt(select.value);
    currentPage = 1; // Resetear a la primera página
    updatePagination();
    renderCurrentPage();
}

// === BARRA DE PROGRESO DE SCROLL ===

// Inicializar barra de progreso
function initializeScrollProgressBar() {
    const tableContainer = document.getElementById('tableContainer');
    const progressBar = document.getElementById('scrollProgressBar');
    
    if (tableContainer && progressBar) {
        tableContainer.addEventListener('scroll', function() {
            const scrollTop = tableContainer.scrollTop;
            const scrollHeight = tableContainer.scrollHeight - tableContainer.clientHeight;
            const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            
            progressBar.style.width = scrollPercentage + '%';
        });
    }
}

// Mostrar modal para añadir laboratorio
function showAddLabModal() {
    const modalHtml = `
        <div class="modal fade" id="addLabModal" tabindex="-1" aria-labelledby="addLabModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addLabModalLabel">
                            <i class="fas fa-plus-circle me-2"></i>Agregar Laboratorio
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addLabForm" class="add-lab-form">
                            <div class="row">
                                <!-- Columna Izquierda - Campos del Laboratorio -->
                                <div class="col-md-6">
                                    <div class="add-fields-container">
                                        <!-- Nombre del Laboratorio -->
                                        <div class="mb-4">
                                            <label for="addLabName" class="form-label lab-add-label">Nombre del Laboratorio:</label>
                                            <input type="text" class="form-control lab-add-input" id="addLabName" placeholder="Agregar texto">
                                        </div>

                                        <!-- Asignar Técnico -->
                                        <div class="mb-4">
                                            <label for="addLabTechnician" class="form-label lab-add-label">Asignar Técnico:</label>
                                            <div class="technician-select-container">
                                                <input type="text" class="form-control lab-add-input" id="addLabTechnician" placeholder="Seleccionar técnico" readonly>
                                                <button type="button" class="btn btn-outline-success change-technician-btn" onclick="showTechnicianSelector('add')">
                                                    <i class="fas fa-user-plus"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Ubicación -->
                                        <div class="mb-4">
                                            <label for="addLabLocation" class="form-label lab-add-label">Ubicación:</label>
                                            <input type="text" class="form-control lab-add-input" id="addLabLocation" placeholder="Agregar texto">
                                        </div>
                                    </div>
                                </div>

                                <!-- Columna Derecha - Inventario -->
                                <div class="col-md-6">
                                    <div class="inventory-container">
                                        <label class="form-label add-lab-label">Inventario</label>
                                        <div class="inventory-box">
                                            <textarea class="form-control inventory-textarea" id="addLabInventory" rows="12" placeholder="Describa en forma de lista el equipo y la cantidad con la que cuenta el laboratorio.

Ejemplo:

25 Computadoras HP350C
25 Mouse Logitech
25 Monitores HP22C
25 Teclados Asus 12P"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer add-lab-footer">
                        <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cancelar
                        </button>
                        <button type="button" class="btn btn-info" onclick="clearAddLabForm()">
                            <i class="fas fa-eraser me-2"></i>Limpiar
                        </button>
                        <button type="button" class="btn btn-success" onclick="saveNewLaboratory()">
                            <i class="fas fa-save me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal existente si lo hay
    const existingModal = document.getElementById('addLabModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('addLabModal'));
    modal.show();
    
    // Limpiar modal al cerrarse
    document.getElementById('addLabModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Inicializar búsqueda de técnicos


// Limpiar formulario de agregar laboratorio
function clearAddLabForm() {
    document.getElementById('addLabName').value = '';
    document.getElementById('addLabTechnician').value = '';
    document.getElementById('addLabLocation').value = '';
    document.getElementById('addLabInventory').value = '';
    
    showAlert('Formulario limpiado', 'info');
}

// Guardar nuevo laboratorio
function saveNewLaboratory() {
    const formData = {
        name: document.getElementById('addLabName').value.trim(),
        technician: document.getElementById('addLabTechnician').value.trim(),
        location: document.getElementById('addLabLocation').value.trim(),
        inventory: document.getElementById('addLabInventory').value.trim()
    };
    
    // Validaciones
    if (!formData.name) {
        showAlert('El nombre del laboratorio es requerido', 'error');
        return;
    }
    
    if (!formData.location) {
        showAlert('La ubicación es requerida', 'error');
        return;
    }
    
    // Generar ID único
    const newId = 'lab_' + Date.now();
    
    // Crear objeto del nuevo laboratorio
    const newLaboratory = {
        id: newId,
        name: formData.name,
        location: formData.location,
        technician: formData.technician || 'Sin asignar'
    };
    
    // Agregar a los arrays globales
    allLaboratories.push(newLaboratory);
    filteredLaboratories.push(newLaboratory);
    totalItems = filteredLaboratories.length;
    
    // Actualizar paginación y renderizar
    updatePagination();
    renderCurrentPage();
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addLabModal'));
    modal.hide();
    
    // Mostrar confirmación
    showAlert(`Laboratorio "${formData.name}" agregado exitosamente`, 'success');
    
    console.log('Nuevo laboratorio creado:', newLaboratory);
}

// Añadir laboratorio (función simulada)
function addLaboratory() {
    const formData = {
        name: document.getElementById('labName').value,
        location: document.getElementById('labLocation').value,
        technician: document.getElementById('labTechnician').value,
        capacity: document.getElementById('labCapacity').value,
        description: document.getElementById('labDescription').value
    };
    
    console.log('Añadiendo laboratorio:', formData);
    showAlert('Función en desarrollo - Laboratorio será añadido en próxima versión', 'info');
}

// Editar laboratorio
function editLaboratory(button) {
    const row = button.closest('tr');
    const labName = row.querySelector('.lab-name .lab-link').textContent;
    const labLocation = row.querySelector('.lab-location').textContent;
    const labTechnician = row.querySelector('.lab-technician').textContent;
    const labId = row.dataset.labId;
    
    // Obtener datos del laboratorio (simulado)
    const labData = getLaboratoryData(labId);
    
    const modalHtml = `
        <div class="modal fade" id="editLabModal" tabindex="-1" aria-labelledby="editLabModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editLabModalLabel">
                            <i class="fas fa-edit me-2"></i>Editar Laboratorio
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editLabForm" class="edit-lab-form">
                            <div class="row">
                                <!-- Columna Izquierda - Campos de Edición -->
                                <div class="col-md-6">
                                    <div class="edit-fields-container">
                                        <!-- Nombre del Laboratorio -->
                                        <div class="mb-4">
                                            <label for="editLabName" class="form-label lab-edit-label">Nombre del Laboratorio:</label>
                                            <input type="text" class="form-control lab-edit-input" id="editLabName" value="${labName}">
                                        </div>

                                        <!-- Asignar Técnico -->
                                        <div class="mb-4">
                                            <label for="editLabTechnician" class="form-label lab-edit-label">Asignar Técnico:</label>
                                            <div class="technician-select-container">
                                                <input type="text" class="form-control lab-edit-input" id="editLabTechnician" value="${labTechnician}" readonly>
                                                <button type="button" class="btn btn-outline-info change-technician-btn" onclick="showTechnicianSelector('${labId}')">
                                                    <i class="fas fa-user-edit"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Ubicación -->
                                        <div class="mb-4">
                                            <label for="editLabLocation" class="form-label lab-edit-label">Ubicación:</label>
                                            <input type="text" class="form-control lab-edit-input" id="editLabLocation" value="${labLocation}">
                                        </div>
                                    </div>
                                </div>

                                <!-- Columna Derecha - Inventario -->
                                <div class="col-md-6">
                                    <div class="inventory-container">
                                        <label class="form-label lab-edit-label">Inventario</label>
                                        <div class="inventory-box">
                                            <textarea class="form-control inventory-textarea" id="editLabInventory" rows="12" placeholder="Inventario del laboratorio...">${labData.inventory}</textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cancelar
                        </button>
                        <button type="button" class="btn btn-success" onclick="saveLabChanges('${labId}')">
                            <i class="fas fa-save me-2"></i>Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHtml, 'editLabModal');
}

// Obtener datos del laboratorio (simulado)
function getLaboratoryData(labId) {
    // En una implementación real, esto vendría del backend
    const inventoryData = {
        'lab_001': '25 Computadoras HP350C\n25 Mouse Logitech\n25 Monitores HP22C\n25 Teclados Asus 12P',
        'lab_002': '25 Computadoras HP350C\n25 Mouse Logitech\n25 Monitores HP22C\n25 Teclados Asus 12P\n2 Switches Cisco 24 puertos\n1 Proyector Epson',
        'default': '20 Computadoras Dell OptiPlex\n20 Mouse básicos\n20 Monitores 19"\n20 Teclados estándar'
    };
    
    return {
        inventory: inventoryData[labId] || inventoryData['default']
    };
}

// Mostrar selector de técnicos
function showTechnicianSelector(labId) {
    const technicians = [
        'José Francisco Mastache',
        'María González López', 
        'Carlos Hernández Ruiz',
        'Ana Sofía Martín',
        'Roberto Pérez García',
        'Lucía Ramírez Torres',
        'Diego Morales Vega',
        'Carmen Silva López',
        'Fernando Castro Ruiz',
        'Patricia Jiménez Mora'
    ];
    
    const technicianOptions = technicians.map(tech => 
        `<option value="${tech}">${tech}</option>`
    ).join('');
    
    const selectorModal = `
        <div class="modal fade" id="technicianSelectorModal" tabindex="-1" aria-labelledby="technicianSelectorLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="technicianSelectorLabel">
                            <i class="fas fa-user-edit me-2"></i>Seleccionar Técnico
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="selectTechnician" class="form-label">Asignar técnico responsable:</label>
                            <select class="form-select" id="selectTechnician">
                                <option value="">Sin asignar</option>
                                ${technicianOptions}
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="assignTechnician('${labId}')">
                            <i class="fas fa-check me-2"></i>Asignar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(selectorModal, 'technicianSelectorModal');
}

// Asignar técnico seleccionado
function assignTechnician(labId) {
    const selectedTechnician = document.getElementById('selectTechnician').value;
    
    // Determinar en qué modal estamos (agregar o editar)
    if (labId === 'add') {
        document.getElementById('addLabTechnician').value = selectedTechnician || 'Sin asignar';
    } else {
        document.getElementById('editLabTechnician').value = selectedTechnician || 'Sin asignar';
    }
    
    // Cerrar modal de selector
    const modal = bootstrap.Modal.getInstance(document.getElementById('technicianSelectorModal'));
    modal.hide();
    
    showAlert('Técnico asignado correctamente', 'success');
}

// Guardar cambios del laboratorio
function saveLabChanges(labId) {
    const formData = {
        id: labId,
        name: document.getElementById('editLabName').value,
        technician: document.getElementById('editLabTechnician').value,
        location: document.getElementById('editLabLocation').value,
        inventory: document.getElementById('editLabInventory').value
    };
    
    // Validaciones básicas
    if (!formData.name.trim()) {
        showAlert('El nombre del laboratorio es requerido', 'error');
        return;
    }
    
    if (!formData.location.trim()) {
        showAlert('La ubicación es requerida', 'error');
        return;
    }
    
    // Simular guardado
    console.log('Guardando cambios del laboratorio:', formData);
    
    // Actualizar la tabla (simulado)
    updateLaboratoryInTable(labId, formData);
    
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editLabModal'));
    modal.hide();
    
    showAlert(`Laboratorio "${formData.name}" actualizado correctamente`, 'success');
}

// Actualizar laboratorio en la tabla
function updateLaboratoryInTable(labId, formData) {
    // Buscar en los datos globales y actualizar
    const labIndex = allLaboratories.findIndex(lab => lab.id === labId);
    if (labIndex !== -1) {
        allLaboratories[labIndex] = {
            ...allLaboratories[labIndex],
            name: formData.name,
            technician: formData.technician,
            location: formData.location
        };
        
        // Actualizar también los datos filtrados
        const filteredIndex = filteredLaboratories.findIndex(lab => lab.id === labId);
        if (filteredIndex !== -1) {
            filteredLaboratories[filteredIndex] = allLaboratories[labIndex];
        }
        
        // Volver a renderizar la página actual
        renderCurrentPage();
    }
}

// Actualizar estado del laboratorio
function toggleLabStatus(button) {
    const row = button.closest('tr');
    const labId = row.dataset.labId;
    const labName = row.querySelector('.lab-name .lab-link').textContent.trim();
    
    // Encontrar el laboratorio en los datos
    const labIndex = allLaboratories.findIndex(lab => lab.id === labId);
    if (labIndex === -1) return;
    
    const currentStatus = allLaboratories[labIndex].status;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activar' : 'desactivar';
    
    // Modal de confirmación
    const confirmModalHtml = `
        <div class="modal fade" id="confirmStatusModal" tabindex="-1" aria-labelledby="confirmStatusModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmStatusModalLabel">
                            <i class="fas fa-exclamation-triangle me-2"></i>Confirmar Acción
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="status-confirmation">
                            <div class="confirmation-icon">
                                <i class="fas ${newStatus === 'active' ? 'fa-toggle-on text-success' : 'fa-toggle-off text-warning'} fa-3x"></i>
                            </div>
                            <h6 class="mt-3 mb-3">¿Estás seguro que deseas ${action} el laboratorio?</h6>
                            <div class="lab-info">
                                <strong>${labName}</strong><br>
                                <small class="text-muted">${allLaboratories[labIndex].location}</small>
                            </div>
                            <div class="alert alert-info mt-3">
                                <i class="fas fa-info-circle me-2"></i>
                                ${newStatus === 'inactive' ? 
                                    'El laboratorio será desactivado pero se conservarán todos sus registros, asignaciones y horarios.' :
                                    'El laboratorio será reactivado y estará disponible para su uso normal.'
                                }
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cancelar
                        </button>
                        <button type="button" class="btn ${newStatus === 'active' ? 'btn-success' : 'btn-warning'}" onclick="confirmStatusChange('${labId}', '${newStatus}')">
                            <i class="fas ${newStatus === 'active' ? 'fa-check' : 'fa-pause'} me-2"></i>${newStatus === 'active' ? 'Activar' : 'Desactivar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(confirmModalHtml, 'confirmStatusModal');
}

// Confirmar cambio de estado
function confirmStatusChange(labId, newStatus) {
    // Actualizar en allLaboratories
    const labIndex = allLaboratories.findIndex(lab => lab.id === labId);
    if (labIndex !== -1) {
        allLaboratories[labIndex].status = newStatus;
        
        // Actualizar en filteredLaboratories también
        const filteredIndex = filteredLaboratories.findIndex(lab => lab.id === labId);
        if (filteredIndex !== -1) {
            filteredLaboratories[filteredIndex].status = newStatus;
        }
    }
    
    // Cerrar modal de confirmación
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmStatusModal'));
    modal.hide();
    
    // Rerender la tabla para mostrar los cambios
    renderCurrentPage();
    
    // Mostrar mensaje de éxito
    const action = newStatus === 'active' ? 'activado' : 'desactivado';
    const labName = allLaboratories[labIndex].name;
    showAlert(`Laboratorio "${labName}" ${action} exitosamente`, newStatus === 'active' ? 'success' : 'warning');
}

// Ver detalles del laboratorio
function viewLabDetails(labId) {
    // Obtener información del laboratorio
    const labData = getLabDataById(labId);
    
    // Obtener profesores asignados al laboratorio
    const assignedProfessors = getAssignedProfessors(labId);
    
    const modalHtml = `
        <div class="modal fade" id="labAssignmentsModal" tabindex="-1" aria-labelledby="labAssignmentsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="labAssignmentsModalLabel">
                            <i class="fas fa-users me-2"></i>${labData.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="assignments-container">
                            <div class="assignments-header mb-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0 text-muted">
                                        <i class="fas fa-chalkboard-teacher me-2"></i>Profesores Asignados
                                    </h6>
                                    <span class="badge bg-primary">${assignedProfessors.length} profesor(es)</span>
                                </div>
                            </div>
                            
                            <div class="table-responsive">
                                <table class="table assignments-table">
                                    <thead>
                                        <tr>
                                            <th>Profesores asignados</th>
                                            <th>Carrera</th>
                                            <th>Rol</th>
                                            <th>Horarios</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${assignedProfessors.map(professor => `
                                            <tr>
                                                <td class="professor-name">${professor.name}</td>
                                                <td class="professor-career">${professor.career}</td>
                                                <td class="professor-role">${professor.role}</td>
                                                <td class="professor-schedule">
                                                    <button class="btn btn-info btn-sm schedule-btn" onclick="viewProfessorSchedule('${professor.id}', '${professor.name}')">
                                                        Ver Horarios
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                            
                            ${assignedProfessors.length === 0 ? `
                                <div class="no-assignments-message text-center py-5">
                                    <i class="fas fa-user-slash fa-3x text-muted mb-3"></i>
                                    <h6 class="text-muted">No hay profesores asignados a este laboratorio</h6>
                                    <p class="text-muted mb-0">Los profesores se asignan a través del módulo de gestión de horarios.</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Cerrar
                        </button>
                        <button type="button" class="btn btn-primary" onclick="manageLabAssignments('${labId}')">
                            <i class="fas fa-edit me-2"></i>Gestionar Asignaciones
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(modalHtml, 'labAssignmentsModal');
}

// Obtener datos del laboratorio por ID
function getLabDataById(labId) {
    // Datos simulados - en producción vendría de la API
    const labsData = {
        'lab_001': { name: 'Laboratorio de Redes P1', location: 'Edificio Pesado 1' },
        'lab_002': { name: 'Laboratorio de Redes P2', location: 'Edificio Pesado 2' },
        'lab_003': { name: 'Laboratorio de Cómputo A1', location: 'Edificio A' },
        'lab_004': { name: 'Laboratorio de Cómputo A2', location: 'Edificio A' },
        'lab_005': { name: 'Laboratorio de Mecatrónica', location: 'Edificio Talleres' },
        'lab_006': { name: 'Laboratorio de Industrial', location: 'Edificio B' },
        'lab_007': { name: 'Laboratorio de Construcción', location: 'Edificio Talleres' },
        'lab_008': { name: 'Laboratorio Multimedia', location: 'Edificio C' },
        'lab_009': { name: 'Laboratorio de Programación', location: 'Edificio A' },
        'lab_010': { name: 'Laboratorio de Bases de Datos', location: 'Edificio Pesado 2' },
        'lab_011': { name: 'Laboratorio de Electrónica', location: 'Edificio Talleres' },
        'lab_012': { name: 'Laboratorio de Automatización', location: 'Edificio B' }
    };
    
    return labsData[labId] || { name: 'Laboratorio Desconocido', location: 'Ubicación no disponible' };
}

// Obtener profesores asignados al laboratorio
function getAssignedProfessors(labId) {
    // Datos simulados - en producción vendría de la API
    const assignmentsData = {
        'lab_001': [
            {
                id: 'prof2',
                name: 'María Elena González',
                career: 'ISC',
                role: 'Coordinadora'
            }
        ],
        'lab_002': [
            {
                id: 'prof1',
                name: 'Hermelindo Buenrostro',
                career: 'Tecnologías de la información',
                role: 'Maestro'
            }
        ],
        'lab_003': [
            {
                id: 'prof3',
                name: 'Carlos Hernández López',
                career: 'TI',
                role: 'Maestro'
            }
        ],
        'lab_005': [
            {
                id: 'prof4',
                name: 'Ana Sofía Martínez',
                career: 'IER',
                role: 'Maestra'
            },
            {
                id: 'prof5',
                name: 'Roberto Pérez Silva',
                career: 'TI',
                role: 'Maestro'
            }
        ],
        'lab_008': [
            {
                id: 'prof6',
                name: 'Lucía Ramírez Torres',
                career: 'IDM',
                role: 'Coordinadora'
            }
        ]
    };
    
    return assignmentsData[labId] || [];
}

// Ver horarios del profesor
function viewProfessorSchedule(professorId, professorName) {
    const professorData = getProfessorData(professorId);
    const scheduleData = getProfessorSchedule(professorId);
    
    const scheduleModalHtml = `
        <div class="modal fade" id="professorScheduleModal" tabindex="-1" aria-labelledby="professorScheduleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md">
                <div class="modal-content professor-schedule-modal">
                    <div class="modal-body p-0">
                        <div class="professor-info-card">
                            <div class="professor-details">
                                <div class="info-row">
                                    <span class="info-label">Usuario:</span>
                                    <span class="info-value">${professorData.name}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Carrera:</span>
                                    <span class="info-value">${professorData.career}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Materia:</span>
                                    <span class="info-value">${professorData.subject}</span>
                                </div>
                            </div>
                            
                            <div class="schedule-section">
                                <h4 class="schedule-title">Horarios</h4>
                                <ul class="schedule-list">
                                    ${scheduleData.map(schedule => `
                                        <li class="schedule-item">
                                            <span class="schedule-day-item">${schedule.day}</span>
                                            <span class="schedule-time-item">de ${schedule.time}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <div class="modal-actions">
                                <button type="button" class="btn-accept" data-bs-dismiss="modal">
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(scheduleModalHtml, 'professorScheduleModal');
}

// Obtener datos del profesor
function getProfessorData(professorId) {
    // Datos simulados - en producción vendría de la API
    const professorsData = {
        'prof1': {
            name: 'Hermelindo Buenrostro',
            career: 'Tecnologías de la información',
            subject: 'Desarrollo de Software'
        },
        'prof2': {
            name: 'María Elena González',
            career: 'Ingeniería en Sistemas Computacionales',
            subject: 'Programación Web'
        },
        'prof3': {
            name: 'Carlos Hernández López',
            career: 'Tecnologías de la información',
            subject: 'Desarrollo de Software'
        },
        'prof4': {
            name: 'Ana Sofía Martínez',
            career: 'Ingeniería Electrónica y Robótica',
            subject: 'Circuitos Digitales'
        },
        'prof5': {
            name: 'Roberto Pérez Silva',
            career: 'Tecnologías de la información',
            subject: 'Arquitectura de Computadoras'
        },
        'prof6': {
            name: 'Lucía Ramírez Torres',
            career: 'Ingeniería en Diseño Multimedia',
            subject: 'Diseño Multimedia'
        }
    };
    
    return professorsData[professorId] || {
        name: 'Profesor Desconocido',
        career: 'Carrera no disponible',
        subject: 'Materia no disponible'
    };
}

// Obtener horarios del profesor
function getProfessorSchedule(professorId) {
    // Datos simulados - en producción vendría de la API
    const schedulesData = {
        'prof1': [
            { day: 'Lunes', time: '7am - 9am' },
            { day: 'Miércoles', time: '7am - 8am' },
            { day: 'Viernes', time: '8am - 9am' }
        ],
        'prof2': [
            { day: 'Martes', time: '8am - 10am' },
            { day: 'Jueves', time: '10am - 12pm' }
        ],
        'prof3': [
            { day: 'Lunes', time: '2pm - 4pm' },
            { day: 'Miércoles', time: '4pm - 6pm' }
        ],
        'prof4': [
            { day: 'Martes', time: '8am - 10am' },
            { day: 'Jueves', time: '2pm - 4pm' }
        ],
        'prof5': [
            { day: 'Lunes', time: '10am - 12pm' },
            { day: 'Viernes', time: '8am - 10am' }
        ],
        'prof6': [
            { day: 'Miércoles', time: '2pm - 4pm' },
            { day: 'Viernes', time: '10am - 12pm' }
        ]
    };
    
    return schedulesData[professorId] || [];
}

// Gestionar asignaciones del laboratorio (función placeholder)
function manageLabAssignments(labId) {
    showAlert('Funcionalidad en desarrollo: Gestionar asignaciones del laboratorio', 'info');
}

// Editar horarios del profesor (función placeholder)
function editProfessorSchedule(professorId) {
    showAlert('Funcionalidad en desarrollo: Editar horarios del profesor', 'info');
}

// === FUNCIONES AUXILIARES ===

// Función genérica para mostrar modales
function showModal(modalHtml, modalId) {
    // Remover modal existente si lo hay
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
        existingModal.remove();
    }
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
    
    // Limpiar modal al cerrarse
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.content-container');
    const alertId = 'alert-' + Date.now();
    
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" id="${alertId}" role="alert">
            <i class="fas fa-${getIconForAlert(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('afterbegin', alertHtml);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Obtener icono para tipo de alerta
function getIconForAlert(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-triangle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// === NAVEGACIÓN ===

// Sobrescribir navigateTo para manejar navegación desde esta vista
function navigateTo(section) {
    if (section === 'home') {
        window.location.href = 'HomeAdmin.html';
    } else {
        // Usar función de navegación base
        if (typeof window.navigateTo === 'function') {
            window.navigateTo(section);
        }
    }
}