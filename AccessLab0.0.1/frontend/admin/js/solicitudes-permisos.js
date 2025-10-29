// ======================================
// SISTEMA DE PERMISOS POR ROL - SOLICITUDES
// ======================================

// Configuración de permisos por rol
const PERMISOS_ROL = {
    "Maestro": {
        crear: true,
        responder: false,
        ver_mis_solicitudes: true,
        ver_para_revision: false,
        descripcion: "Solo puede crear solicitudes de reserva y soporte"
    },
    "Director": {
        crear: false,
        responder: true,
        ver_mis_solicitudes: false,
        ver_para_revision: true,
        descripcion: "Solo puede responder solicitudes dirigidas a Dirección"
    },
    "Subdirector": {
        crear: false,
        responder: true,
        ver_mis_solicitudes: false,
        ver_para_revision: true,
        descripcion: "Solo puede responder solicitudes dirigidas a Dirección"
    },
    "Técnico": {
        crear: true,
        responder: true,
        ver_mis_solicitudes: true,
        ver_para_revision: true,
        descripcion: "Puede crear y responder solicitudes de soporte técnico"
    }
};

// Verificar si el usuario actual puede realizar una acción
function puedeRealizarAccion(accion) {
    const rol = usuarioActual?.rol || "Maestro";
    const permisos = PERMISOS_ROL[rol];
    
    if (!permisos) {
        console.warn(`Rol '${rol}' no reconocido, aplicando permisos de Maestro`);
        return PERMISOS_ROL["Maestro"][accion] || false;
    }
    
    return permisos[accion] || false;
}

// Obtener solicitudes filtradas según el rol del usuario
function obtenerSolicitudesPorRol() {
    const rol = usuarioActual?.rol || "Maestro";
    
    // Solicitudes que puede ver en "Mis Solicitudes"
    let misSolicitudes = [];
    if (puedeRealizarAccion('ver_mis_solicitudes')) {
        misSolicitudes = solicitudesData.filter(s => 
            s.solicitante === usuarioActual.nombre || 
            (s.email && s.email === usuarioActual.email)
        );
    }
    
    // Solicitudes que puede ver en "Para Revisión"
    let paraRevision = [];
    if (puedeRealizarAccion('ver_para_revision')) {
        if (rol === "Director" || rol === "Subdirector") {
            paraRevision = solicitudesData.filter(s => s.dirigida_a === "Director/Subdirector");
        } else if (rol === "Técnico") {
            paraRevision = solicitudesData.filter(s => 
                s.dirigida_a === "Técnico" && 
                s.tecnico_asignado?.nombre?.includes(usuarioActual.nombre.split(' ')[1])
            );
        }
    }
    
    return {
        misSolicitudes,
        paraRevision
    };
}

// Configurar interfaz según permisos del rol
function configurarInterfazPorRol() {
    const rol = usuarioActual?.rol || "Maestro";
    console.log(`Configurando interfaz para rol: ${rol}`);
    
    // Configurar pestañas
    configurarPestanasPorRol();
    
    // Configurar botón de crear solicitud
    configurarBotonCrear();
    
    // Mostrar información del rol actual
    mostrarInfoRol();
}

// Configurar pestañas según permisos
function configurarPestanasPorRol() {
    const misSolicitudesTab = document.getElementById('nav-mis-solicitudes-tab');
    const paraRevisionTab = document.getElementById('nav-para-revision-tab');
    const misSolicitudesContent = document.getElementById('nav-mis-solicitudes');
    const paraRevisionContent = document.getElementById('nav-para-revision');
    
    // Mostrar/ocultar pestaña "Mis Solicitudes"
    if (puedeRealizarAccion('ver_mis_solicitudes')) {
        if (misSolicitudesTab) misSolicitudesTab.style.display = '';
        if (misSolicitudesContent) misSolicitudesContent.style.display = '';
    } else {
        if (misSolicitudesTab) misSolicitudesTab.style.display = 'none';
        if (misSolicitudesContent) misSolicitudesContent.style.display = 'none';
    }
    
    // Mostrar/ocultar pestaña "Para Revisión"
    if (puedeRealizarAccion('ver_para_revision')) {
        if (paraRevisionTab) paraRevisionTab.style.display = '';
        if (paraRevisionContent) paraRevisionContent.style.display = '';
        
        // Si solo puede responder, activar esta pestaña por defecto
        if (!puedeRealizarAccion('ver_mis_solicitudes')) {
            if (paraRevisionTab) paraRevisionTab.classList.add('active');
            if (paraRevisionContent) paraRevisionContent.classList.add('show', 'active');
            if (misSolicitudesTab) misSolicitudesTab.classList.remove('active');
            if (misSolicitudesContent) misSolicitudesContent.classList.remove('show', 'active');
        }
    } else {
        if (paraRevisionTab) paraRevisionTab.style.display = 'none';
        if (paraRevisionContent) paraRevisionContent.style.display = 'none';
    }
}

// Configurar botón de crear según permisos
function configurarBotonCrear() {
    const btnCrearSolicitud = document.getElementById('btn-crear-solicitud');
    
    if (puedeRealizarAccion('crear')) {
        if (btnCrearSolicitud) {
            btnCrearSolicitud.style.display = '';
            btnCrearSolicitud.disabled = false;
        }
    } else {
        if (btnCrearSolicitud) {
            btnCrearSolicitud.style.display = 'none';
        }
    }
}

// Mostrar información del rol actual
function mostrarInfoRol() {
    const rol = usuarioActual?.rol || "Maestro";
    const permisos = PERMISOS_ROL[rol];
    
    // Crear o actualizar indicador de rol
    let rolIndicator = document.getElementById('rol-indicator');
    if (!rolIndicator) {
        rolIndicator = document.createElement('div');
        rolIndicator.id = 'rol-indicator';
        rolIndicator.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            max-width: 250px;
        `;
        document.body.appendChild(rolIndicator);
    }
    
    rolIndicator.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">
            <i class="fas fa-user-shield"></i> ${rol}
        </div>
        <div style="font-size: 11px; opacity: 0.9;">
            ${permisos?.descripcion || 'Sin permisos definidos'}
        </div>
    `;
}

// Validar si puede procesar una solicitud específica
function puedeProcesamarSolicitud(solicitud) {
    const rol = usuarioActual?.rol || "Maestro";
    
    if (!puedeRealizarAccion('responder')) {
        return false;
    }
    
    // Director/Subdirector solo puede procesar solicitudes dirigidas a ellos
    if (rol === "Director" || rol === "Subdirector") {
        return solicitud.dirigida_a === "Director/Subdirector";
    }
    
    // Técnico solo puede procesar solicitudes dirigidas a técnicos y asignadas a él
    if (rol === "Técnico") {
        return solicitud.dirigida_a === "Técnico" && 
               solicitud.tecnico_asignado?.nombre?.includes(usuarioActual.nombre.split(' ')[1]);
    }
    
    return false;
}

// Actualizar usuario y reconfigurar interfaz
function cambiarRolYReconfigurar(nuevoRol) {
    usuarioActual.rol = nuevoRol;
    
    // Reconfigurar toda la interfaz
    configurarInterfazPorRol();
    cargarSolicitudesPorPestañas();
    
    showNotification(`Rol cambiado a: ${nuevoRol}`, 'info');
    console.log(`Permisos para ${nuevoRol}:`, PERMISOS_ROL[nuevoRol]);
}

// Obtener lista de roles disponibles para el selector demo
function obtenerRolesDisponibles() {
    return Object.keys(PERMISOS_ROL);
}

// Exportar funciones para uso en solicitudes.js
window.PERMISOS_ROL = PERMISOS_ROL;
window.puedeRealizarAccion = puedeRealizarAccion;
window.obtenerSolicitudesPorRol = obtenerSolicitudesPorRol;
window.configurarInterfazPorRol = configurarInterfazPorRol;
window.puedeProcesamarSolicitud = puedeProcesamarSolicitud;
window.cambiarRolYReconfigurar = cambiarRolYReconfigurar;
window.obtenerRolesDisponibles = obtenerRolesDisponibles;