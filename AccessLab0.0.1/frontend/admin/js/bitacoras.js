// Bitácoras - AccessLab JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeBitacoras();
});

// Variables globales para manejo de filtros y paginación
let activeFilters = [];
let allBitacoras = [];
let filteredBitacoras = [];
let currentPage = 1;
let itemsPerPage = 5;

// Array de bitácoras (vacío para inicio en producción)
const sampleBitacoras = [];

// Inicializar funcionalidades de bitácoras
function initializeBitacoras() {
    // Inicializar datos
    allBitacoras = [...sampleBitacoras];
    filteredBitacoras = [...allBitacoras];
    
    setupFilterFunctionality();
    setupTableInteractions();
    setupStatusChanges();
    setupScrollProgress();
    setupItemsPerPageSelector();
    
    // Renderizar tabla inicial
    renderTable();
    updatePagination();
}

// Configurar funcionalidad de filtros
function setupFilterFunctionality() {
    const estadoFilter = document.getElementById('estadoFilter');

    // Listener para el filtro de estado
    estadoFilter.addEventListener('change', function() {
        if (this.value) {
            showFilterInput(this.value);
        }
    });
}



// Configurar interacciones de la tabla
function setupTableInteractions() {
    const tableRows = document.querySelectorAll('.table-row');
    
    tableRows.forEach(row => {
        // Hover effects ya están en CSS
        row.addEventListener('click', function(e) {
            // Si no se hace click en el estado o acciones, seleccionar fila
            if (!e.target.closest('.status-cell') && !e.target.closest('.actions-cell')) {
                toggleRowSelection(this);
            }
        });
    });
}

// Configurar cambios de estado
function setupStatusChanges() {
    const statusCells = document.querySelectorAll('.status-cell');
    
    statusCells.forEach(cell => {
        cell.addEventListener('click', function(e) {
            e.stopPropagation();
            showInlineStatusDropdown(this);
        });
        
        // Hacer las celdas clickeables visualmente
        cell.style.cursor = 'pointer';
        cell.title = 'Click para cambiar estado';
    });
}

// Aplicar todos los filtros activos
function applyAllFilters() {
    if (activeFilters.length === 0) {
        // Si no hay filtros, usar todos los datos
        filteredBitacoras = [...allBitacoras];
    } else {
        // Aplicar filtros a los datos
        filteredBitacoras = allBitacoras.filter(bitacora => {
            return activeFilters.every(filter => {
                let valueToCheck = '';
                
                switch(filter.type) {
                    case 'usuario':
                        valueToCheck = bitacora.usuario;
                        break;
                    case 'laboratorio':
                        valueToCheck = bitacora.laboratorio;
                        break;
                    case 'materia':
                        valueToCheck = bitacora.materia;
                        break;
                    case 'grupo':
                        valueToCheck = bitacora.grupo;
                        break;
                    case 'carrera':
                        valueToCheck = bitacora.carrera;
                        break;
                    case 'parcial':
                        valueToCheck = bitacora.parcial;
                        break;
                    case 'cuatrimestre':
                        valueToCheck = bitacora.cuatrimestre;
                        break;
                    case 'estado':
                        valueToCheck = bitacora.estado;
                        break;
                    case 'fecha':
                        valueToCheck = bitacora.cuatrimestre;
                        break;
                }
                
                return valueToCheck.toLowerCase().includes(filter.value.toLowerCase());
            });
        });
    }
    
    // Resetear a la primera página después de filtrar
    currentPage = 1;
    
    // Re-renderizar tabla y paginación
    renderTable();
    updatePagination();
}

// Mostrar input al lado del filtro
function showFilterInput(filterType) {
    // Remover input anterior si existe
    hideFilterInput();
    
    // Crear container para el input
    const filterGroup = document.querySelector('.filter-group');
    const inputContainer = document.createElement('div');
    inputContainer.className = 'inline-filter-container';
    inputContainer.id = 'inlineFilterContainer';
    
    inputContainer.innerHTML = `
        <input type="text" class="inline-filter-input" id="inlineFilterValue" 
               placeholder="Valor para ${filterType}..." data-filter-type="${filterType}">
        <button class="inline-apply-btn" onclick="applyInlineFilter()">
            <i class="fas fa-check"></i>
        </button>
        <button class="inline-cancel-btn" onclick="hideFilterInput()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    filterGroup.appendChild(inputContainer);
    
    // Focus en el input
    setTimeout(() => {
        document.getElementById('inlineFilterValue').focus();
    }, 100);
    
    // Aplicar filtro al presionar Enter
    document.getElementById('inlineFilterValue').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyInlineFilter();
        }
    });
}

// Ocultar input inline
function hideFilterInput() {
    const existingContainer = document.getElementById('inlineFilterContainer');
    if (existingContainer) {
        existingContainer.remove();
    }
}

// Resetear el select de filtros
function resetFilterSelect() {
    document.getElementById('estadoFilter').value = '';
}

// Actualizar la visualización de filtros activos
function updateActiveFiltersDisplay() {
    const activeFiltersSection = document.getElementById('activeFiltersSection');
    const activeFiltersList = document.getElementById('activeFiltersList');
    
    if (activeFilters.length === 0) {
        activeFiltersSection.style.display = 'none';
        return;
    }
    
    activeFiltersSection.style.display = 'block';
    activeFiltersList.innerHTML = '';
    
    activeFilters.forEach((filter, index) => {
        const filterChip = document.createElement('div');
        filterChip.className = 'filter-chip';
        filterChip.innerHTML = `
            <span class="filter-chip-label">${filter.type}:</span>
            <span class="filter-chip-value">${filter.value}</span>
            <button class="filter-chip-remove" onclick="removeFilter(${index})" title="Eliminar filtro">
                <i class="fas fa-times"></i>
            </button>
        `;
        activeFiltersList.appendChild(filterChip);
    });
}

// Eliminar un filtro específico
function removeFilter(index) {
    if (index >= 0 && index < activeFilters.length) {
        const removedFilter = activeFilters.splice(index, 1)[0];
        showNotification(`Filtro eliminado: ${removedFilter.type}`, 'success');
        
        updateActiveFiltersDisplay();
        applyAllFilters();
    }
}

// Limpiar todos los filtros
function clearAllFilters() {
    activeFilters = [];
    updateActiveFiltersDisplay();
    applyAllFilters();
    showNotification('Todos los filtros han sido eliminados', 'success');
}

// Configurar barra de progreso del scroll
function setupScrollProgress() {
    const tableContainer = document.getElementById('tableContainer');
    const progressBar = document.getElementById('scrollProgressBar');
    
    tableContainer.addEventListener('scroll', function() {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight - this.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.height = Math.min(scrollPercent, 100) + '%';
    });
}

// Renderizar la tabla con los datos filtrados y paginados
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredBitacoras.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pageData.forEach((bitacora, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="user-cell">${bitacora.usuario}</td>
            <td class="lab-cell">${bitacora.laboratorio}</td>
            <td class="subject-cell">${bitacora.materia}</td>
            <td class="group-cell">${bitacora.grupo}</td>
            <td class="career-cell">${bitacora.carrera}</td>
            <td class="partial-cell">${bitacora.parcial}</td>
            <td class="quarter-cell">${bitacora.cuatrimestre}</td>
            <td class="status-cell">
                <span class="status-badge status-${bitacora.estado}">${bitacora.estado.charAt(0).toUpperCase() + bitacora.estado.slice(1)}</span>
            </td>
            <td class="actions-cell">
                <div class="action-buttons">
                    <button class="btn-ver-bitacora" onclick="verDetalleBitacora('${bitacora.usuario}', '${bitacora.laboratorio}', '${bitacora.grupo}')" title="Ver detalle de la bitácora">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="btn-descargar-bitacora" onclick="descargarBitacora('${bitacora.usuario}', '${bitacora.laboratorio}', '${bitacora.grupo}')" title="Descargar bitácora en PDF">
                        <i class="fas fa-download"></i> Descargar
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Reconfigurar interacciones para las nuevas filas
    setupTableInteractions();
    setupStatusChanges();
    
    // Actualizar información de resultados
    updateResultsInfo();
}

// Actualizar información de resultados
function updateResultsInfo() {
    const resultsCount = document.getElementById('resultsCount');
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredBitacoras.length);
    const total = filteredBitacoras.length;
    
    if (total === 0) {
        resultsCount.textContent = 'No se encontraron resultados';
    } else {
        resultsCount.textContent = `Mostrando ${startIndex}-${endIndex} de ${total} resultados`;
    }
}

// Actualizar paginación
function updatePagination() {
    const totalPages = Math.ceil(filteredBitacoras.length / itemsPerPage);
    const paginationInfo = document.getElementById('paginationInfo');
    const pageNumbers = document.getElementById('pageNumbers');
    const firstPageBtn = document.getElementById('firstPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const lastPageBtn = document.getElementById('lastPageBtn');
    
    // Actualizar información de página
    const startItem = ((currentPage - 1) * itemsPerPage) + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredBitacoras.length);
    const totalItems = filteredBitacoras.length;
    
    if (totalItems === 0) {
        paginationInfo.textContent = 'No se encontraron registros';
    } else {
        paginationInfo.textContent = `Mostrando ${startItem}-${endItem} de ${totalItems} registros | Página ${currentPage} de ${totalPages}`;
    }
    
    // Actualizar botones de navegación
    firstPageBtn.disabled = currentPage === 1;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    lastPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Generar números de página
    pageNumbers.innerHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar el rango si estamos cerca del final
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

// Funciones de navegación de páginas
function goToPage(page) {
    const totalPages = Math.ceil(filteredBitacoras.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderTable();
        updatePagination();
    }
}

function previousPage() {
    if (currentPage > 1) {
        goToPage(currentPage - 1);
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredBitacoras.length / itemsPerPage);
    if (currentPage < totalPages) {
        goToPage(currentPage + 1);
    }
}

function goToLastPage() {
    const totalPages = Math.ceil(filteredBitacoras.length / itemsPerPage);
    goToPage(totalPages);
}

// Cambiar elementos por página
// Configurar selector de elementos por página
function setupItemsPerPageSelector() {
    const itemsSelect = document.getElementById('itemsPerPage');
    if (itemsSelect) {
        // Asegurar que el select muestre el valor actual
        itemsSelect.value = itemsPerPage.toString();
    }
}

function changeItemsPerPage() {
    const itemsSelect = document.getElementById('itemsPerPage');
    itemsPerPage = parseInt(itemsSelect.value);
    currentPage = 1; // Resetear a primera página
    renderTable();
    updatePagination();
    
    // Mostrar notificación
    showNotification(`Mostrando ${itemsPerPage} elementos por página`, 'info');
}

// Aplicar filtro inline
function applyInlineFilter() {
    const filterInput = document.getElementById('inlineFilterValue');
    if (!filterInput) return;
    
    const filterType = filterInput.getAttribute('data-filter-type');
    const filterValue = filterInput.value.trim();
    
    if (!filterValue) {
        showNotification('Por favor, ingresa un valor para filtrar', 'error');
        return;
    }
    
    // Verificar si ya existe un filtro del mismo tipo
    const existingFilterIndex = activeFilters.findIndex(f => f.type === filterType);
    
    if (existingFilterIndex >= 0) {
        // Actualizar filtro existente
        activeFilters[existingFilterIndex].value = filterValue;
        showNotification(`Filtro actualizado: ${filterType} = "${filterValue}"`, 'success');
    } else {
        // Añadir nuevo filtro
        activeFilters.push({
            type: filterType,
            value: filterValue
        });
        showNotification(`Filtro añadido: ${filterType} = "${filterValue}"`, 'success');
    }
    
    // Actualizar la vista de filtros activos
    updateActiveFiltersDisplay();
    
    // Aplicar todos los filtros
    applyAllFilters();
    
    // Limpiar el formulario
    hideFilterInput();
    resetFilterSelect();
}





// Alternar selección de fila
function toggleRowSelection(row) {
    const isSelected = row.classList.contains('selected');
    
    // Remover selección de todas las filas
    document.querySelectorAll('.table-row').forEach(r => {
        r.classList.remove('selected');
        r.style.backgroundColor = '';
    });
    
    // Si no estaba seleccionada, seleccionarla
    if (!isSelected) {
        row.classList.add('selected');
        row.style.backgroundColor = 'rgba(207, 228, 233, 0.3)';
    }
}

// Mostrar dropdown inline para cambiar estado
function showInlineStatusDropdown(statusCell) {
    // Cerrar cualquier dropdown existente
    closeInlineDropdown();
    
    const statusBadge = statusCell.querySelector('.status-badge');
    const currentStatus = statusBadge.classList.contains('status-abierto') ? 'abierto' :
                         statusBadge.classList.contains('status-cerrado') ? 'cerrado' :
                         statusBadge.classList.contains('status-validada') ? 'validada' : '';
    
    // Crear el dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'inline-status-dropdown';
    dropdown.innerHTML = `
        <select class="status-dropdown-select" id="statusDropdownSelect">
            <option value="abierto" ${currentStatus === 'abierto' ? 'selected' : ''}>Abierto</option>
            <option value="cerrado" ${currentStatus === 'cerrado' ? 'selected' : ''}>Cerrado</option>
            <option value="validada" ${currentStatus === 'validada' ? 'selected' : ''}>Validada</option>
        </select>
    `;
    
    // Ocultar el badge actual y mostrar el dropdown
    statusBadge.style.display = 'none';
    statusCell.appendChild(dropdown);
    
    const selectElement = dropdown.querySelector('.status-dropdown-select');
    
    // Focus en el select y abrirlo
    setTimeout(() => {
        selectElement.focus();
        // Simular click para abrir las opciones en algunos navegadores
        if (selectElement.showPicker) {
            selectElement.showPicker();
        }
    }, 100);
    
    // Evento para cambio automático
    selectElement.addEventListener('change', function() {
        const newStatus = this.value;
        if (newStatus !== currentStatus) {
            saveInlineStatusChange(currentStatus, newStatus);
        } else {
            closeInlineDropdown();
        }
    });
    
    // Evento para cerrar con Escape
    selectElement.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeInlineDropdown();
        }
    });
    
    // Evento para detectar cuando se pierde el foco del select
    selectElement.addEventListener('blur', function(e) {
        // Delay para permitir que el change event se ejecute primero
        setTimeout(() => {
            // Solo cerrar si no se ha seleccionado una nueva opción
            const dropdown = document.querySelector('.inline-status-dropdown');
            if (dropdown) {
                closeInlineDropdown();
            }
        }, 150);
    });
}

// Cerrar dropdown inline
function closeInlineDropdown() {
    const existingDropdown = document.querySelector('.inline-status-dropdown');
    if (existingDropdown) {
        const statusCell = existingDropdown.parentElement;
        const statusBadge = statusCell.querySelector('.status-badge');
        
        // Mostrar el badge nuevamente
        statusBadge.style.display = '';
        
        // Remover el dropdown
        existingDropdown.remove();
    }
}

// Guardar cambio de estado inline
function saveInlineStatusChange(originalStatus, newStatus) {
    const dropdown = document.querySelector('.inline-status-dropdown');
    if (!dropdown) return;
    
    const statusCell = dropdown.parentElement;
    const statusBadge = statusCell.querySelector('.status-badge');
    const row = statusCell.closest('tr');
    
    // Encontrar el índice de la bitácora en los datos
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const pageStartIndex = (currentPage - 1) * itemsPerPage;
    const dataIndex = pageStartIndex + rowIndex;
    
    // Actualizar los datos en memoria
    if (filteredBitacoras[dataIndex]) {
        // Actualizar en filteredBitacoras
        filteredBitacoras[dataIndex].estado = newStatus;
        
        // Encontrar y actualizar en allBitacoras
        const originalData = allBitacoras.find(item => 
            item.usuario === filteredBitacoras[dataIndex].usuario &&
            item.laboratorio === filteredBitacoras[dataIndex].laboratorio &&
            item.materia === filteredBitacoras[dataIndex].materia
        );
        if (originalData) {
            originalData.estado = newStatus;
        }
    }
    
    // Actualizar el badge
    updateStatusBadge(statusBadge, newStatus);
    
    // Cerrar dropdown
    closeInlineDropdown();
    
    // Mostrar notificación
    showNotification(`Estado actualizado a: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`, 'success');
    
    // Aquí iría la lógica para guardar en el backend
    console.log(`Estado cambiado de ${originalStatus} a ${newStatus}`);
}

// Actualizar el badge de estado
function updateStatusBadge(statusBadge, newStatus) {
    // Remover clases de estado anteriores
    statusBadge.classList.remove('status-abierto', 'status-cerrado', 'status-validada');
    
    // Añadir nueva clase de estado
    statusBadge.classList.add(`status-${newStatus}`);
    
    // Actualizar texto
    statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
}







// Cerrar modal
function closeModal(element) {
    const modal = element.closest ? element.closest('.modal-overlay') : element;
    if (modal) {
        modal.remove();
    }
}



// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#6b9c6d' : type === 'error' ? '#a85c5c' : '#5a7fb8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Navegación
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

function navigateTo(page) {
    switch(page) {
        case 'home':
            window.location.href = 'HomeAdmin.html';
            break;
        default:
            console.log('Navegando a:', page);
    }
}

// Cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Aquí iría la lógica de logout
        window.location.href = '../../auth/login.html';
    }
}

// Añadir estilos CSS adicionales para modales
const additionalStyles = `
    <style>

        
        .filter-modal .modal-content {
            max-width: 450px;
        }
        
        .filter-options {
            margin: 25px 0;
        }
        
        .filter-value-modal .modal-content {
            max-width: 400px;
        }
        
        .filter-input-container {
            margin: 25px 0;
        }
        
        .filter-input-container .search-input {
            width: 100%;
            margin: 0;
        }
        
        .inline-filter-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: 20px;
            padding: 8px 15px;
            background: rgba(207, 228, 233, 0.2);
            border: 2px solid #cfe4e9;
            border-radius: 4px;
            animation: slideInRight 0.3s ease;
        }
        
        .inline-filter-input {
            padding: 8px 12px;
            border: 1px solid #cfe4e9;
            border-radius: 2px;
            font-size: 14px;
            color: #2c3e50;
            background: white;
            width: 200px;
            outline: none;
        }
        
        .inline-filter-input:focus {
            border-color: #17a2b8;
            box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.2);
        }
        
        .inline-apply-btn, .inline-cancel-btn {
            padding: 8px 10px;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s ease;
            min-width: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .inline-apply-btn {
            background: #6b9c6d;
            color: white;
        }
        
        .inline-apply-btn:hover {
            background: #5a8a5c;
        }
        
        .inline-cancel-btn {
            background: #a85c5c;
            color: white;
        }
        
        .inline-cancel-btn:hover {
            background: #954d4d;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .inline-status-dropdown {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            border: 2px solid #17a2b8;
            border-radius: 4px;
            padding: 4px 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: fadeIn 0.2s ease;
            z-index: 1000;
            position: relative;
        }
        
        .status-dropdown-select {
            border: none;
            background: transparent;
            color: #2c3e50;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            outline: none;
            padding: 4px;
            text-transform: capitalize;
        }
        
        .status-dropdown-buttons {
            display: flex;
            gap: 4px;
        }
        
        .status-dropdown-btn {
            width: 24px;
            height: 24px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            transition: all 0.2s ease;
        }
        
        .status-dropdown-btn.save-btn {
            background: #6b9c6d;
            color: white;
        }
        
        .status-dropdown-btn.save-btn:hover {
            background: #5a8a5c;
            transform: scale(1.1);
        }
        
        .status-dropdown-btn.cancel-btn {
            background: #a85c5c;
            color: white;
        }
        
        .status-dropdown-btn.cancel-btn:hover {
            background: #954d4d;
            transform: scale(1.1);
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// ======================================
// FUNCIONES PARA ACCIONES DE BITÁCORA
// ======================================

function verDetalleBitacora(usuario, laboratorio, grupo) {
    // Crear parámetros para la URL de detalle
    const params = new URLSearchParams({
        profesor: encodeURIComponent(usuario),
        laboratorio: encodeURIComponent(laboratorio),
        grupo: encodeURIComponent(grupo)
    });
    
    // Navegar a la vista de detalle
    window.location.href = `DetalleBitacora.html?${params.toString()}`;
}

function descargarBitacora(usuario, laboratorio, grupo) {
    // Mostrar notificación de proceso
    showNotification(`Generando PDF de bitácora para ${usuario} - ${grupo}...`, 'info');
    
    // Simular proceso de descarga
    setTimeout(() => {
        showNotification('PDF generado exitosamente', 'success');
        
        // Crear enlace de descarga simulado
        const link = document.createElement('a');
        link.href = '#'; // En implementación real, sería la URL del PDF
        link.download = `Bitacora_${usuario.replace(' ', '_')}_${grupo}_${laboratorio.replace(' ', '_')}.pdf`;
        // link.click(); // Descomentар para activar descarga real
        
        console.log(`Descargando bitácora: ${usuario} - ${laboratorio} - ${grupo}`);
    }, 2000);
}