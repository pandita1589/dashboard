// js/employee-dashboard.js - Panel de control de Empleados

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
let tasks = [];
let events = [];
let teamMembers = [];
let resources = [];

// Configuración específica por departamento
const departmentConfig = {
    'Programación': {
        icon: 'code',
        color: '#4facfe',
        resources: [
            { icon: 'fa-github', title: 'Repositorio GitHub', description: 'Acceso al código fuente' },
            { icon: 'fa-book', title: 'Documentación API', description: 'Referencias técnicas' },
            { icon: 'fa-tools', title: 'Herramientas Dev', description: 'IDEs y utilidades' },
            { icon: 'fa-bug', title: 'Sistema de Tickets', description: 'Reporte de bugs' }
        ],
        specificContent: `
            <div class="dept-specific-card">
                <h3>Proyectos Activos</h3>
                <div class="project-list">
                    <div class="project-item">
                        <h4>Sistema ERP v2.0</h4>
                        <div class="progress-bar">
                            <div class="progress" style="width: 75%"></div>
                        </div>
                        <span>75% completado</span>
                    </div>
                    <div class="project-item">
                        <h4>API REST Clientes</h4>
                        <div class="progress-bar">
                            <div class="progress" style="width: 40%"></div>
                        </div>
                        <span>40% completado</span>
                    </div>
                </div>
            </div>
        `
    },
    'Soporte': {
        icon: 'headset',
        color: '#f093fb',
        resources: [
            { icon: 'fa-ticket-alt', title: 'Sistema de Tickets', description: 'Gestión de soporte' },
            { icon: 'fa-comments', title: 'Chat Interno', description: 'Comunicación con clientes' },
            { icon: 'fa-book-open', title: 'Base de Conocimiento', description: 'Soluciones comunes' },
            { icon: 'fa-phone', title: 'Directorio', description: 'Contactos importantes' }
        ],
        specificContent: `
            <div class="dept-specific-card">
                <h3>Métricas de Soporte</h3>
                <div class="support-metrics">
                    <div class="metric">
                        <span class="metric-value">24</span>
                        <span class="metric-label">Tickets Abiertos</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">4.5</span>
                        <span class="metric-label">Satisfacción Cliente</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">2h</span>
                        <span class="metric-label">Tiempo Respuesta</span>
                    </div>
                </div>
            </div>
        `
    },
    'Database': {
        icon: 'database',
        color: '#fa709a',
        resources: [
            { icon: 'fa-server', title: 'Servidores DB', description: 'Acceso a bases de datos' },
            { icon: 'fa-shield-alt', title: 'Backups', description: 'Sistema de respaldos' },
            { icon: 'fa-chart-line', title: 'Monitoreo', description: 'Performance y métricas' },
            { icon: 'fa-cogs', title: 'Scripts SQL', description: 'Utilidades y consultas' }
        ],
        specificContent: `
            <div class="dept-specific-card">
                <h3>Estado de Bases de Datos</h3>
                <div class="db-status-list">
                    <div class="db-status">
                        <i class="fas fa-circle" style="color: #27ae60"></i>
                        <span>DB Principal - Operativa</span>
                    </div>
                    <div class="db-status">
                        <i class="fas fa-circle" style="color: #27ae60"></i>
                        <span>DB Respaldo - Sincronizada</span>
                    </div>
                    <div class="db-status">
                        <i class="fas fa-circle" style="color: #f39c12"></i>
                        <span>DB Testing - Mantenimiento</span>
                    </div>
                </div>
            </div>
        `
    },
    'Diseño Gráfico': {
        icon: 'palette',
        color: '#feca57',
        resources: [
            { icon: 'fa-adobe', title: 'Adobe Creative', description: 'Suite de diseño' },
            { icon: 'fa-images', title: 'Banco de Imágenes', description: 'Recursos visuales' },
            { icon: 'fa-paint-brush', title: 'Guía de Marca', description: 'Identidad corporativa' },
            { icon: 'fa-folder-open', title: 'Proyectos', description: 'Trabajos en curso' }
        ],
        specificContent: `
            <div class="dept-specific-card">
                <h3>Proyectos de Diseño</h3>
                <div class="design-projects">
                    <div class="design-project">
                        <div class="project-preview" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <i class="fas fa-image"></i>
                        </div>
                        <h4>Campaña Verano 2024</h4>
                        <span class="status">En revisión</span>
                    </div>
                    <div class="design-project">
                        <div class="project-preview" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h4>Rediseño Web</h4>
                        <span class="status">En progreso</span>
                    </div>
                </div>
            </div>
        `
    },
    'Administración': {
        icon: 'user-tie',
        color: '#667eea',
        resources: [
            { icon: 'fa-file-contract', title: 'Contratos', description: 'Gestión de documentos' },
            { icon: 'fa-calculator', title: 'Finanzas', description: 'Reportes financieros' },
            { icon: 'fa-calendar-check', title: 'Agenda', description: 'Calendario corporativo' },
            { icon: 'fa-users', title: 'RRHH', description: 'Recursos humanos' }
        ],
        specificContent: `
            <div class="dept-specific-card">
                <h3>Resumen Administrativo</h3>
                <div class="admin-summary">
                    <div class="summary-item">
                        <i class="fas fa-file-invoice"></i>
                        <div>
                            <h4>12</h4>
                            <p>Facturas pendientes</p>
                        </div>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-handshake"></i>
                        <div>
                            <h4>5</h4>
                            <p>Reuniones esta semana</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
};

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
    
    // Verificar que sea empleado
    if (currentUser.role !== 'employee' && currentUser.role !== 'admin') {
        alert('Acceso denegado.');
        logout();
        return;
    }
    
    // Actualizar información del usuario en la UI
    document.getElementById('employeeName').textContent = currentUser.name;
    document.getElementById('employeeDept').textContent = currentUser.department;
    document.getElementById('deptTitle').textContent = currentUser.department;
    document.getElementById('welcomeName').textContent = currentUser.name.split(' ')[0];
    
    // Aplicar configuración específica del departamento
    applyDepartmentConfig();
}

// Aplicar configuración del departamento
function applyDepartmentConfig() {
    const config = departmentConfig[currentUser.department];
    if (!config) return;
    
    // Actualizar contenido específico del departamento
    document.getElementById('deptSpecificContent').innerHTML = config.specificContent;
    
    // Actualizar recursos del departamento
    loadDepartmentResources(config.resources);
    
    // Actualizar colores del tema
    updateThemeColors(config.color);
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
    document.getElementById('taskForm').addEventListener('submit', handleCreateTask);
    document.getElementById('profileForm').addEventListener('submit', handleUpdateProfile);
}

// Cargar datos del dashboard
async function loadDashboardData() {
    await loadTasks();
    await loadEvents();
    await loadTeamMembers();
}

// Cargar tareas
async function loadTasks() {
    // Datos de ejemplo según el departamento
    const departmentTasks = {
        'Programación': [
            { id: 1, title: 'Revisar código PR #234', description: 'Revisar pull request del módulo de pagos', status: 'todo', priority: 'high' },
            { id: 2, title: 'Implementar API endpoints', description: 'Crear endpoints para el nuevo feature', status: 'inProgress', priority: 'medium' },
            { id: 3, title: 'Actualizar documentación', description: 'Documentar las nuevas funciones', status: 'completed', priority: 'low' }
        ],
        'Soporte': [
            { id: 1, title: 'Atender ticket #1234', description: 'Cliente reporta problema con login', status: 'todo', priority: 'high' },
            { id: 2, title: 'Actualizar FAQ', description: 'Agregar nuevas preguntas frecuentes', status: 'inProgress', priority: 'medium' },
            { id: 3, title: 'Llamada de seguimiento', description: 'Contactar cliente caso #5678', status: 'todo', priority: 'medium' }
        ],
        'Database': [
            { id: 1, title: 'Optimizar consultas', description: 'Revisar queries lentas en reporte', status: 'inProgress', priority: 'high' },
            { id: 2, title: 'Backup semanal', description: 'Ejecutar respaldo completo', status: 'todo', priority: 'high' },
            { id: 3, title: 'Actualizar índices', description: 'Recrear índices tabla clientes', status: 'completed', priority: 'medium' }
        ],
        'Diseño Gráfico': [
            { id: 1, title: 'Banner homepage', description: 'Diseñar nuevo banner principal', status: 'inProgress', priority: 'high' },
            { id: 2, title: 'Icons set', description: 'Crear set de iconos para app', status: 'todo', priority: 'medium' },
            { id: 3, title: 'Revisión logo', description: 'Ajustar colores del logo', status: 'completed', priority: 'low' }
        ],
        'Administración': [
            { id: 1, title: 'Procesar facturas', description: 'Revisar y aprobar facturas pendientes', status: 'todo', priority: 'high' },
            { id: 2, title: 'Reporte mensual', description: 'Preparar reporte para dirección', status: 'inProgress', priority: 'high' },
            { id: 3, title: 'Actualizar contratos', description: 'Renovar contratos proveedores', status: 'todo', priority: 'medium' }
        ]
    };
    
    tasks = departmentTasks[currentUser.department] || [];
    renderTasks();
}

// Renderizar tareas
function renderTasks() {
    const todoList = document.getElementById('todoTasks');
    const inProgressList = document.getElementById('inProgressTasks');
    const completedList = document.getElementById('completedTasks');
    
    // Limpiar listas
    todoList.innerHTML = '';
    inProgressList.innerHTML = '';
    completedList.innerHTML = '';
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        
        switch(task.status) {
            case 'todo':
                todoList.appendChild(taskCard);
                break;
            case 'inProgress':
                inProgressList.appendChild(taskCard);
                break;
            case 'completed':
                completedList.appendChild(taskCard);
                break;
        }
    });
}

// Crear tarjeta de tarea
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card ${task.status === 'completed' ? 'completed' : ''}`;
    card.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.description}</p>
        <span class="task-priority ${task.priority}">${getPriorityLabel(task.priority)}</span>
        <div class="task-actions">
            ${task.status !== 'completed' ? `
                <button class="btn-icon small" onclick="moveTask(${task.id}, 'next')" title="Avanzar">
                    <i class="fas fa-arrow-right"></i>
                </button>
            ` : ''}
            ${task.status !== 'todo' ? `
                <button class="btn-icon small" onclick="moveTask(${task.id}, 'prev')" title="Retroceder">
                    <i class="fas fa-arrow-left"></i>
                </button>
            ` : ''}
        </div>
    `;
    return card;
}

// Mover tarea entre estados
function moveTask(taskId, direction) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const statusFlow = ['todo', 'inProgress', 'completed'];
    const currentIndex = statusFlow.indexOf(task.status);
    
    if (direction === 'next' && currentIndex < statusFlow.length - 1) {
        task.status = statusFlow[currentIndex + 1];
    } else if (direction === 'prev' && currentIndex > 0) {
        task.status = statusFlow[currentIndex - 1];
    }
    
    renderTasks();
}

// Cargar eventos
async function loadEvents() {
    // Cargar eventos del localStorage o API
    const eventsData = localStorage.getItem('companyEvents');
    if (eventsData) {
        const allEvents = JSON.parse(eventsData);
        // Filtrar eventos relevantes para el departamento
        events = allEvents.filter(e => 
            e.department === 'all' || e.department === currentUser.department
        );
    }
    renderEvents();
}

// Renderizar eventos
function renderEvents() {
    const eventsList = document.getElementById('employeeEventsList');
    eventsList.innerHTML = '';
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p class="no-data">No hay eventos próximos para tu departamento</p>';
        return;
    }
    
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        const eventDate = new Date(event.date);
        
        eventCard.innerHTML = `
            <div class="event-date">
                <span class="day">${eventDate.getDate()}</span>
                <span class="month">${eventDate.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}</span>
            </div>
            <div class="event-details">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p><i class="fas fa-clock"></i> ${eventDate.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</p>
            </div>
        `;
        eventsList.appendChild(eventCard);
    });
}

// Cargar miembros del equipo
async function loadTeamMembers() {
    // Simular carga de compañeros del mismo departamento
    const allEmployees = [
        { id: 2, name: 'Juan Pérez', email: 'admin@empresa.com', department: 'Administración', profilePic: 'default-avatar.png' },
        { id: 3, name: 'María García', email: 'dev@empresa.com', department: 'Programación', profilePic: 'default-avatar.png' },
        { id: 4, name: 'Carlos López', email: 'support@empresa.com', department: 'Soporte', profilePic: 'default-avatar.png' },
        { id: 5, name: 'Ana Martín', email: 'db@empresa.com', department: 'Database', profilePic: 'default-avatar.png' },
        { id: 6, name: 'Luis Rodríguez', email: 'design@empresa.com', department: 'Diseño Gráfico', profilePic: 'default-avatar.png' },
        { id: 7, name: 'Pedro Sánchez', email: 'dev2@empresa.com', department: 'Programación', profilePic: 'default-avatar.png' },
        { id: 8, name: 'Laura Fernández', email: 'support2@empresa.com', department: 'Soporte', profilePic: 'default-avatar.png' }
    ];
    
    teamMembers = allEmployees.filter(emp => 
        emp.department === currentUser.department && emp.id !== currentUser.id
    );
    
    renderTeam();
}

// Renderizar equipo
function renderTeam() {
    const teamGrid = document.getElementById('teamGrid');
    teamGrid.innerHTML = '';
    
    if (teamMembers.length === 0) {
        teamGrid.innerHTML = '<p class="no-data">No hay otros miembros en tu departamento</p>';
        return;
    }
    
    teamMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member';
        memberCard.innerHTML = `
            <img src="${member.profilePic}" alt="${member.name}">
            <h4>${member.name}</h4>
            <p>${member.email}</p>
        `;
        teamGrid.appendChild(memberCard);
    });
}

// Cargar recursos del departamento
function loadDepartmentResources(resources) {
    const resourcesGrid = document.getElementById('deptResources');
    resourcesGrid.innerHTML = '';
    
    resources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        resourceCard.innerHTML = `
            <i class="fas ${resource.icon}"></i>
            <h4>${resource.title}</h4>
            <p>${resource.description}</p>
        `;
        resourcesGrid.appendChild(resourceCard);
    });
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
        'overview': 'Inicio',
        'tasks': 'Mis Tareas',
        'calendar': 'Calendario',
        'team': 'Mi Equipo',
        'resources': 'Recursos',
        'profile': 'Mi Perfil'
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

// Modal de tareas
function openTaskModal() {
    document.getElementById('taskModal').classList.add('active');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    document.getElementById('taskForm').reset();
}

// Crear tarea
function handleCreateTask(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newTask = {
        id: Date.now(),
        title: formData.get('title'),
        description: formData.get('description'),
        priority: formData.get('priority'),
        deadline: formData.get('deadline'),
        status: 'todo'
    };
    
    tasks.push(newTask);
    renderTasks();
    closeTaskModal();
    
    showNotification('Tarea creada exitosamente', 'success');
}

// Cambiar foto de perfil
function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('employeeProfilePic').src = e.target.result;
            currentUser.profilePic = e.target.result;
            updateSession();
        };
        reader.readAsDataURL(file);
    }
}

// Actualizar perfil
function handleUpdateProfile(e) {
    e.preventDefault();
    
    const phone = document.getElementById('profilePhone').value;
    const bio = document.getElementById('profileBio').value;
    
    currentUser.phone = phone;
    currentUser.bio = bio;
    
    updateSession();
    showNotification('Perfil actualizado exitosamente', 'success');
}

// Actualizar colores del tema
function updateThemeColors(color) {
    const style = document.createElement('style');
    style.textContent = `
        .stat-icon {
            background: linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -20)} 100%) !important;
        }
        .nav-item.active::before {
            background-color: ${color} !important;
        }
    `;
    document.head.appendChild(style);
}

// Ajustar color
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Obtener etiqueta de prioridad
function getPriorityLabel(priority) {
    const labels = {
        'high': 'Alta prioridad',
        'medium': 'Media prioridad',
        'low': 'Baja prioridad'
    };
    return labels[priority] || priority;
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

// Mostrar notificación
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

// Cargar datos del perfil
document.addEventListener('DOMContentLoaded', function() {
    if (currentUser) {
        document.getElementById('profileName').value = currentUser.name;
        document.getElementById('profileEmail').value = currentUser.email;
        document.getElementById('profileDept').value = currentUser.department;
        document.getElementById('profilePhone').value = currentUser.phone || '';
        document.getElementById('profileBio').value = currentUser.bio || '';
    }
});

// Estilos adicionales
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .dept-specific-card {
        background: var(--white);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: var(--shadow-md);
        margin-bottom: 2rem;
    }
    
    .project-list {
        margin-top: 1rem;
    }
    
    .project-item {
        margin-bottom: 1.5rem;
    }
    
    .project-item h4 {
        margin-bottom: 0.5rem;
        color: var(--primary-black);
    }
    
    .progress-bar {
        height: 8px;
        background-color: var(--lightest-gray);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.25rem;
    }
    
    .progress {
        height: 100%;
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
        transition: width 0.3s ease;
    }
    
    .support-metrics,
    .admin-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .metric,
    .summary-item {
        text-align: center;
        padding: 1rem;
        background-color: var(--off-white);
        border-radius: 8px;
    }
    
    .metric-value {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary-black);
    }
    
    .metric-label {
        display: block;
        font-size: 0.875rem;
        color: var(--medium-gray);
        margin-top: 0.25rem;
    }
    
    .db-status-list {
        margin-top: 1rem;
    }
    
    .db-status {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        background-color: var(--off-white);
    }
    
    .db-status i {
        font-size: 0.75rem;
    }
    
    .design-projects {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-top: 1rem;
    }
    
    .design-project {
        text-align: center;
    }
    
    .project-preview {
        height: 120px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.75rem;
        color: var(--white);
        font-size: 2rem;
    }
    
    .design-project h4 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
        color: var(--primary-black);
    }
    
    .design-project .status {
        font-size: 0.875rem;
        color: var(--medium-gray);
    }
    
    .summary-item {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .summary-item i {
        font-size: 2rem;
        color: var(--medium-gray);
    }
    
    .summary-item h4 {
        font-size: 1.5rem;
        color: var(--primary-black);
        margin: 0;
    }
    
    .summary-item p {
        font-size: 0.875rem;
        color: var(--medium-gray);
        margin: 0;
    }
    
    .task-actions {
        margin-top: 0.75rem;
        display: flex;
        gap: 0.5rem;
    }
    
    .btn-icon.small {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
    
    .no-data {
        text-align: center;
        color: var(--light-gray);
        padding: 2rem;
        font-style: italic;
    }
`;
document.head.appendChild(additionalStyles);