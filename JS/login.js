// js/login.js - Sistema de autenticación mejorado

// Verificar y aplicar tema guardado
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
});

// Toggle de tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Añadir efecto de transición suave
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Usuarios del sistema
const users = [
    { 
        id: 1, 
        email: 'ceo@empresa.com', 
        password: 'ceo123', 
        name: 'Director General', 
        role: 'ceo',
        department: 'Dirección',
        profilePic: 'default-avatar.png'
    },
    { 
        id: 2, 
        email: 'admin@empresa.com', 
        password: 'admin123', 
        name: 'Juan Pérez', 
        role: 'admin',
        department: 'Administración',
        profilePic: 'default-avatar.png'
    },
    { 
        id: 3, 
        email: 'dev@empresa.com', 
        password: 'dev123', 
        name: 'María García', 
        role: 'employee',
        department: 'Programación',
        profilePic: 'default-avatar.png'
    },
    { 
        id: 4, 
        email: 'support@empresa.com', 
        password: 'support123', 
        name: 'Carlos López', 
        role: 'employee',
        department: 'Soporte',
        profilePic: 'default-avatar.png'
    },
    { 
        id: 5, 
        email: 'db@empresa.com', 
        password: 'db123', 
        name: 'Ana Martín', 
        role: 'employee',
        department: 'Database',
        profilePic: 'default-avatar.png'
    },
    { 
        id: 6, 
        email: 'design@empresa.com', 
        password: 'design123', 
        name: 'Luis Rodríguez', 
        role: 'employee',
        department: 'Diseño Gráfico',
        profilePic: 'default-avatar.png'
    }
];

// Manejo del formulario de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login exitoso
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            profilePic: user.profilePic
        };
        
        // Guardar sesión
        if (remember) {
            localStorage.setItem('userSession', JSON.stringify(userSession));
        } else {
            sessionStorage.setItem('userSession', JSON.stringify(userSession));
        }
        
        // Añadir efecto de éxito
        showLoginSuccess();
        
        // Redireccionar según el rol
        setTimeout(() => {
            switch(user.role) {
                case 'ceo':
                    window.location.href = 'ceo-dashboard.html';
                    break;
                case 'admin':
                    if (user.department === 'Administración') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'employee-dashboard.html';
                    }
                    break;
                case 'employee':
                    window.location.href = 'employee-dashboard.html';
                    break;
                default:
                    window.location.href = 'employee-dashboard.html';
            }
        }, 1000);
    } else {
        // Login fallido
        showError('Credenciales incorrectas. Por favor, intenta de nuevo.');
        shakeForm();
    }
});

// Mostrar mensaje de error
function showError(message) {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 5000);
}

// Efecto de shake en el formulario
function shakeForm() {
    const loginBox = document.querySelector('.login-box');
    loginBox.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginBox.style.animation = '';
    }, 500);
}

// Efecto de login exitoso
function showLoginSuccess() {
    const loginBox = document.querySelector('.login-box');
    const btn = document.querySelector('.btn-login');
    
    // Cambiar texto del botón
    btn.innerHTML = '<i class="fas fa-check"></i> <span>¡Bienvenido!</span>';
    btn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    
    // Añadir efecto de éxito
    loginBox.style.animation = 'successPulse 0.5s ease-out';
}

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Limpiar campos al cargar la página
window.addEventListener('load', function() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('remember').checked = false;
});

// Añadir indicadores visuales al escribir
document.getElementById('email').addEventListener('input', function(e) {
    const icon = e.target.previousElementSibling;
    if (e.target.value) {
        icon.style.color = 'var(--accent-primary)';
    } else {
        icon.style.color = '#6e7681';
    }
});

document.getElementById('password').addEventListener('input', function(e) {
    const icon = e.target.previousElementSibling;
    if (e.target.value) {
        icon.style.color = 'var(--accent-primary)';
    } else {
        icon.style.color = '#6e7681';
    }
});

// Prevenir el envío con Enter si hay campos vacíos
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            e.preventDefault();
            showError('Por favor, completa todos los campos.');
            shakeForm();
        }
    }
});