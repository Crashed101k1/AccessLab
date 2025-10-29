// ======================================
// SISTEMA DE SOLICITUDES - JAVASCRIPT
// ======================================

// Datos de técnicos asignados por laboratorio
let tecnicosLaboratorios = {
    "Laboratorio de Redes": { nombre: "Téc. López Martín", email: "tecnico.lopez@utm.edu.mx" },
    "Laboratorio de Sistemas": { nombre: "Téc. García Ruiz", email: "tecnico.garcia@utm.edu.mx" },
    "Laboratorio de Electrónica": { nombre: "Téc. Morales Silva", email: "tecnico.morales@utm.edu.mx" },
    "Laboratorio Industrial": { nombre: "Téc. Hernández Cruz", email: "tecnico.hernandez@utm.edu.mx" },
    "Laboratorio de Física": { nombre: "Téc. Rivera Santos", email: "tecnico.rivera@utm.edu.mx" }
};

// Datos de prueba - Solicitudes diversificadas para ambas pestañas
let solicitudesData = [];

// Usuario actual simulado
let currentUser = {
    nombre: "Administrador Sistema",
    rol: "Admin",
    permisos: ["crear", "ver", "aprobar", "rechazar", "descargar"]
};

// Variables de control
let solicitudSeleccionada = null;
let modoCreacion = false;

// ======================================
// INICIALIZACIÓN
// ======================================
document.addEventListener('DOMContentLoaded', function() {
    // Configurar interfaz según permisos del rol (debe ir primero)
    configurarInterfazPorRol();
    
    // Cargar datos iniciales por pestañas
    cargarSolicitudesPorPestañas();
    showEmptyState();
    setupEventListeners();
    
    // Configurar filtro de revisión
    const filtroRevision = document.getElementById('filtro-estado-revision');
    if (filtroRevision) {
        filtroRevision.addEventListener('change', filtrarSolicitudesRevision);
    }
    

});

// ======================================
// RENDERIZADO DE LISTA
// ======================================
function renderSolicitudesList() {
    const container = document.getElementById('solicitudes-list');
    container.innerHTML = '';

    if (solicitudesData.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-clipboard-list text-muted fa-2x mb-2"></i>
                <p class="text-muted">No hay solicitudes</p>
            </div>
        `;
        return;
    }

    // Ordenar por fecha más reciente
    const sortedSolicitudes = [...solicitudesData].sort((a, b) => 
        new Date(b.fecha_solicitud) - new Date(a.fecha_solicitud)
    );

    sortedSolicitudes.forEach(solicitud => {
        const item = createSolicitudItem(solicitud);
        container.appendChild(item);
    });

    // Actualizar contador
    updateContador();
}

function createSolicitudItem(solicitud) {
    const div = document.createElement('div');
    div.className = 'solicitud-item';
    div.setAttribute('data-id', solicitud.id);
    div.onclick = () => selectSolicitud(solicitud.id);

    div.innerHTML = `
        <div class="solicitud-header">
            <h6 class="solicitud-nombre">${solicitud.nombre}</h6>
            <span class="solicitud-fecha">${formatearFecha(solicitud.fecha_solicitud)}</span>
        </div>
        <div class="solicitud-info">
            <small class="text-muted d-block">${solicitud.solicitante}</small>
            <small class="text-muted">${solicitud.tipo}</small>
        </div>
        <span class="solicitud-estado estado-${solicitud.estado}">${getEstadoTexto(solicitud.estado)}</span>
    `;

    return div;
}

// ======================================
// VISUALIZACIÓN DE SOLICITUDES
// ======================================
function selectSolicitud(id) {
    // Remover selección anterior
    document.querySelectorAll('.solicitud-item').forEach(item => {
        item.classList.remove('active');
    });

    // Agregar selección actual
    const selectedItem = document.querySelector(`[data-id="${id}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }

    const solicitud = solicitudesData.find(s => s.id === id);
    if (solicitud) {
        solicitudSeleccionada = solicitud;
        modoCreacion = false;
        showSolicitudDetail(solicitud);
        updateViewerHeader('Detalles de Solicitud');
    }
}

function showSolicitudDetail(solicitud) {
    const container = document.getElementById('viewer-content');
    
    container.innerHTML = `
        <div class="solicitud-content">
            <div class="solicitud-info-grid">
                <div class="info-field">
                    <div class="info-label">Solicitante</div>
                    <p class="info-value">${solicitud.solicitante}</p>
                </div>
                <div class="info-field">
                    <div class="info-label">Tipo de Solicitud</div>
                    <p class="info-value">${solicitud.tipo}</p>
                </div>
                <div class="info-field">
                    <div class="info-label">Fecha de Solicitud</div>
                    <p class="info-value">${formatearFecha(solicitud.fecha_solicitud)}</p>
                </div>
                <div class="info-field">
                    <div class="info-label">Estado Actual</div>
                    <p class="info-value">
                        <span class="solicitud-estado estado-${solicitud.estado}">
                            ${getEstadoTexto(solicitud.estado)}
                        </span>
                    </p>
                </div>
            </div>

            ${generarCamposEspecificos(solicitud)}

            <div class="solicitud-descripcion">
                <h6>Descripción de la Solicitud</h6>
                <p>${solicitud.descripcion}</p>
            </div>

            ${solicitud.observaciones ? `
                <div class="solicitud-descripcion">
                    <h6>Observaciones</h6>
                    <p>${solicitud.observaciones}</p>
                </div>
            ` : ''}

            ${generarAccionesEstado(solicitud)}
        </div>
    `;
}

function generarCamposEspecificos(solicitud) {
    let campos = `
        <div class="solicitud-info-grid">
            <div class="info-field">
                <div class="info-label">Email</div>
                <p class="info-value">${solicitud.email}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Teléfono</div>
                <p class="info-value">${solicitud.telefono || 'No proporcionado'}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Dirigida a</div>
                <p class="info-value">${solicitud.dirigida_a}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Laboratorio</div>
                <p class="info-value">${solicitud.laboratorio}</p>
            </div>
    `;

    // Campos específicos según el tipo
    if (solicitud.tipo === "Reserva") {
        campos += `
            <div class="info-field">
                <div class="info-label">Fecha de Reserva</div>
                <p class="info-value">${formatearFecha(solicitud.fecha_reserva)}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Horario</div>
                <p class="info-value">${solicitud.hora_inicio} - ${solicitud.hora_fin}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Participantes</div>
                <p class="info-value">${solicitud.participantes} estudiantes</p>
            </div>
            <div class="info-field">
                <div class="info-label">Materia/Asignatura</div>
                <p class="info-value">${solicitud.materia || 'No especificada'}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Grupo</div>
                <p class="info-value">${solicitud.grupo || 'No especificado'}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Tipo de Actividad</div>
                <p class="info-value">${solicitud.tipo_actividad || 'No especificado'}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Recursos Específicos</div>
                <p class="info-value">${solicitud.recursos_especificos || 'No especificado'}</p>
            </div>
        `;
    } else if (solicitud.tipo === "Soporte") {
        campos += `
            <div class="info-field">
                <div class="info-label">Tipo de Problema</div>
                <p class="info-value">${solicitud.tipo_problema}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Equipo Afectado</div>
                <p class="info-value">${solicitud.equipo_afectado}</p>
            </div>
            <div class="info-field">
                <div class="info-label">Prioridad</div>
                <p class="info-value">${solicitud.prioridad}</p>
            </div>
        `;
        
        if (solicitud.tecnico_asignado) {
            campos += `
                <div class="info-field">
                    <div class="info-label">Técnico Asignado</div>
                    <p class="info-value">${solicitud.tecnico_asignado.nombre}</p>
                </div>
                <div class="info-field">
                    <div class="info-label">Email del Técnico</div>
                    <p class="info-value">${solicitud.tecnico_asignado.email}</p>
                </div>
            `;
        }
    }

    campos += `
            <div class="info-field">
                <div class="info-label">Departamento</div>
                <p class="info-value">${solicitud.departamento || solicitud.carrera || 'No especificado'}</p>
            </div>
            <div class="info-field">
                <div class="info-label">No. Empleado</div>
                <p class="info-value">${solicitud.numero_empleado || 'No especificado'}</p>
            </div>
        </div>
    `;

    return campos;
}

function generarAccionesEstado(solicitud) {
    if (solicitud.estado === 'pendiente') {
        return `
            <div class="estado-actions">
                <button class="btn btn-aprobar" onclick="cambiarEstado(${solicitud.id}, 'aprobado')">
                    <i class="fas fa-check"></i> Aprobar
                </button>
                <button class="btn btn-rechazar" onclick="cambiarEstado(${solicitud.id}, 'rechazado')">
                    <i class="fas fa-times"></i> Rechazar
                </button>
                <button class="btn btn-descargar" onclick="descargarSolicitud(${solicitud.id})">
                    <i class="fas fa-download"></i> Descargar
                </button>
            </div>
        `;
    } else {
        return `
            <div class="estado-actions">
                <button class="btn btn-descargar" onclick="descargarSolicitud(${solicitud.id})">
                    <i class="fas fa-download"></i> Descargar
                </button>
            </div>
        `;
    }
}

// ======================================
// CREAR NUEVA SOLICITUD
// ======================================
function showCrearSolicitud() {
    // Verificar permisos antes de mostrar el formulario
    if (!puedeRealizarAccion('crear')) {
        showNotification('No tienes permisos para crear solicitudes', 'error');
        return;
    }
    
    // Limpiar selección
    document.querySelectorAll('.solicitud-item').forEach(item => {
        item.classList.remove('active');
    });

    modoCreacion = true;
    solicitudSeleccionada = null;
    updateViewerHeader('Nueva Solicitud');
    
    const container = document.getElementById('viewer-content');
    container.innerHTML = `
        <div class="nueva-solicitud-form">
            <form id="nueva-solicitud-form">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Tipo de Solicitud *</label>
                            <select class="form-select" id="tipo-solicitud" required onchange="tipoSolicitudChanged()">
                                <option value="">Seleccionar tipo...</option>
                                <option value="Reserva">Reserva de Laboratorio</option>
                                <option value="Soporte">Soporte y Mantenimiento</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Nombre de la Solicitud *</label>
                            <input type="text" class="form-control" id="nombre-solicitud" 
                                   placeholder="Ej: Solicitud Lab Redes" required>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Nombre Completo *</label>
                            <input type="text" class="form-control" id="solicitante" 
                                   placeholder="Nombre completo del solicitante" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label class="form-label">Email Institucional *</label>
                            <input type="email" class="form-control" id="email" 
                                   placeholder="correo@utm.edu.mx" required>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="form-label">Departamento/Área *</label>
                            <select class="form-select" id="departamento" required>
                                <option value="">Seleccionar departamento...</option>
                                <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
                                <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                                <option value="Ingeniería Mecatrónica">Ingeniería Mecatrónica</option>
                                <option value="Ciencias Básicas">Ciencias Básicas</option>
                                <option value="Dirección">Dirección Académica</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="form-label">Empleado No. *</label>
                            <input type="text" class="form-control" id="numero-empleado" 
                                   placeholder="Ej: EMP001" required>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label class="form-label">Teléfono Extensión</label>
                            <input type="tel" class="form-control" id="telefono" 
                                   placeholder="443-123-4567 Ext. 101">
                        </div>
                    </div>
                </div>

                <div id="campos-especificos">
                    <!-- Se llenan dinámicamente según el tipo -->
                </div>

                <div class="form-group">
                    <label class="form-label">Descripción de la Solicitud *</label>
                    <textarea class="form-control form-textarea" id="descripcion" 
                              placeholder="Describe detalladamente tu solicitud..." required></textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Observaciones</label>
                    <textarea class="form-control" id="observaciones" rows="3"
                              placeholder="Información adicional o consideraciones especiales..."></textarea>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary-custom" onclick="cancelarCreacion()">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                    <button type="submit" class="btn btn-primary-custom">
                        <i class="fas fa-paper-plane"></i> Enviar Solicitud
                    </button>
                </div>
            </form>
        </div>
    `;

    // Setup form events
    setupFormEvents();
}

function tipoSolicitudChanged() {
    const tipo = document.getElementById('tipo-solicitud').value;
    const container = document.getElementById('campos-especificos');
    
    let campos = '';
    
    if (tipo === 'Reserva') {
        campos = `
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Dirigida a *</label>
                        <select class="form-select" id="dirigida-a" required>
                            <option value="">Seleccionar destinatario...</option>
                            <option value="Director/Subdirector">Director/Subdirector</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Laboratorio *</label>
                        <select class="form-select" id="laboratorio" required>
                            <option value="">Seleccionar laboratorio...</option>
                            <option value="Laboratorio de Redes">Laboratorio de Redes</option>
                            <option value="Laboratorio de Sistemas">Laboratorio de Sistemas</option>
                            <option value="Laboratorio de Electrónica">Laboratorio de Electrónica</option>
                            <option value="Laboratorio Industrial">Laboratorio Industrial</option>
                            <option value="Laboratorio de Física">Laboratorio de Física</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Fecha de Reserva *</label>
                        <input type="date" class="form-control" id="fecha-reserva" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Participantes *</label>
                        <input type="number" class="form-control" id="participantes" 
                               min="1" max="30" placeholder="Número de personas" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Hora Inicio *</label>
                        <input type="time" class="form-control" id="hora-inicio" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Hora Fin *</label>
                        <input type="time" class="form-control" id="hora-fin" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Materia/Asignatura *</label>
                        <input type="text" class="form-control" id="materia" 
                               placeholder="Ej: Redes de Computadoras" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Grupo</label>
                        <input type="text" class="form-control" id="grupo" 
                               placeholder="Ej: 7A, ISC-601">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Tipo de Actividad *</label>
                        <select class="form-select" id="tipo-actividad" required>
                            <option value="">Seleccionar actividad...</option>
                            <option value="Práctica de Laboratorio">Práctica de Laboratorio</option>
                            <option value="Proyecto Final">Proyecto Final</option>
                            <option value="Examen Práctico">Examen Práctico</option>
                            <option value="Taller Especializado">Taller Especializado</option>
                            <option value="Capacitación">Capacitación</option>
                            <option value="Conferencia">Conferencia</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Recursos Específicos</label>
                        <input type="text" class="form-control" id="recursos-especificos" 
                               placeholder="Ej: Equipos Cisco, Osciloscopios">
                    </div>
                </div>
            </div>
        `;
    } else if (tipo === 'Soporte') {
        campos = `
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Dirigida a *</label>
                        <select class="form-select" id="dirigida-a" required onchange="dirigidaAChanged()">
                            <option value="">Seleccionar destinatario...</option>
                            <option value="Técnico">Técnico</option>
                            <option value="Director/Subdirector">Director/Subdirector</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Laboratorio *</label>
                        <select class="form-select" id="laboratorio" required onchange="laboratorioChanged()">
                            <option value="">Seleccionar laboratorio...</option>
                            <option value="Laboratorio de Redes">Laboratorio de Redes</option>
                            <option value="Laboratorio de Sistemas">Laboratorio de Sistemas</option>
                            <option value="Laboratorio de Electrónica">Laboratorio de Electrónica</option>
                            <option value="Laboratorio Industrial">Laboratorio Industrial</option>
                            <option value="Laboratorio de Física">Laboratorio de Física</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="tecnico-asignado-container"></div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Tipo de Problema *</label>
                        <select class="form-select" id="tipo-problema" required>
                            <option value="">Seleccionar tipo...</option>
                            <option value="Mantenimiento de Hardware">Mantenimiento de Hardware</option>
                            <option value="Mantenimiento de Software">Mantenimiento de Software</option>
                            <option value="Reparación de Equipos">Reparación de Equipos</option>
                            <option value="Instalación de Software">Instalación de Software</option>
                            <option value="Conectividad de Red">Conectividad de Red</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Prioridad *</label>
                        <select class="form-select" id="prioridad" required>
                            <option value="">Seleccionar prioridad...</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                            <option value="Crítica">Crítica</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label class="form-label">Equipo Afectado</label>
                        <input type="text" class="form-control" id="equipo-afectado" 
                               placeholder="Ej: PC-Lab-01, Proyector, Router principal">
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = campos;
}

function dirigidaAChanged() {
    updateTecnicoAsignado();
}

function laboratorioChanged() {
    updateTecnicoAsignado();
}

function updateTecnicoAsignado() {
    const dirigidaA = document.getElementById('dirigida-a')?.value;
    const laboratorio = document.getElementById('laboratorio')?.value;
    const container = document.getElementById('tecnico-asignado-container');
    
    if (!container) return;
    
    if (dirigidaA === 'Técnico' && laboratorio && tecnicosLaboratorios[laboratorio]) {
        const tecnico = tecnicosLaboratorios[laboratorio];
        container.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Técnico Asignado</label>
                        <input type="text" class="form-control" value="${tecnico.nombre}" readonly style="background-color: #f8f9fa;">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="form-label">Email del Técnico</label>
                        <input type="email" class="form-control" value="${tecnico.email}" readonly style="background-color: #f8f9fa;">
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = '';
    }
}

// ======================================
// FUNCIONES DE EVENTOS
// ======================================
function setupEventListeners() {
    const crearBtn = document.getElementById('btn-crear-solicitud');
    if (crearBtn) {
        crearBtn.addEventListener('click', showCrearSolicitud);
    }
}

function setupFormEvents() {
    const form = document.getElementById('nueva-solicitud-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarNuevaSolicitud();
        });
    }
}

function procesarNuevaSolicitud() {
    // Recopilar datos del formulario
    const formData = {
        id: Date.now(),
        nombre: document.getElementById('nombre-solicitud').value,
        tipo: document.getElementById('tipo-solicitud').value,
        dirigida_a: document.getElementById('dirigida-a').value,
        laboratorio: document.getElementById('laboratorio').value,
        solicitante: document.getElementById('solicitante').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        carrera: document.getElementById('carrera').value,
        semestre: document.getElementById('semestre').value,
        descripcion: document.getElementById('descripcion').value,
        observaciones: document.getElementById('observaciones').value,
        fecha_solicitud: new Date().toISOString().slice(0, 10),
        estado: 'pendiente'
    };

    // Agregar campos específicos según el tipo
    const tipo = formData.tipo;
    if (tipo === 'Reserva') {
        formData.fecha_reserva = document.getElementById('fecha-reserva').value;
        formData.hora_inicio = document.getElementById('hora-inicio').value;
        formData.hora_fin = document.getElementById('hora-fin').value;
        formData.participantes = parseInt(document.getElementById('participantes').value);
        formData.materia = document.getElementById('materia').value;
        formData.grupo = document.getElementById('grupo').value;
        formData.tipo_actividad = document.getElementById('tipo-actividad').value;
        formData.recursos_especificos = document.getElementById('recursos-especificos').value;
        formData.departamento = document.getElementById('departamento').value;
        formData.numero_empleado = document.getElementById('numero-empleado').value;
    } else if (tipo === 'Soporte') {
        formData.tipo_problema = document.getElementById('tipo-problema').value;
        formData.equipo_afectado = document.getElementById('equipo-afectado').value;
        formData.prioridad = document.getElementById('prioridad').value;
        
        // Asignar técnico automáticamente si es dirigida a técnico
        if (formData.dirigida_a === 'Técnico' && formData.laboratorio && tecnicosLaboratorios[formData.laboratorio]) {
            formData.tecnico_asignado = tecnicosLaboratorios[formData.laboratorio];
        }
    }

    // Agregar a la lista
    solicitudesData.unshift(formData);
    renderSolicitudesList();
    
    // Mostrar la nueva solicitud
    selectSolicitud(formData.id);
    
    showNotification('Solicitud creada exitosamente', 'success');
}

function cancelarCreacion() {
    modoCreacion = false;
    showEmptyState();
    updateViewerHeader('Seleccionar Solicitud');
}

// ======================================
// ACCIONES DE SOLICITUDES
// ======================================
function cambiarEstado(id, nuevoEstado) {
    const solicitud = solicitudesData.find(s => s.id === id);
    if (solicitud) {
        solicitud.estado = nuevoEstado;
        renderSolicitudesList();
        showSolicitudDetail(solicitud);
        
        const estadoTexto = getEstadoTexto(nuevoEstado);
        showNotification(`Solicitud ${estadoTexto.toLowerCase()}`, 'success');
    }
}

function descargarSolicitud(id) {
    const solicitud = solicitudesData.find(s => s.id === id);
    if (solicitud) {
        // Simular descarga
        showNotification('Descargando solicitud...', 'info');
        setTimeout(() => {
            showNotification('Solicitud descargada exitosamente', 'success');
        }, 1500);
    }
}

// ======================================
// FUNCIONES AUXILIARES
// ======================================
function showEmptyState() {
    const container = document.getElementById('viewer-content');
    container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            <h5>Selecciona una solicitud</h5>
            <p>Haz clic en una solicitud de la lista para ver sus detalles completos y realizar las acciones correspondientes.</p>
        </div>
    `;
}

function updateViewerHeader(titulo) {
    const headerTitle = document.querySelector('.viewer-title');
    if (headerTitle) {
        headerTitle.innerHTML = `<i class="fas fa-file-alt"></i> ${titulo}`;
    }
}

function updateContador() {
    const contador = document.getElementById('contador-solicitudes');
    if (contador) {
        contador.textContent = solicitudesData.length;
    }
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
    });
}

function getEstadoTexto(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'aprobado': 'Aprobado',
        'rechazado': 'Rechazado'
    };
    return estados[estado] || 'Desconocido';
}

function formatearEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente de Revisión',
        'aprobado': 'Aprobado ✓',
        'rechazado': 'Rechazado ✗'
    };
    return estados[estado] || 'Estado Desconocido';
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'danger'} notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : type === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle';
    notification.innerHTML = `<i class="fas ${iconClass}"></i> ${message}`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ======================================
// ESTILOS CSS DINÁMICOS PARA NOTIFICACIONES
// ======================================
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// ======================================
// GESTIÓN DE PESTAÑAS Y ROLES
// ======================================

// Simulación de usuario actual - Por defecto Director (solo responde)
let usuarioActual = {
    id: 1,
    nombre: "Dr. Martínez",
    rol: "Director", // "Director", "Subdirector", "Técnico", "Maestro"
    email: "director@utm.edu.mx"
};

// Usuarios de ejemplo eliminados - Ya no necesarios

// Función cambiarRol eliminada - Ya no es necesaria para demo

// Cargar solicitudes según las pestañas activas y permisos del rol
function cargarSolicitudesPorPestañas() {
    const { misSolicitudes, paraRevision } = obtenerSolicitudesPorRol();
    
    // Actualizar contadores
    const contadorSolicitudes = document.getElementById('contador-solicitudes');
    const contadorRevision = document.getElementById('contador-revision');
    
    if (contadorSolicitudes) contadorSolicitudes.textContent = misSolicitudes.length;
    if (contadorRevision) contadorRevision.textContent = paraRevision.length;
    
    // Cargar listas
    actualizarListaSolicitudes(misSolicitudes, 'solicitudes-list', 'mis');
    actualizarListaSolicitudes(paraRevision, 'solicitudes-revision-list', 'revision');
}

// Actualizar lista de solicitudes
function actualizarListaSolicitudes(solicitudes, containerId, tipo) {
    const container = document.getElementById(containerId);
    
    if (!solicitudes || solicitudes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-inbox fa-2x text-muted mb-2"></i>
                <p class="text-muted">${tipo === 'mis' ? 'No tienes solicitudes creadas' : 'No hay solicitudes para revisar'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = solicitudes.map(solicitud => `
        <div class="solicitud-item" onclick="mostrarDetalleSolicitud(${solicitud.id}, '${tipo}')">
            <div class="solicitud-header">
                <div class="solicitud-tipo ${solicitud.tipo.toLowerCase()}">
                    <i class="fas ${solicitud.tipo === 'Reserva' ? 'fa-calendar-check' : 'fa-tools'}"></i>
                    ${solicitud.tipo}
                </div>
                <div class="solicitud-estado ${solicitud.estado}">
                    ${formatearEstado(solicitud.estado)}
                </div>
            </div>
            <h6 class="solicitud-titulo">${solicitud.nombre}</h6>
            <div class="solicitud-info">
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${solicitud.laboratorio}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span>${new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES')}</span>
                </div>
                ${solicitud.prioridad ? `
                    <div class="info-item prioridad-${solicitud.prioridad.toLowerCase()}">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Prioridad: ${solicitud.prioridad}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Mostrar detalle de solicitud con opciones según el tipo de vista y permisos
function mostrarDetalleSolicitud(id, tipoVista) {
    const solicitud = solicitudesData.find(s => s.id === id);
    if (!solicitud) return;
    
    const viewerId = tipoVista === 'mis' ? 'viewer-content' : 'viewer-revision-content';
    const viewer = document.getElementById(viewerId);
    
    // Determinar si el usuario puede realizar acciones usando el sistema de permisos
    const puedeRevisar = (tipoVista === 'revision') && puedeProcesamarSolicitud(solicitud);
    
    viewer.innerHTML = generarContenidoDetalle(solicitud, puedeRevisar, tipoVista);
}

// Generar contenido del detalle con formulario de observaciones
function generarContenidoDetalle(solicitud, puedeRevisar, tipoVista) {
    const esReserva = solicitud.tipo === "Reserva";
    
    let contenido = `
        <div class="detalle-solicitud">
            <div class="detalle-header">
                <h5>${solicitud.nombre}</h5>
                <div class="badges-container">
                    <span class="badge badge-tipo ${solicitud.tipo.toLowerCase()}">${solicitud.tipo}</span>
                    <span class="badge badge-estado ${solicitud.estado}">${formatearEstado(solicitud.estado)}</span>
                    ${solicitud.prioridad ? `<span class="badge badge-prioridad ${solicitud.prioridad.toLowerCase()}">Prioridad: ${solicitud.prioridad}</span>` : ''}
                </div>
            </div>
            
            <div class="detalle-body">
                <!-- Información del Solicitante -->
                <div class="info-section">
                    <h6><i class="fas fa-user"></i> Información del Solicitante</h6>
                    <div class="info-grid">
                        <div><strong>Nombre:</strong> ${solicitud.solicitante}</div>
                        <div><strong>Email:</strong> ${solicitud.email}</div>
                        <div><strong>Teléfono:</strong> ${solicitud.telefono || 'No especificado'}</div>
                        <div><strong>Carrera:</strong> ${solicitud.carrera}</div>
                        <div><strong>Semestre:</strong> ${solicitud.semestre || 'No especificado'}</div>
                    </div>
                </div>
                
                <!-- Información de la Solicitud -->
                <div class="info-section">
                    <h6><i class="fas ${esReserva ? 'fa-calendar-check' : 'fa-tools'}"></i> Detalles de la ${solicitud.tipo}</h6>
                    <div class="info-grid">
                        <div><strong>Laboratorio:</strong> ${solicitud.laboratorio}</div>
                        <div><strong>Fecha de solicitud:</strong> ${new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES')}</div>
                        ${esReserva ? `
                            <div><strong>Fecha de reserva:</strong> ${new Date(solicitud.fecha_reserva).toLocaleDateString('es-ES')}</div>
                            <div><strong>Horario:</strong> ${solicitud.hora_inicio} - ${solicitud.hora_fin}</div>
                            <div><strong>Participantes:</strong> ${solicitud.participantes}</div>
                            <div><strong>Materia:</strong> ${solicitud.materia}</div>
                            <div><strong>Profesor:</strong> ${solicitud.profesor_responsable}</div>
                        ` : `
                            <div><strong>Tipo de problema:</strong> ${solicitud.tipo_problema}</div>
                            <div><strong>Equipo afectado:</strong> ${solicitud.equipo_afectado}</div>
                            <div><strong>Técnico asignado:</strong> ${solicitud.tecnico_asignado?.nombre || 'Por asignar'}</div>
                        `}
                    </div>
                </div>
                
                <!-- Descripción -->
                <div class="info-section">
                    <h6><i class="fas fa-file-text"></i> Descripción</h6>
                    <p class="descripcion-texto">${solicitud.descripcion}</p>
                    ${solicitud.observaciones ? `<p><strong>Observaciones adicionales:</strong> ${solicitud.observaciones}</p>` : ''}
                </div>
    `;
    
    // Agregar historial de observaciones si existen
    if (solicitud.historial_observaciones && solicitud.historial_observaciones.length > 0) {
        contenido += generarHistorialObservaciones(solicitud.historial_observaciones);
    }
    
    // Agregar formulario de observaciones si puede revisar
    if (puedeRevisar && solicitud.estado !== 'aprobado' && solicitud.estado !== 'rechazado') {
        contenido += generarFormularioObservaciones(solicitud.id);
    }
    
    contenido += `
            </div>
        </div>
    `;
    
    return contenido;
}

// Generar historial de observaciones
function generarHistorialObservaciones(historial) {
    return `
        <div class="historial-observaciones">
            <div class="historial-header">
                <i class="fas fa-history"></i>
                <span>Historial de Observaciones</span>
            </div>
            ${historial.map(obs => `
                <div class="observacion-item ${obs.accion}">
                    <div class="observacion-meta">
                        <span class="observacion-autor">${obs.autor}</span>
                        <span class="observacion-fecha">${new Date(obs.fecha).toLocaleString('es-ES')}</span>
                    </div>
                    <p class="observacion-texto">${obs.texto}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Generar formulario de observaciones para revisión
function generarFormularioObservaciones(solicitudId) {
    return `
        <div class="observaciones-section">
            <div class="observaciones-header">
                <i class="fas fa-comment-dots"></i>
                <span>Agregar Observaciones y Tomar Acción</span>
            </div>
            <form class="observaciones-form" id="form-observaciones-${solicitudId}">
                <textarea 
                    class="form-control observacion-input" 
                    id="observacion-texto-${solicitudId}"
                    placeholder="Escribe tus observaciones sobre esta solicitud..."
                    required
                ></textarea>
                <div class="observaciones-actions">
                    <button type="button" class="btn btn-observacion btn-aprobar" 
                            onclick="procesarSolicitud(${solicitudId}, 'aprobado')">
                        <i class="fas fa-check"></i> Aprobar
                    </button>
                    <button type="button" class="btn btn-observacion btn-rechazar" 
                            onclick="procesarSolicitud(${solicitudId}, 'rechazado')">
                        <i class="fas fa-times"></i> Rechazar
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Procesar solicitud con observaciones
function procesarSolicitud(id, nuevoEstado) {
    const solicitud = solicitudesData.find(s => s.id === id);
    if (!solicitud) return;
    
    // Verificar permisos antes de procesar
    if (!puedeProcesamarSolicitud(solicitud)) {
        showNotification('No tienes permisos para procesar esta solicitud', 'error');
        return;
    }
    
    const textarea = document.getElementById(`observacion-texto-${id}`);
    const observacion = textarea.value.trim();
    
    if (!observacion) {
        showNotification('Debes agregar una observación antes de procesar la solicitud', 'error');
        return;
    }
    
    // Inicializar historial si no existe
    if (!solicitud.historial_observaciones) {
        solicitud.historial_observaciones = [];
    }
    
    // Agregar nueva observación
    solicitud.historial_observaciones.push({
        autor: usuarioActual.nombre,
        fecha: new Date().toISOString(),
        texto: observacion,
        accion: nuevoEstado
    });
    
    // Actualizar estado
    solicitud.estado = nuevoEstado;
    
    // Limpiar textarea
    textarea.value = '';
    
    // Recargar vistas
    cargarSolicitudesPorPestañas();
    
    // Mostrar notificación
    const acciones = {
        'aprobado': 'aprobada',
        'rechazado': 'rechazada'
    };
    
    showNotification(`Solicitud ${acciones[nuevoEstado]} exitosamente`, 'success');
}

// Filtrar solicitudes por estado en pestaña de revisión
function filtrarSolicitudesRevision() {
    const filtro = document.getElementById('filtro-estado-revision').value;
    
    // Obtener solicitudes para revisión según permisos
    const { paraRevision } = obtenerSolicitudesPorRol();
    
    let solicitudesFiltradas = paraRevision;
    
    if (filtro !== 'all') {
        solicitudesFiltradas = solicitudesFiltradas.filter(s => s.estado === filtro);
    }
    
    actualizarListaSolicitudes(solicitudesFiltradas, 'solicitudes-revision-list', 'revision');
}

