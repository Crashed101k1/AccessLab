// ======================================
// DETALLE DE BITÁCORA - JAVASCRIPT
// ======================================

// Simulación de usuario actual
let usuarioActual = {
    id: 1,
    nombre: "Dr. Martínez",
    rol: "Director", // "Director", "Subdirector", "Técnico", "Maestro"
    email: "director@utm.edu.mx"
};

// Datos de la bitácora actual (simulados)
let bitacoraActual = {
    id: 1,
    profesorId: 2,
    nombreProfesor: "Hermelindo Buenrostro",
    laboratorio: "Redes P2",
    nombreAsignatura: "Desarrollo de Software I",
    grupo: "3C",
    carrera: "Tecnología de la Información",
    cuatrimestre: "Ene-Abr",
    parcial: 1,
    fechaInicio: "2025-01-15",
    fechaTerminacion: null, // null si está abierta
    estado: "abierta", // "abierta" o "cerrada"
    observacionesProfesor: "Los estudiantes mostraron gran interés en las prácticas de configuración de red. Se recomienda continuar con ejercicios más avanzados en las próximas sesiones. El equipo está funcionando correctamente y se ha logrado cumplir con el 80% de los objetivos planteados para este parcial.",
    registros: [
        {
            id: 1,
            numeroSesion: 1,
            nombreActividad: "Configuración de Switches CISCO",
            fecha: "2025-01-15",
            horaEntrada: "09:00",
            horaSalida: "11:00",
            materialUtilizado: "Cables de red, Laptops, Switches CISCO",
            estado: "completado",
            observaciones: "Práctica exitosa, todos los equipos funcionando correctamente"
        },
        {
            id: 2,
            numeroSesion: 2,
            nombreActividad: "Implementación de VLAN",
            fecha: "2025-01-22",
            horaEntrada: "14:00",
            horaSalida: "16:00",
            materialUtilizado: "Equipos de red, Documentación técnica",
            estado: "en-proceso",
            observaciones: "Se requiere completar la configuración en la próxima sesión"
        },
        {
            id: 3,
            numeroSesion: 3,
            nombreActividad: "Configuración de Routers",
            fecha: "2025-01-29",
            horaEntrada: "09:00",
            horaSalida: "11:00",
            materialUtilizado: "Routers CISCO, Cables de consola, Laptops",
            estado: "completado",
            observaciones: "Configuración básica de routers completada exitosamente"
        },
        {
            id: 4,
            numeroSesion: 4,
            nombreActividad: "Protocolo de Enrutamiento OSPF",
            fecha: "2025-02-05",
            horaEntrada: "14:00",
            horaSalida: "16:00",
            materialUtilizado: "Routers, Switches, Software de simulación",
            estado: "en-proceso",
            observaciones: "Práctica en desarrollo, falta completar la verificación de conectividad"
        }
    ],
    historialObservaciones: [
        {
            id: 1,
            autor: "Dr. Martínez",
            autorRol: "Director",
            fecha: "2025-01-20T10:30:00",
            texto: "Excelente progreso en las prácticas. Los estudiantes demuestran buen manejo de los equipos de red. Se recomienda continuar con el programa establecido."
        },
        {
            id: 2,
            autor: "Téc. López Martín",
            autorRol: "Técnico",
            fecha: "2025-01-25T15:45:00",
            texto: "Equipos en buen estado. Se realizó mantenimiento preventivo a los switches el día 24/01. Todo funcionando correctamente para las próximas prácticas."
        }
    ]
};

// ======================================
// INICIALIZACIÓN
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const profesor = urlParams.get('profesor');
    const laboratorio = urlParams.get('laboratorio');
    const grupo = urlParams.get('grupo');
    
    // Cargar bitácora específica si hay parámetros
    if (profesor && laboratorio && grupo) {
        cargarBitacoraPorParametros(profesor, laboratorio, grupo);
    }
    
    inicializarDetalleBitacora();
    configurarEventos();
    verificarPermisos();
});

function cargarBitacoraPorParametros(profesor, laboratorio, grupo) {
    // Aquí se haría la consulta real a la base de datos
    // Por ahora simulamos con datos diferentes según los parámetros
    
    if (profesor === "Hermelindo B." && laboratorio === "Redes P2" && grupo === "3C") {
        // Mantener los datos actuales
        return;
    }
    
    // Crear datos simulados para otras bitácoras
    bitacoraActual = {
        id: Math.random(),
        profesorId: 3,
        nombreProfesor: decodeURIComponent(profesor),
        laboratorio: decodeURIComponent(laboratorio),
        nombreAsignatura: "Materia Ejemplo",
        grupo: decodeURIComponent(grupo),
        carrera: "Carrera de Ejemplo",
        cuatrimestre: "May-Ago",
        parcial: 2,
        fechaInicio: "2025-05-15",
        fechaTerminacion: grupo.includes("A") ? "2025-08-15" : null,
        estado: grupo.includes("A") ? "cerrada" : "abierta",
        observacionesProfesor: `Observaciones para el grupo ${grupo} en ${laboratorio}. Los estudiantes han mostrado un progreso adecuado en las actividades programadas.`,
        registros: [
            {
                id: 1,
                numeroSesion: 1,
                nombreActividad: `Práctica inicial - ${laboratorio}`,
                fecha: "2025-05-15",
                horaEntrada: "08:00",
                horaSalida: "10:00",
                materialUtilizado: "Material básico del laboratorio",
                estado: "completado",
                observaciones: "Práctica inicial completada exitosamente"
            },
            {
                id: 2,
                numeroSesion: 2,
                nombreActividad: `Práctica avanzada - ${laboratorio}`,
                fecha: "2025-05-22",
                horaEntrada: "08:00",
                horaSalida: grupo.includes("A") ? "10:00" : null,
                materialUtilizado: "Equipos especializados",
                estado: grupo.includes("A") ? "completado" : "en-proceso",
                observaciones: grupo.includes("A") ? "Práctica completada" : "En desarrollo"
            }
        ],
        historialObservaciones: [
            {
                id: 1,
                autor: usuarioActual.nombre,
                autorRol: usuarioActual.rol,
                fecha: "2025-05-20T10:30:00",
                texto: `Bitácora revisada para ${profesor} - Grupo ${grupo}. Se observa buen progreso en las actividades.`
            }
        ]
    };
}

function inicializarDetalleBitacora() {
    // Cargar información de la bitácora
    cargarInformacionBitacora();
    
    // Cargar registros de la bitácora
    cargarRegistrosBitacora();
    
    // Cargar observaciones del profesor
    cargarObservacionesProfesor();
    
    // Cargar historial de observaciones
    cargarHistorialObservaciones();
    
    // Configurar estado de la bitácora
    configurarEstadoBitacora();
}

function cargarInformacionBitacora() {
    // Llenar los campos con la información de la bitácora
    document.getElementById('nombreProfesor').textContent = bitacoraActual.nombreProfesor;
    document.getElementById('laboratorio').textContent = bitacoraActual.laboratorio;
    document.getElementById('nombreAsignatura').textContent = bitacoraActual.nombreAsignatura;
    document.getElementById('grupo').textContent = bitacoraActual.grupo;
    document.getElementById('carrera').textContent = bitacoraActual.carrera;
    document.getElementById('cuatrimestre').textContent = bitacoraActual.cuatrimestre;
    
    // Configurar fechas
    document.getElementById('fechaInicio').value = bitacoraActual.fechaInicio;
    document.getElementById('fechaTerminacion').value = bitacoraActual.fechaTerminacion || '';
    
    // Configurar parcial seleccionado
    const parcialRadio = document.getElementById(`parcial${bitacoraActual.parcial}`);
    if (parcialRadio) {
        parcialRadio.checked = true;
    }
}

function cargarRegistrosBitacora() {
    const tbody = document.getElementById('tablaRegistrosBody');
    
    if (!bitacoraActual.registros || bitacoraActual.registros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="fas fa-clipboard text-muted fa-2x mb-2"></i>
                    <p class="text-muted">No hay registros de actividades en esta bitácora</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = bitacoraActual.registros.map(registro => `
        <tr class="registro-item" data-registro-id="${registro.id}">
            <td>${registro.numeroSesion}</td>
            <td class="text-start">${registro.nombreActividad}</td>
            <td>${formatearFecha(registro.fecha)}</td>
            <td>${registro.horaEntrada}</td>
            <td>${registro.horaSalida || 'En proceso'}</td>
            <td class="text-start">${registro.materialUtilizado}</td>
            <td>
                <span class="estado-badge ${registro.estado}">
                    ${formatearEstadoRegistro(registro.estado)}
                </span>
            </td>
        </tr>
    `).join('');
}

function cargarObservacionesProfesor() {
    const container = document.getElementById('observacionesProfesor');
    
    if (bitacoraActual.observacionesProfesor) {
        container.innerHTML = `<p>${bitacoraActual.observacionesProfesor}</p>`;
    } else {
        container.innerHTML = `
            <p class="text-muted font-italic">
                <i class="fas fa-info-circle"></i>
                El profesor no ha agregado observaciones aún.
            </p>
        `;
    }
}

function cargarHistorialObservaciones() {
    const container = document.getElementById('historialObservaciones');
    
    if (!bitacoraActual.historialObservaciones || bitacoraActual.historialObservaciones.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-3">
                <i class="fas fa-history"></i>
                <p class="mb-0">No hay observaciones de revisión anteriores</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <h6 class="mb-3">
            <i class="fas fa-history"></i>
            Historial de Observaciones
        </h6>
        ${bitacoraActual.historialObservaciones.map(obs => `
            <div class="observacion-historial">
                <div class="observacion-meta">
                    <span class="observacion-autor">
                        <i class="fas ${obs.autorRol === 'Director' || obs.autorRol === 'Subdirector' ? 'fa-user-tie' : 'fa-tools'}"></i>
                        ${obs.autor} (${obs.autorRol})
                    </span>
                    <span class="observacion-fecha">${formatearFechaCompleta(obs.fecha)}</span>
                </div>
                <p class="observacion-texto">${obs.texto}</p>
            </div>
        `).join('')}
    `;
}

function configurarEstadoBitacora() {
    // Agregar indicador de estado en el header
    const header = document.querySelector('.bitacora-header');
    const estadoIndicador = document.createElement('div');
    estadoIndicador.className = `estado-bitacora ${bitacoraActual.estado}`;
    estadoIndicador.innerHTML = `
        <i class="fas ${bitacoraActual.estado === 'abierta' ? 'fa-unlock' : 'fa-lock'}"></i>
        Bitácora ${bitacoraActual.estado === 'abierta' ? 'Abierta' : 'Cerrada'}
    `;
    header.style.position = 'relative';
    header.appendChild(estadoIndicador);
}

// ======================================
// GESTIÓN DE PERMISOS POR ROL
// ======================================

function verificarPermisos() {
    const puedeRevisar = usuarioActual.rol === "Director" || 
                        usuarioActual.rol === "Subdirector" || 
                        usuarioActual.rol === "Técnico";
    
    const formObservaciones = document.getElementById('observacionesForm');
    
    if (!puedeRevisar) {
        formObservaciones.style.display = 'none';
    }
    
    // Solo el profesor propietario puede ver algunos campos como editables
    // Todos los demás campos son de solo lectura para técnicos y directores
    if (usuarioActual.id !== bitacoraActual.profesorId) {
        // Deshabilitar cualquier elemento editable para revisores
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.id !== 'observacionesTecnico') {
                input.setAttribute('readonly', true);
                input.disabled = true;
            }
        });
    }
}

// ======================================
// FUNCIONES DE OBSERVACIONES
// ======================================

function guardarObservaciones() {
    const textarea = document.getElementById('observacionesTecnico');
    const observacion = textarea.value.trim();
    
    if (!observacion) {
        mostrarNotificacion('Debes escribir una observación antes de guardar', 'error');
        return;
    }
    
    // Crear nueva observación
    const nuevaObservacion = {
        id: bitacoraActual.historialObservaciones.length + 1,
        autor: usuarioActual.nombre,
        autorRol: usuarioActual.rol,
        fecha: new Date().toISOString(),
        texto: observacion
    };
    
    // Agregar al historial
    bitacoraActual.historialObservaciones.push(nuevaObservacion);
    
    // Limpiar textarea
    textarea.value = '';
    
    // Recargar historial
    cargarHistorialObservaciones();
    
    // Mostrar notificación de éxito
    mostrarNotificacion('Observación guardada exitosamente', 'success');
}

function cancelarObservaciones() {
    const textarea = document.getElementById('observacionesTecnico');
    textarea.value = '';
    mostrarNotificacion('Observación cancelada', 'info');
}

// ======================================
// GENERACIÓN DE PDF
// ======================================

function generarPDF() {
    mostrarNotificacion('Generando PDF de la bitácora...', 'info');
    
    // Simular proceso de generación de PDF
    setTimeout(() => {
        mostrarNotificacion('PDF generado exitosamente', 'success');
        
        // Aquí iría la lógica real para generar y descargar el PDF
        // Por ahora solo simulamos la descarga
        const link = document.createElement('a');
        link.href = '#'; // En implementación real, sería la URL del PDF generado
        link.download = `Bitacora_${bitacoraActual.nombreProfesor.replace(' ', '_')}_${bitacoraActual.grupo}_P${bitacoraActual.parcial}.pdf`;
        // link.click(); // Descomentар para activar descarga real
    }, 2000);
}

// ======================================
// CONFIGURACIÓN DE EVENTOS
// ======================================

function configurarEventos() {
    // Botón generar PDF
    const btnGenerarPDF = document.getElementById('btnGenerarPDF');
    btnGenerarPDF.addEventListener('click', generarPDF);
    
    // Eventos de teclado para el textarea de observaciones
    const textarea = document.getElementById('observacionesTecnico');
    textarea.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            guardarObservaciones();
        } else if (e.key === 'Escape') {
            cancelarObservaciones();
        }
    });
    
    // Hover effects en registros de la tabla
    const registros = document.querySelectorAll('.registro-item');
    registros.forEach(registro => {
        registro.addEventListener('click', function() {
            mostrarDetalleRegistro(this.dataset.registroId);
        });
    });
}

// ======================================
// FUNCIONES AUXILIARES
// ======================================

function mostrarDetalleRegistro(registroId) {
    const registro = bitacoraActual.registros.find(r => r.id == registroId);
    if (!registro) return;
    
    // Aquí se podría implementar un modal o vista detallada del registro
    console.log('Mostrar detalle del registro:', registro);
    mostrarNotificacion(`Registro: ${registro.nombreActividad}`, 'info');
}

function formatearFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatearFechaCompleta(fecha) {
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatearEstadoRegistro(estado) {
    const estados = {
        'completado': 'Completado',
        'en-proceso': 'En Proceso',
        'pendiente': 'Pendiente',
        'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
}

function mostrarNotificacion(mensaje, tipo) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${tipo === 'success' ? 'success' : tipo === 'info' ? 'info' : 'danger'} notification-toast`;
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
    
    const iconClass = tipo === 'success' ? 'fa-check-circle' : tipo === 'info' ? 'fa-info-circle' : 'fa-exclamation-circle';
    notification.innerHTML = `<i class="fas ${iconClass}"></i> ${mensaje}`;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ======================================
// FUNCIONES DEMO (PARA DESARROLLO)
// ======================================

function cambiarRol(nuevoRol) {
    usuarioActual.rol = nuevoRol;
    verificarPermisos();
    mostrarNotificacion(`Rol cambiado a: ${nuevoRol}`, 'info');
}

// Agregar botón demo para cambiar roles (solo para desarrollo)
document.addEventListener('DOMContentLoaded', function() {
    const botonDemo = document.createElement('div');
    botonDemo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 1000;
    `;
    
    botonDemo.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-info btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="fas fa-user-cog"></i> ${usuarioActual.rol}
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onclick="cambiarRol('Director')">Director</a></li>
                <li><a class="dropdown-item" href="#" onclick="cambiarRol('Subdirector')">Subdirector</a></li>
                <li><a class="dropdown-item" href="#" onclick="cambiarRol('Técnico')">Técnico</a></li>
                <li><a class="dropdown-item" href="#" onclick="cambiarRol('Maestro')">Maestro</a></li>
            </ul>
        </div>
    `;
    
    document.body.appendChild(botonDemo);
});

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