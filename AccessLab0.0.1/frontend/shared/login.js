// Script de validación simple para login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
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