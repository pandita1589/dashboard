// js/ceo-dashboard.js - Panel de control del CEO

// Verificar tema guardado
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
});

// Toggle tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Estado global
let currentUser = null;
let employees = [];
let events = [];
let departments = {
    'Administración': 0,
    'Soporte': 0,
    'Programación': 0,
    'Database': 0,
    'Diseño Gráfico': 0
};

const MAX_EMPLOYEES = 50;

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadDashboardData();
});

// Verificar sesión y cargar datos del usuario
function initializeDashboard() {
    const session = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
    
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(session);
    
    // Verificar que sea CEO
    if (currentUser.role !== 'ceo') {
        alert('Acceso denegado. Esta sección es solo para CEO.');
        logout();
        return;
    }
    
    // Actualizar información del usuario en la UI
    document.getElementById('ceoName').textContent = currentUser.name;
}

// Configurar event listeners
function setupEventListeners() {
    // Navegación del sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showSection(section);
        });
    });
    
    // Toggle del menú móvil
    document.getElementById('menuToggle').addEventListener('click', toggleSidebar);
    
    // Cambio de foto de perfil
    document.getElementById('profilePicInput').addEventListener('change', handleProfilePicChange);
    
    // Formularios
    document.getElementById('hireForm').addEventListener('submit', handleHireEmployee);
    document.getElementById('eventForm').addEventListener('submit', handleCreateEvent);
    document.getElementById('mongoForm').addEventListener('submit', handleMongoConfig);
    document.getElementById('companyInfoForm').addEventListener('submit', handleCompanyInfo);
    
    // Búsqueda y filtros
    document.getElementById('searchEmployee').addEventListener('input', filterEmployees);
    document.getElementById('filterDepartment').addEventListener('change', filterEmployees);
    
    // Navegación del calendario
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
}

// Cargar datos del dashboard
async function loadDashboardData() {
    // Simular carga de datos (en producción vendría del backend)
    await loadEmployees();
    await loadEvents();
    updateStats();
    renderCalendar();
}

// Cargar empleados
async function loadEmployees() {
    // Datos de ejemplo
    employees = [
        { id: 2, name: 'Juan Pérez', email: 'admin@empresa.com', department: 'Administración', hireDate: '2023-01-15', profilePic: 'default-avatar.png' },
        { id: 3, name: 'María García', email: 'dev@empresa.com', department: 'Programación', hireDate: '2023-02-20', profilePic: 'default-avatar.png' },
        { id: 4, name: 'Carlos López', email: 'support@empresa.com', department: 'Soporte', hireDate: '2023-03-10', profilePic: 'default-avatar.png' },
        { id: 5, name: 'Ana Martín', email: 'db@empresa.com', department: 'Database', hireDate: '2023-04-05', profilePic: 'default-avatar.png' },
        { id: 6, name: 'Luis Rodríguez', email: 'design@empresa.com', department: 'Diseño Gráfico', hireDate: '2023-05-12', profilePic: 'default-avatar.png' }
    ];
    
    renderEmployeesTable();
    updateDepartmentCounts();
}

// Renderizar tabla de empleados
function renderEmployeesTable() {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${emp.profilePic}" alt="${emp.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.department}</td>
            <td>${formatDate(emp.hireDate)}</td>
            <td>
                <button class="btn-icon" onclick="editEmployee(${emp.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="fireEmployee(${emp.id})" title="Despedir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Actualizar estadísticas
function updateStats() {
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('currentCapacity').textContent = employees.length;
    document.getElementById('availableSlots').textContent = MAX_EMPLOYEES - employees.length;
    document.getElementById('upcomingEvents').textContent = events.filter(e => new Date(e.date) > new Date()).length;
}

// Actualizar conteo de departamentos
function updateDepartmentCounts() {
    // Resetear conteos
    Object.keys(departments).forEach(dept => departments[dept] = 0);
    
    // Contar empleados por departamento
    employees.forEach(emp => {
        if (departments.hasOwnProperty(emp.department)) {
            departments[emp.department]++;
        }
    });
    
    // Actualizar UI
    document.getElementById('adminCount').textContent = departments['Administración'];
    document.getElementById('supportCount').textContent = departments['Soporte'];
    document.getElementById('devCount').textContent = departments['Programación'];
    document.getElementById('dbCount').textContent = departments['Database'];
    document.getElementById('designCount').textContent = departments['Diseño Gráfico'];
}

// Mostrar sección
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    document.getElementById(sectionId).classList.add('active');
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Actualizar título
    const titles = {
        'overview': 'Vista General',
        'employees': 'Gestión de Empleados',
        'calendar': 'Calendario de Eventos',
        'departments': 'Departamentos',
        'reports': 'Reportes',
        'settings': 'Configuración'
    };
    document.getElementById('sectionTitle').textContent = titles[sectionId] || 'Dashboard';
}

// Toggle sidebar móvil
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('active');
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

// Cerrar sidebar al hacer clic en un enlace (móvil)
if (window.innerWidth <= 1024) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            sidebar.classList.remove('active');
            if (overlay) {
                overlay.classList.remove('active');
            }
        });
    });
}

// Manejo de modales
function openHireModal() {
    if (employees.length >= MAX_EMPLOYEES) {
        alert(`Has alcanzado el límite máximo de ${MAX_EMPLOYEES} empleados.`);
        return;
    }
    document.getElementById('hireModal').classList.add('active');
}

function closeHireModal() {
    document.getElementById('hireModal').classList.remove('active');
    document.getElementById('hireForm').reset();
}

function openEventModal() {
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('eventForm').reset();
}

function showMongoConfig() {
    document.getElementById('mongoModal').classList.add('active');
    const savedUri = localStorage.getItem('mongoUri');
    if (savedUri) {
        document.getElementById('mongoUri').value = savedUri;
    }
}

function closeMongoModal() {
    document.getElementById('mongoModal').classList.remove('active');
}

// Contratar empleado
async function handleHireEmployee(e) {
    e.preventDefault();
    
    if (employees.length >= MAX_EMPLOYEES) {
        alert(`No se pueden contratar más empleados. Límite máximo: ${MAX_EMPLOYEES}`);
        return;
    }
    
    const formData = new FormData(e.target);
    const newEmployee = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        department: formData.get('department'),
        hireDate: new Date().toISOString().split('T')[0],
        profilePic: 'default-avatar.png'
    };
    
    // Aquí se haría la llamada al backend
    // const response = await fetch('/api/employees', {...})
    
    employees.push(newEmployee);
    renderEmployeesTable();
    updateStats();
    updateDepartmentCounts();
    closeHireModal();
    
    showNotification('Empleado contratado exitosamente', 'success');
}

// Despedir empleado
function fireEmployee(id) {
    if (!confirm('¿Estás seguro de que deseas despedir a este empleado?')) {
        return;
    }
    
    employees = employees.filter(emp => emp.id !== id);
    renderEmployeesTable();
    updateStats();
    updateDepartmentCounts();
    
    showNotification('Empleado despedido', 'info');
}

// Editar empleado
function editEmployee(id) {
    // Implementar edición
    alert('Función de edición en desarrollo');
}

// Crear evento
async function handleCreateEvent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newEvent = {
        id: Date.now(),
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('datetime'),
        department: formData.get('department'),
        createdBy: currentUser.name
    };
    
    events.push(newEvent);
    renderCalendar();
    updateStats();
    closeEventModal();
    
    showNotification('Evento creado exitosamente', 'success');
}

// Configurar MongoDB
function handleMongoConfig(e) {
    e.preventDefault();
    
    const mongoUri = document.getElementById('mongoUri').value;
    localStorage.setItem('mongoUri', mongoUri);
    
    // Aquí se inicializaría la conexión con MongoDB
    console.log('MongoDB URI guardada:', mongoUri);
    
    closeMongoModal();
    showNotification('Configuración de MongoDB guardada', 'success');
}

// Información de la empresa
function handleCompanyInfo(e) {
    e.preventDefault();
    
    const companyName = document.getElementById('companyName').value;
    localStorage.setItem('companyName', companyName);
    
    showNotification('Información actualizada', 'success');
}

// Cambiar foto de perfil
function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('ceoProfilePic').src = e.target.result;
            // Guardar en localStorage o enviar al backend
            currentUser.profilePic = e.target.result;
            updateSession();
        };
        reader.readAsDataURL(file);
    }
}

// Filtrar empleados
function filterEmployees() {
    const searchTerm = document.getElementById('searchEmployee').value.toLowerCase();
    const filterDept = document.getElementById('filterDepartment').value;
    
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm) || 
                            emp.email.toLowerCase().includes(searchTerm);
        const matchesDept = !filterDept || emp.department === filterDept;
        
        return matchesSearch && matchesDept;
    });
    
    // Renderizar tabla filtrada
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';
    
    filteredEmployees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${emp.profilePic}" alt="${emp.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"></td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.department}</td>
            <td>${formatDate(emp.hireDate)}</td>
            <td>
                <button class="btn-icon" onclick="editEmployee(${emp.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="fireEmployee(${emp.id})" title="Despedir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Calendario
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Renderizar eventos próximos
    const upcomingEvents = events
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    const eventsList = document.getElementById('upcomingEventsList');
    eventsList.innerHTML = '';
    
    if (upcomingEvents.length === 0) {
        eventsList.innerHTML = '<p class="no-data">No hay eventos próximos</p>';
    } else {
        upcomingEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-date">
                    <span class="day">${new Date(event.date).getDate()}</span>
                    <span class="month">${monthNames[new Date(event.date).getMonth()].slice(0, 3).toUpperCase()}</span>
                </div>
                <div class="event-details">
                    <h3>${event.title}</h3>
                    <p><i class="fas fa-clock"></i> ${new Date(event.date).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</p>
                    <p><i class="fas fa-users"></i> ${event.department === 'all' ? 'Todos los departamentos' : event.department}</p>
                </div>
            `;
            eventsList.appendChild(eventCard);
        });
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('userSession');
    sessionStorage.removeItem('userSession');
    window.location.href = 'login.html';
}

// Actualizar sesión
function updateSession() {
    const session = localStorage.getItem('userSession') ? 'localStorage' : 'sessionStorage';
    if (session === 'localStorage') {
        localStorage.setItem('userSession', JSON.stringify(currentUser));
    } else {
        sessionStorage.setItem('userSession', JSON.stringify(currentUser));
    }
}

// Utilidades
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    
    const icon = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle',
        'warning': 'fa-exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icon[type] || icon.info}"></i>
        <div>
            <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
            <p>${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: var(--medium-gray); margin-left: auto;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Agregar animación de salida
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(120%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// Estilos adicionales para botones de acción
const style = document.createElement('style');
style.textContent = `
    .btn-icon {
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--medium-gray);
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .btn-icon:hover {
        background-color: var(--lightest-gray);
        color: var(--dark-gray);
    }
    
    .btn-icon.danger:hover {
        background-color: #fee;
        color: #d33;
    }
    
    .no-data {
        text-align: center;
        color: var(--light-gray);
        padding: 2rem;
    }
`;
document.head.appendChild(style);