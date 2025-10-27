// Script de validación simple para login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Inicializar animación del logo UTM rebotando
    initUTMBouncingAnimation();
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const rol = document.getElementById('rol').value;
        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;
        
        // Validación simple
        if (!rol || !usuario || !password) {
            showMessage('Por favor, completa todos los campos', 'error');
            return;
        }
        
        // Usuario de prueba para admin
        if (rol === 'director' && usuario === 'admin' && password === 'admin123') {
            showSuccessModal('¡Bienvenido Administrador!', '../admin/html/HomeAdmin.html');
        } else {
            showMessage('Credenciales incorrectas', 'error');
        }
    });
});

// Función para mostrar modal de éxito
function showSuccessModal(welcomeText, redirectUrl) {
    const modal = document.getElementById('successModal');
    const welcomeTextElement = document.getElementById('welcomeText');
    
    welcomeTextElement.textContent = welcomeText;
    modal.style.display = 'block';
    
    // Redirigir después de 2.5 segundos (tiempo de la animación)
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 2500);
}

// Función para alternar visibilidad de contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyePath = document.getElementById('eye-path');
    const eyeCircle = document.getElementById('eye-circle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        // Cambiar ícono a "ocultar"
        eyePath.setAttribute('d', 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24');
        eyeCircle.style.display = 'none';
        // Agregar línea diagonal
        const eyeIcon = document.querySelector('.eye-icon');
        if (!eyeIcon.querySelector('.diagonal-line')) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '1');
            line.setAttribute('y1', '1');
            line.setAttribute('x2', '23');
            line.setAttribute('y2', '23');
            line.setAttribute('stroke', 'currentColor');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('class', 'diagonal-line');
            eyeIcon.appendChild(line);
        }
    } else {
        passwordInput.type = 'password';
        // Cambiar ícono a "mostrar"
        eyePath.setAttribute('d', 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z');
        eyeCircle.style.display = 'block';
        // Remover línea diagonal
        const diagonalLine = document.querySelector('.diagonal-line');
        if (diagonalLine) {
            diagonalLine.remove();
        }
    }
}

// Función simple para mostrar mensajes
function showMessage(text, type) {
    const messageDiv = document.getElementById('errorMessage');
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    
    if (type === 'success') {
        messageDiv.style.background = '#e8f5e8';
        messageDiv.style.color = '#2e7d2e';
    } else {
        messageDiv.style.background = '#ffebee';
        messageDiv.style.color = '#c62828';
    }
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// === ANIMACIÓN DEL LOGO UTM REBOTANDO ESTILO DVD SCREENSAVER ===

// Variables para la animación del logo rebotando
let utmLogo = null;
let positionX = 0;
let positionY = 0;
let velocityX = 2;
let velocityY = 1.5;
let colorIndex = 0;
let animationId = null;

// Colores disponibles para el logo
const logoColors = ['utm-color-1', 'utm-color-2', 'utm-color-3', 'utm-color-4', 'utm-color-5', 'utm-color-6'];

// Inicializar la animación del logo UTM rebotando
function initUTMBouncingAnimation() {
    utmLogo = document.getElementById('utmBouncingLogo');
    
    if (!utmLogo) return;
    
    // Posición inicial aleatoria (logo más grande: 200px)
    positionX = Math.random() * (window.innerWidth - 200);
    positionY = Math.random() * (window.innerHeight - 200);
    
    // Velocidad inicial aleatoria
    velocityX = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 2);
    velocityY = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
    
    // Color inicial aleatorio
    colorIndex = Math.floor(Math.random() * logoColors.length);
    utmLogo.className = `utm-bouncing-logo ${logoColors[colorIndex]}`;
    
    // Iniciar animación
    startBouncingAnimation();
    
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', handleWindowResize);
    
    // Opcional: reducir opacidad cuando el usuario interactúa con el formulario
    const formInputs = document.querySelectorAll('input, select, button');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (utmLogo) utmLogo.style.opacity = '0.2'; // Menos transparente
        });
        input.addEventListener('blur', () => {
            if (utmLogo) utmLogo.style.opacity = '0.4'; // Opacidad normal
        });
    });
}

// Función principal de animación
function startBouncingAnimation() {
    function animate() {
        updateLogoPosition();
        checkBoundaryCollisions();
        renderLogo();
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

// Actualizar posición del logo
function updateLogoPosition() {
    positionX += velocityX;
    positionY += velocityY;
}

// Verificar colisiones con los bordes y cambiar dirección
function checkBoundaryCollisions() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const logoSize = 200; // Tamaño actualizado del logo
    
    let bounced = false;
    
    // Colisión horizontal
    if (positionX <= 0 || positionX >= windowWidth - logoSize) {
        velocityX = -velocityX;
        positionX = Math.max(0, Math.min(windowWidth - logoSize, positionX));
        bounced = true;
    }
    
    // Colisión vertical
    if (positionY <= 0 || positionY >= windowHeight - logoSize) {
        velocityY = -velocityY;
        positionY = Math.max(0, Math.min(windowHeight - logoSize, positionY));
        bounced = true;
    }
    
    // Si rebotó, cambiar color y agregar efectos
    if (bounced) {
        changeLogoColor();
        addBounceEffect();
        
        // Pequeña variación en velocidad para más realismo
        const speedVariation = 0.1;
        velocityX += (Math.random() - 0.5) * speedVariation;
        velocityY += (Math.random() - 0.5) * speedVariation;
        
        // Mantener velocidad dentro de límites razonables
        velocityX = Math.max(-4, Math.min(4, velocityX));
        velocityY = Math.max(-4, Math.min(4, velocityY));
    }
}

// Cambiar color del logo al rebotar
function changeLogoColor() {
    colorIndex = (colorIndex + 1) % logoColors.length;
    utmLogo.className = `utm-bouncing-logo ${logoColors[colorIndex]}`;
}

// Agregar efecto visual al rebotar
function addBounceEffect() {
    utmLogo.classList.add('bounce-effect');
    
    // Remover clase después de la animación
    setTimeout(() => {
        utmLogo.classList.remove('bounce-effect');
    }, 300);
    
    // Opcional: efecto de sonido (comentado por compatibilidad)
    // playBounceSound();
}

// Renderizar el logo en su nueva posición
function renderLogo() {
    if (utmLogo) {
        utmLogo.style.left = positionX + 'px';
        utmLogo.style.top = positionY + 'px';
    }
}

// Manejar redimensionamiento de ventana
function handleWindowResize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const logoSize = 200; // Tamaño actualizado del logo
    
    // Ajustar posición si el logo queda fuera de los límites
    positionX = Math.max(0, Math.min(windowWidth - logoSize, positionX));
    positionY = Math.max(0, Math.min(windowHeight - logoSize, positionY));
}

// Función para pausar/reanudar animación (útil para debugging o funcionalidad adicional)
function toggleUTMAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    } else {
        startBouncingAnimation();
    }
}

// Función para detener completamente la animación
function stopUTMAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    if (utmLogo) {
        utmLogo.style.display = 'none';
    }
}

// Opcional: Función para reproducir sonido de rebote (requiere archivos de audio)
function playBounceSound() {
    // Implementar si se desean efectos de sonido
    // const audio = new Audio('../public/sounds/bounce.wav');
    // audio.volume = 0.1;
    // audio.play().catch(e => console.log('Audio no disponible'));
}

// Easter egg: Triple clic en el logo para efectos especiales
let clickCount = 0;
document.addEventListener('click', function(event) {
    if (event.target.closest('.utm-bouncing-logo')) {
        clickCount++;
        
        if (clickCount === 3) {
            // Efecto especial: velocidad temporal aumentada
            const originalVelocityX = velocityX;
            const originalVelocityY = velocityY;
            
            velocityX *= 3;
            velocityY *= 3;
            
            utmLogo.style.opacity = '0.8';
            
            setTimeout(() => {
                velocityX = originalVelocityX;
                velocityY = originalVelocityY;
                utmLogo.style.opacity = '0.4';
                clickCount = 0;
            }, 3000);
        }
        
        // Resetear contador después de 2 segundos
        setTimeout(() => {
            if (clickCount < 3) clickCount = 0;
        }, 2000);
    }
});