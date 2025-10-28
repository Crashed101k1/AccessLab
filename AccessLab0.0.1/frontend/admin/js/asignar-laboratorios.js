// Asignar Laboratorios - JavaScript
// Funcionalidades para la gestión de asignaciones de laboratorios

// === VARIABLES GLOBALES ===
let selectedTeacherId = null;
let selectedLabId = null;
let assignments = {};

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    initializeAssignmentPage();
    loadTeachersData();
    loadLaboratoriesData();
});

// Inicializar página de asignaciones
function initializeAssignmentPage() {
    console.log('Inicializando página de Asignar Laboratorios');
    
    // Verificar que estamos en modo asignación
    const isAssignmentMode = localStorage.getItem('accesslab_assignment_mode') === 'true';
    if (!isAssignmentMode) {
        showAlert('Esta página solo está disponible en Modo de Asignación', 'warning');
        setTimeout(() => {
            window.location.href = 'HomeAdmin.html';
        }, 2000);
        return;
    }
    
    // Inicializar datos desde localStorage si existen
    loadAssignmentsFromStorage();
    
    // Si no hay datos, crear algunos ejemplos para demostrar horarios compartidos
    if (Object.keys(assignments).length === 0) {
        createSampleAssignments();
        showInfoMessage('Se han creado asignaciones de ejemplo para demostrar el sistema de horarios compartidos.');
    }
}

// === GESTIÓN DE PROFESORES ===

// Cargar datos de profesores (simulado)
async function loadTeachersData() {
    // Cargar datos de profesores usando la función centralizada
    const teachers = await getTeachersData();
    
    // Guardar datos globalmente para filtros
    window.allTeachersData = teachers;
    
    // Renderizar lista inicial
    renderTeachersList(teachers);
    
    // Configurar filtros
    setupTeacherFilters();
}

// Renderizar lista de profesores
function renderTeachersList(teachers) {
    const teachersList = document.getElementById('teachersList');
    if (!teachersList) return;
    
    teachersList.innerHTML = '';
    
    teachers.forEach(teacher => {
        const assignedCount = assignments[teacher.id] ? Object.keys(assignments[teacher.id]).length : 0;
        const hasAssignments = assignedCount > 0;
        
        const teacherElement = document.createElement('div');
        teacherElement.className = 'teacher-item';
        teacherElement.dataset.teacherId = teacher.id;
        
        teacherElement.innerHTML = `
            <div class="teacher-info">
                <div class="teacher-avatar ${hasAssignments ? 'assigned' : ''}">
                    <i class="fas fa-user"></i>
                </div>
                <div class="teacher-details">
                    <h6>${teacher.username}</h6>
                    <span class="teacher-name">${teacher.name}</span>
                    <span class="teacher-career">${teacher.career}</span>
                    <div class="assignment-count">
                        <i class="fas fa-calendar-alt me-1"></i>
                        <span>${assignedCount} laboratorio${assignedCount !== 1 ? 's' : ''} asignado${assignedCount !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>
            <button class="btn btn-sm ${hasAssignments ? 'btn-outline-success' : 'btn-primary'} assign-btn" 
                    onclick="selectTeacher('${teacher.id}')">
                ${hasAssignments ? 'Modificar' : 'Asignar'}
            </button>
        `;
        
        teachersList.appendChild(teacherElement);
    });
}

// === GESTIÓN DE LABORATORIOS ===

// Cargar datos de laboratorios (simulado)
function loadLaboratoriesData() {
    // En implementación real, esto cargaría desde el backend
    window.laboratoriesData = [
        {
            id: 'lab_001',
            name: 'Laboratorio de Redes',
            type: 'Tecnologías de la Información',
            capacity: 25,
            equipment: ['Computadoras', 'Switches', 'Routers']
        },
        {
            id: 'lab_002',
            name: 'Laboratorio de Automatización',
            type: 'Ingeniería en Mecatrónica',
            capacity: 20,
            equipment: ['PLCs', 'Sensores', 'Actuadores']
        },
        {
            id: 'lab_003',
            name: 'Laboratorio de Química',
            type: 'Tecnologías de la Construcción',
            capacity: 15,
            equipment: ['Microscopios', 'Reactivos', 'Material de vidrio']
        },
        {
            id: 'lab_004',
            name: 'Laboratorio de Cómputo Básico',
            type: 'General',
            capacity: 30,
            equipment: ['Computadoras', 'Proyectores', 'Software Office']
        },
        {
            id: 'lab_005',
            name: 'Laboratorio de Manufactura',
            type: 'Ingeniería Industrial',
            capacity: 18,
            equipment: ['Tornos', 'Fresadoras', 'Herramientas']
        }
    ];
}

// === SELECCIÓN DE PROFESORES ===

// Seleccionar profesor para asignación
function selectTeacher(teacherId) {
    selectedTeacherId = teacherId;
    
    // Encontrar datos del profesor
    const teacherElement = document.querySelector(`[data-teacher-id="${teacherId}"]`);
    if (!teacherElement) return;
    
    const teacherUsername = teacherElement.querySelector('h6').textContent; // Ahora es username
    const teacherName = teacherElement.querySelector('.teacher-name').textContent; // Nombre completo
    const teacherCareer = teacherElement.querySelector('.teacher-career').textContent;
    
    // Actualizar panel de asignación
    showAssignmentContent(teacherUsername, teacherName, teacherCareer);
    renderLaboratoriesForTeacher(teacherId);
    
    // Resaltar profesor seleccionado
    document.querySelectorAll('.teacher-item').forEach(item => {
        item.classList.remove('selected');
    });
    teacherElement.classList.add('selected');
}

// Mostrar contenido de asignación
function showAssignmentContent(teacherUsername, teacherName, teacherCareer) {
    const emptyState = document.getElementById('emptyState');
    const assignmentContent = document.getElementById('assignmentContent');
    const nameElement = document.getElementById('selectedTeacherName');
    const careerElement = document.getElementById('selectedTeacherCareer');
    
    if (emptyState) emptyState.style.display = 'none';
    if (assignmentContent) assignmentContent.style.display = 'block';
    if (nameElement) nameElement.textContent = `${teacherUsername} (${teacherName})`;
    if (careerElement) careerElement.textContent = teacherCareer;
}

// === GESTIÓN DE LABORATORIOS PARA PROFESOR ===

// Renderizar laboratorios para el profesor seleccionado
function renderLaboratoriesForTeacher(teacherId) {
    const laboratoriesGrid = document.getElementById('laboratoriesGrid');
    if (!laboratoriesGrid || !window.laboratoriesData) return;
    
    laboratoriesGrid.innerHTML = '';
    
    window.laboratoriesData.forEach(lab => {
        const isAssignedToTeacher = assignments[teacherId] && assignments[teacherId][lab.id];
        const occupiedSlots = getOccupiedTimeSlots(lab.id, teacherId);
        const hasOtherAssignments = Object.values(occupiedSlots).some(daySlots => daySlots.length > 0);
        
        let statusClass, statusIcon, statusText, clickAction, additionalInfo = '';
        
        if (isAssignedToTeacher) {
            statusClass = 'assigned';
            statusIcon = 'fas fa-user-check';
            statusText = 'Asignado a este profesor';
            clickAction = `onclick="modifyLabAssignment('${lab.id}')"`;
        } else if (hasOtherAssignments) {
            // Laboratorio parcialmente ocupado - verificar si hay horarios disponibles
            const totalOccupiedSlots = Object.values(occupiedSlots).reduce((total, daySlots) => total + daySlots.length, 0);
            statusClass = 'partially-occupied';
            statusIcon = 'fas fa-clock';
            statusText = `Horarios limitados disponibles`;
            clickAction = `onclick="assignLabToTeacher('${lab.id}')"`;
            additionalInfo = `<small class="text-warning"><i class="fas fa-exclamation-triangle me-1"></i>${totalOccupiedSlots} horario${totalOccupiedSlots > 1 ? 's ocupados' : ' ocupado'}</small>`;
        } else {
            statusClass = 'available';
            statusIcon = 'fas fa-check-circle';
            statusText = 'Completamente disponible';
            clickAction = `onclick="assignLabToTeacher('${lab.id}')"`;
        }
        
        const labElement = document.createElement('div');
        labElement.className = `lab-card ${statusClass}`;
        labElement.dataset.labId = lab.id;
        labElement.style.cursor = 'pointer';
        
        labElement.innerHTML = `
            <div class="lab-info">
                <h6>${lab.name}</h6>
                <span class="lab-type">${lab.type}</span>
                <div class="lab-details">
                    <small><i class="fas fa-users me-1"></i>Capacidad: ${lab.capacity}</small>
                    ${additionalInfo}
                </div>
            </div>
            <div class="lab-status ${statusClass}">
                <i class="${statusIcon}"></i>${statusText}
            </div>
        `;
        
        labElement.setAttribute('onclick', clickAction.replace('onclick="', '').replace('"', ''));
        laboratoriesGrid.appendChild(labElement);
    });
}

// Verificar conflictos de horarios específicos en un laboratorio
function hasScheduleConflict(labId, newSchedule, currentTeacherId) {
    // Revisar asignaciones de todos los profesores para este laboratorio
    for (const teacherId in assignments) {
        if (teacherId === currentTeacherId) continue; // Saltarse el profesor actual
        
        if (assignments[teacherId] && assignments[teacherId][labId]) {
            const existingSchedule = assignments[teacherId][labId].schedule;
            
            // Comparar cada día de la nueva programación
            for (const day in newSchedule) {
                if (existingSchedule[day]) {
                    const newStart = timeToMinutes(newSchedule[day].start);
                    const newEnd = timeToMinutes(newSchedule[day].end);
                    const existingStart = timeToMinutes(existingSchedule[day].start);
                    const existingEnd = timeToMinutes(existingSchedule[day].end);
                    
                    // Verificar si hay solapamiento
                    if (newStart < existingEnd && newEnd > existingStart) {
                        return {
                            hasConflict: true,
                            day: day,
                            conflictWith: 'otro profesor',
                            existingTime: `${existingSchedule[day].start} - ${existingSchedule[day].end}`
                        };
                    }
                }
            }
        }
    }
    return { hasConflict: false };
}

// Convertir hora a minutos para comparación fácil
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Obtener horarios ocupados de un laboratorio
function getOccupiedTimeSlots(labId, excludeTeacherId = null) {
    const occupiedSlots = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: []
    };
    
    // Revisar asignaciones de todos los profesores
    for (const teacherId in assignments) {
        if (excludeTeacherId && teacherId === excludeTeacherId) continue;
        
        if (assignments[teacherId] && assignments[teacherId][labId]) {
            const schedule = assignments[teacherId][labId].schedule;
            const teacherName = getTeacherNameById(teacherId);
            
            for (const day in schedule) {
                if (schedule[day]) {
                    occupiedSlots[day].push({
                        start: schedule[day].start,
                        end: schedule[day].end,
                        teacherName: teacherName,
                        teacherId: teacherId
                    });
                }
            }
        }
    }
    
    return occupiedSlots;
}

// Obtener nombre del profesor por ID
function getTeacherNameById(teacherId) {
    const teacherElement = document.querySelector(`[data-teacher-id="${teacherId}"] h6`);
    return teacherElement ? teacherElement.textContent : `usuario_${teacherId}`;
}

// === ASIGNACIÓN DE LABORATORIOS ===

// Asignar laboratorio a profesor
function assignLabToTeacher(labId) {
    if (!selectedTeacherId) return;
    
    selectedLabId = labId;
    const lab = window.laboratoriesData.find(l => l.id === labId);
    if (!lab) return;
    
    // Mostrar sección de configuración de horarios
    showScheduleConfiguration(lab);
}

// Modificar asignación existente
function modifyLabAssignment(labId) {
    if (!selectedTeacherId) return;
    
    selectedLabId = labId;
    const lab = window.laboratoriesData.find(l => l.id === labId);
    if (!lab) return;
    
    // Cargar horarios existentes y mostrar configuración
    loadExistingSchedule(labId);
    showScheduleConfiguration(lab);
}

// === CONFIGURACIÓN DE HORARIOS ===

// Mostrar configuración de horarios
function showScheduleConfiguration(lab) {
    const schedulesSection = document.getElementById('schedulesSection');
    const selectedLabInfo = document.getElementById('selectedLabInfo');
    
    if (schedulesSection) schedulesSection.style.display = 'block';
    
    // Obtener horarios ocupados para este laboratorio
    const occupiedSlots = getOccupiedTimeSlots(selectedLabId, selectedTeacherId);
    const hasOccupiedSlots = Object.values(occupiedSlots).some(daySlots => daySlots.length > 0);
    
    if (selectedLabInfo) {
        let occupiedInfo = '';
        if (hasOccupiedSlots) {
            occupiedInfo = `
                <div class="occupied-slots-info">
                    <h6><i class="fas fa-clock text-info me-2"></i>Disponibilidad de Horarios</h6>
                    <div class="occupied-slots">
                        ${generateOccupiedSlotsDisplay(occupiedSlots)}
                    </div>
                    <small class="text-muted">Los horarios marcados en rojo no están disponibles</small>
                </div>
            `;
        }
        
        selectedLabInfo.innerHTML = `
            <div class="selected-lab-card">
                <div class="lab-icon">
                    <i class="fas fa-flask"></i>
                </div>
                <div class="lab-details">
                    <h6>${lab.name}</h6>
                    <span class="lab-type">${lab.type}</span>
                    <div class="lab-capacity">
                        <i class="fas fa-users me-1"></i>Capacidad: ${lab.capacity} estudiantes
                    </div>
                </div>
            </div>
            ${occupiedInfo}
        `;
    }
    
    // Actualizar los selectores de horarios para mostrar conflictos
    updateTimeSelectorsWithConflicts(occupiedSlots);
    
    // Scroll suave a la sección de horarios
    schedulesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Generar display de horarios ocupados (discreto, sin nombres)
function generateOccupiedSlotsDisplay(occupiedSlots) {
    let html = '';
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const dayNames = {
        monday: 'Lunes',
        tuesday: 'Martes', 
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes'
    };
    
    days.forEach(day => {
        if (occupiedSlots[day] && occupiedSlots[day].length > 0) {
            html += `<div class="occupied-day">`;
            html += `<strong>${dayNames[day]}:</strong> `;
            
            occupiedSlots[day].forEach((slot, index) => {
                if (index > 0) html += ', ';
                html += `<span class="occupied-slot">${slot.start}-${slot.end} <small class="text-muted">(ocupado)</small></span>`;
            });
            
            html += `</div>`;
        }
    });
    
    return html || '<div class="text-success">Todos los horarios están disponibles</div>';
}

// Actualizar selectores de tiempo con indicadores de conflictos
function updateTimeSelectorsWithConflicts(occupiedSlots) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    days.forEach(day => {
        const startSelect = document.querySelector(`select[name="${day}_start"]`);
        const endSelect = document.querySelector(`select[name="${day}_end"]`);
        
        if (startSelect && endSelect) {
            // Remover opciones ocupadas discretamente
            if (occupiedSlots[day] && occupiedSlots[day].length > 0) {
                removeConflictingTimeOptions(startSelect, endSelect, occupiedSlots[day]);
                
                // Marcar visualmente que este día tiene restricciones limitadas
                const dayContainer = startSelect.closest('.schedule-day');
                if (dayContainer) {
                    dayContainer.classList.add('has-limited-availability');
                    
                    // Tooltip discreto
                    const dayLabel = dayContainer.querySelector('.day-label');
                    if (dayLabel) {
                        dayLabel.title = `Algunos horarios no están disponibles`;
                    }
                }
            }
        }
    });
}

// Función para remover discretamente las opciones de tiempo en conflicto
function removeConflictingTimeOptions(startSelect, endSelect, occupiedSlots) {
    occupiedSlots.forEach(slot => {
        const startTime = timeToMinutes(slot.start);
        const endTime = timeToMinutes(slot.end);
        
        // Remover opciones de hora de inicio que caen dentro del rango ocupado
        Array.from(startSelect.options).forEach(option => {
            if (option.value && option.value !== '') {
                const optionTime = timeToMinutes(option.value);
                if (optionTime >= startTime && optionTime < endTime) {
                    option.remove();
                }
            }
        });
        
        // Remover opciones de hora de fin que caen dentro del rango ocupado  
        Array.from(endSelect.options).forEach(option => {
            if (option.value && option.value !== '') {
                const optionTime = timeToMinutes(option.value);
                if (optionTime > startTime && optionTime <= endTime) {
                    option.remove();
                }
            }
        });
    });
}

// Cargar horario existente
function loadExistingSchedule(labId) {
    if (!selectedTeacherId || !assignments[selectedTeacherId] || !assignments[selectedTeacherId][labId]) return;
    
    const schedule = assignments[selectedTeacherId][labId].schedule;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    days.forEach(day => {
        if (schedule && schedule[day]) {
            const startSelect = document.querySelector(`select[name="${day}_start"]`);
            const endSelect = document.querySelector(`select[name="${day}_end"]`);
            
            if (startSelect) startSelect.value = schedule[day].start || '';
            if (endSelect) endSelect.value = schedule[day].end || '';
        }
    });
}

// Guardar horario del laboratorio
function saveLabSchedule() {
    if (!selectedTeacherId || !selectedLabId) return;
    
    const schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let hasSchedule = false;
    
    days.forEach(day => {
        const startSelect = document.querySelector(`select[name="${day}_start"]`);
        const endSelect = document.querySelector(`select[name="${day}_end"]`);
        
        if (startSelect && endSelect && startSelect.value && endSelect.value) {
            schedule[day] = {
                start: startSelect.value,
                end: endSelect.value
            };
            hasSchedule = true;
        }
    });
    
    if (!hasSchedule) {
        showAlert('Por favor configura al menos un día de la semana', 'warning');
        return;
    }
    
    // Validar horarios
    if (!validateSchedule(schedule)) {
        return;
    }
    
    // Guardar asignación
    if (!assignments[selectedTeacherId]) {
        assignments[selectedTeacherId] = {};
    }
    
    const lab = window.laboratoriesData.find(l => l.id === selectedLabId);
    const teacherName = getTeacherNameById(selectedTeacherId);
    
    assignments[selectedTeacherId][selectedLabId] = {
        labName: lab.name,
        labType: lab.type,
        schedule: schedule,
        assignedDate: new Date().toISOString(),
        teacherName: teacherName
    };
    
    // Guardar en localStorage
    saveAssignmentsToStorage();
    
    // Actualizar UI
    showAlert(`Laboratorio "${lab.name}" asignado exitosamente`, 'success');
    hideScheduleConfiguration();
    renderLaboratoriesForTeacher(selectedTeacherId);
    
    // Recargar lista de profesores
    getTeachersData().then(teachers => {
        renderTeachersList(teachers);
    });
}

// Validar horarios y conflictos
function validateSchedule(schedule) {
    // Validación básica de horarios
    for (const day in schedule) {
        const start = schedule[day].start;
        const end = schedule[day].end;
        
        if (start >= end) {
            showAlert(`El horario del ${getDayName(day)} es inválido: la hora de fin debe ser posterior a la de inicio`, 'error');
            return false;
        }
    }
    
    // Validación de conflictos con otros profesores
    if (selectedLabId && selectedTeacherId) {
        const conflictResult = hasScheduleConflict(selectedLabId, schedule, selectedTeacherId);
        if (conflictResult.hasConflict) {
            showAlert(
                `El horario del ${getDayName(conflictResult.day)} no está disponible.\n\n` +
                `Este laboratorio ya tiene asignaciones en el horario ${conflictResult.existingTime}.\n\n` +
                `Por favor selecciona un horario diferente.`, 
                'warning'
            );
            return false;
        }
    }
    
    return true;
}

// Obtener nombre del día
function getDayName(day) {
    const days = {
        monday: 'lunes',
        tuesday: 'martes', 
        wednesday: 'miércoles',
        thursday: 'jueves',
        friday: 'viernes'
    };
    return days[day] || day;
}

// Cancelar configuración de horario
function cancelScheduleConfiguration() {
    hideScheduleConfiguration();
    clearScheduleForm();
}

// Ocultar configuración de horarios
function hideScheduleConfiguration() {
    const schedulesSection = document.getElementById('schedulesSection');
    if (schedulesSection) schedulesSection.style.display = 'none';
    selectedLabId = null;
}

// Limpiar formulario de horarios
function clearScheduleForm() {
    const selects = document.querySelectorAll('#schedulesSection select');
    selects.forEach(select => select.value = '');
}

// === ALMACENAMIENTO DE DATOS ===

// Guardar asignaciones en localStorage
function saveAssignmentsToStorage() {
    localStorage.setItem('accesslab_assignments', JSON.stringify(assignments));
}

// Cargar asignaciones desde localStorage
function loadAssignmentsFromStorage() {
    const stored = localStorage.getItem('accesslab_assignments');
    if (stored) {
        assignments = JSON.parse(stored);
    }
}

// === FUNCIONES DE UTILIDAD ===

// Limpiar selección
function clearSelection() {
    selectedTeacherId = null;
    selectedLabId = null;
    
    // Ocultar contenido de asignación
    const emptyState = document.getElementById('emptyState');
    const assignmentContent = document.getElementById('assignmentContent');
    
    if (emptyState) emptyState.style.display = 'block';
    if (assignmentContent) assignmentContent.style.display = 'none';
    
    // Quitar selección visual
    document.querySelectorAll('.teacher-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    hideScheduleConfiguration();
}

// Función de búsqueda ahora manejada por setupTeacherFilters()

// === MODALES Y ALERTAS ===

// Mostrar resumen de asignaciones
function showAssignmentSummary() {
    let totalAssignments = 0;
    let professorsWithAssignments = 0;
    
    for (const teacherId in assignments) {
        const teacherAssignments = Object.keys(assignments[teacherId]).length;
        if (teacherAssignments > 0) {
            totalAssignments += teacherAssignments;
            professorsWithAssignments++;
        }
    }
    
    const modalHtml = `
        <div class="modal fade" id="summaryModal" tabindex="-1" aria-labelledby="summaryModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="summaryModalLabel">
                            <i class="fas fa-chart-pie me-2"></i>Resumen de Asignaciones
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="summary-stats">
                            <div class="stat-item">
                                <div class="stat-number">${totalAssignments}</div>
                                <div class="stat-label">Laboratorios Asignados</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${professorsWithAssignments}</div>
                                <div class="stat-label">Profesores con Asignaciones</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${window.laboratoriesData ? window.laboratoriesData.length - totalAssignments : 0}</div>
                                <div class="stat-label">Laboratorios Disponibles</div>
                            </div>
                        </div>
                        
                        ${totalAssignments > 0 ? `
                            <div class="assignments-detail mt-4">
                                <h6>Detalle de Asignaciones:</h6>
                                <div class="assignments-list">
                                    ${generateAssignmentsList()}
                                </div>
                            </div>
                        ` : `
                            <div class="alert alert-info mt-3">
                                <i class="fas fa-info-circle me-2"></i>
                                Aún no se han realizado asignaciones.
                            </div>
                        `}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal('summaryModal', modalHtml);
}

// Generar lista de asignaciones para el resumen
function generateAssignmentsList() {
    let html = '';
    
    for (const teacherId in assignments) {
        if (Object.keys(assignments[teacherId]).length > 0) {
            const teacherElement = document.querySelector(`[data-teacher-id="${teacherId}"]`);
            const teacherName = teacherElement ? teacherElement.querySelector('h6').textContent : 'Profesor Desconocido';
            
            html += `<div class="teacher-assignment">`;
            html += `<strong>${teacherName}:</strong>`;
            html += `<ul>`;
            
            for (const labId in assignments[teacherId]) {
                const assignment = assignments[teacherId][labId];
                html += `<li>${assignment.labName} (${assignment.labType})</li>`;
            }
            
            html += `</ul>`;
            html += `</div>`;
        }
    }
    
    return html;
}

// Modal para guardar asignaciones
function showSaveAssignmentsModal() {
    const totalAssignments = Object.values(assignments).reduce((total, teacher) => total + Object.keys(teacher).length, 0);
    
    if (totalAssignments === 0) {
        showAlert('No hay asignaciones para guardar', 'warning');
        return;
    }
    
    const modalHtml = `
        <div class="modal fade" id="saveModal" tabindex="-1" aria-labelledby="saveModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="saveModalLabel">
                            <i class="fas fa-save me-2"></i>Guardar Asignaciones
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle me-2"></i>
                            <strong>${totalAssignments} asignación${totalAssignments !== 1 ? 'es' : ''}</strong> lista${totalAssignments !== 1 ? 's' : ''} para guardar.
                        </div>
                        <p>¿Deseas confirmar y guardar todas las asignaciones de laboratorios?</p>
                        <div class="save-note">
                            <small class="text-muted">
                                <i class="fas fa-info-circle me-1"></i>
                                Las asignaciones se aplicarán para el próximo periodo académico.
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" onclick="confirmSaveAssignments()">
                            <i class="fas fa-save me-2"></i>Confirmar y Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal('saveModal', modalHtml);
}

// Confirmar guardado de asignaciones
function confirmSaveAssignments() {
    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('saveModal'));
    if (modal) modal.hide();
    
    // Simular guardado en backend
    setTimeout(() => {
        showAlert('Asignaciones guardadas exitosamente', 'success');
        
        // Opcional: redirigir al dashboard después del guardado
        setTimeout(() => {
            if (confirm('¿Deseas regresar al dashboard principal?')) {
                window.location.href = 'HomeAdmin.html';
            }
        }, 2000);
    }, 1000);
}

// Función genérica para mostrar modales
function showModal(modalId, modalHtml) {
    // Remover modal existente
    const existingModal = document.getElementById(modalId);
    if (existingModal) existingModal.remove();
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
    
    // Limpiar cuando se cierre
    document.getElementById(modalId).addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} assignment-alert`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation-triangle' : 'info'}-circle me-2"></i>
        ${message}
    `;
    
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        transform: translateX(100%);
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => alert.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Función específica para mensajes informativos
function showInfoMessage(message) {
    showAlert(message, 'info');
}

// === FILTROS DE BÚSQUEDA ===

// Configurar filtros de profesores
function setupTeacherFilters() {
    const searchInput = document.getElementById('teacherSearch');
    const careerFilter = document.getElementById('careerFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterTeachers);
    }
    
    if (careerFilter) {
        careerFilter.addEventListener('change', filterTeachers);
    }
}

// Filtrar profesores basado en los criterios de búsqueda
function filterTeachers() {
    const searchTerm = document.getElementById('teacherSearch')?.value.toLowerCase() || '';
    const selectedCareer = document.getElementById('careerFilter')?.value || '';
    
    if (!window.allTeachersData) return;
    
    const filteredTeachers = window.allTeachersData.filter(teacher => {
        const matchesSearch = teacher.username.toLowerCase().includes(searchTerm) || 
                            teacher.name.toLowerCase().includes(searchTerm);
        const matchesCareer = !selectedCareer || teacher.career === selectedCareer;
        
        return matchesSearch && matchesCareer;
    });
    
    renderTeachersList(filteredTeachers);
    
    // Mostrar mensaje si no hay resultados
    if (filteredTeachers.length === 0) {
        showNoResultsMessage();
    }
}

// Limpiar todos los filtros
function clearFilters() {
    const searchInput = document.getElementById('teacherSearch');
    const careerFilter = document.getElementById('careerFilter');
    
    if (searchInput) searchInput.value = '';
    if (careerFilter) careerFilter.value = '';
    
    // Mostrar todos los profesores
    if (window.allTeachersData) {
        renderTeachersList(window.allTeachersData);
    }
}

// Mostrar mensaje cuando no hay resultados
function showNoResultsMessage() {
    const teachersList = document.getElementById('teachersList');
    if (!teachersList) return;
    
    const noResultsHtml = `
        <div class="no-results-message">
            <div class="text-center py-4">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No se encontraron profesores</h6>
                <p class="text-muted mb-3">Intenta ajustar los filtros de búsqueda</p>
                <button class="btn btn-outline-primary btn-sm" onclick="clearFilters()">
                    <i class="fas fa-times me-1"></i>Limpiar filtros
                </button>
            </div>
        </div>
    `;
    
    teachersList.innerHTML = noResultsHtml;
}

// Crear asignaciones de ejemplo para demostrar horarios compartidos
function createSampleAssignments() {
    // Ejemplo: maria.garcia tiene horarios en Laboratorio de Automatización
    assignments['prof_002'] = {
        'lab_002': {
            labName: 'Laboratorio de Automatización',
            labType: 'Ingeniería en Mecatrónica',
            schedule: {
                monday: { start: '08:00', end: '09:00' },
                tuesday: { start: '09:00', end: '11:00' },
                friday: { start: '07:00', end: '09:00' }
            },
            assignedDate: new Date().toISOString(),
            teacherName: 'maria.garcia'
        }
    };
    
    // Ejemplo: Crear una asignación en Laboratorio de Redes para mostrar disponibilidad parcial
    assignments['prof_004'] = {
        'lab_001': {
            labName: 'Laboratorio de Redes',
            labType: 'Tecnologías de la Información',
            schedule: {
                wednesday: { start: '10:00', end: '11:00' },
                thursday: { start: '14:00', end: '16:00' }
            },
            assignedDate: new Date().toISOString(),
            teacherName: 'ana.martinez'
        }
    };
    
    // Guardar en localStorage
    saveAssignmentsToStorage();
    
    console.log('Asignaciones de ejemplo creadas para demostrar horarios compartidos');
}

// Función para obtener datos de profesores (async para futuras implementaciones)
async function getTeachersData() {
    // Esta función se puede expandir para cargar datos reales
    return [
        {
            id: 'prof_001',
            username: 'juan.perez',
            name: 'Juan Pérez',
            career: 'Tecnologías de la Información',
            assignedLabs: []
        },
        {
            id: 'prof_002',
            username: 'maria.garcia',
            name: 'María García',
            career: 'Ingeniería en Mecatrónica',
            assignedLabs: []
        },
        {
            id: 'prof_003',
            username: 'carlos.lopez',
            name: 'Carlos López',
            career: 'Gestión Administrativa',
            assignedLabs: []
        },
        {
            id: 'prof_004',
            username: 'ana.martinez',
            name: 'Ana Martínez',
            career: 'Ingeniería Industrial',
            assignedLabs: []
        },
        {
            id: 'prof_005',
            username: 'luis.hernandez',
            name: 'Luis Hernández',
            career: 'Tecnologías de la Construcción',
            assignedLabs: []
        },
        {
            id: 'prof_006',
            username: 'sofia.rodriguez',
            name: 'Sofía Rodríguez',
            career: 'Tecnologías de la Información',
            assignedLabs: []
        },
        {
            id: 'prof_007',
            username: 'miguel.santos',
            name: 'Miguel Santos',
            career: 'Ingeniería en Mecatrónica',
            assignedLabs: []
        },
        {
            id: 'prof_008',
            username: 'laura.morales',
            name: 'Laura Morales',
            career: 'Gestión Administrativa',
            assignedLabs: []
        },
        {
            id: 'prof_009',
            username: 'diego.vargas',
            name: 'Diego Vargas',
            career: 'Ingeniería Industrial',
            assignedLabs: []
        },
        {
            id: 'prof_010',
            username: 'patricia.cruz',
            name: 'Patricia Cruz',
            career: 'Tecnologías de la Construcción',
            assignedLabs: []
        }
    ];
}