// js/admin-dashboard.js - Panel de control de Administración

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
let partners = [];
let events = [];
let contracts = [];

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
    
    // Verificar que sea admin
    if (currentUser.role !== 'admin') {
        alert('Acceso denegado. Esta sección es solo para Administración.');
        logout();
        return;
    }
    
    // Actualizar información del usuario en la UI
    document.getElementById('adminName').textContent = currentUser.name;
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
    document.getElementById('partnerForm').addEventListener('submit', handleAddPartner);
    document.getElementById('profileForm').addEventListener('submit', handleUpdateProfile);
    
    // Búsqueda y filtros
    document.getElementById('searchPartner').addEventListener('input', filterPartners);
    document.getElementById('filterPartnerType').addEventListener('change', filterPartners);
}

// Cargar datos del dashboard
async function loadDashboardData() {
    await loadPartners();
    await loadEvents();
    updateStats();
}

// Cargar aliados
async function loadPartners() {
    // Datos de ejemplo
    partners = [
        {
            id: 1,
            company: 'Tech Solutions S.A.',
            contact: 'Roberto Méndez',
            email: 'rmendez@techsolutions.com',
            phone: '+54 11 4567-8900',
            type: 'tecnologia',
            status: 'activo',
            since: '2023-01-15',
            description: 'Proveedor de soluciones tecnológicas'
        },
        {
            id: 2,
            company: 'Marketing Pro',
            contact: 'Laura González',
            email: 'lgonzalez@marketingpro.com',
            phone: '+54 11 3456-7890',
            type: 'marketing',
            status: 'activo',
            since: '2023-03-20',
            description: 'Agencia de marketing digital'
        },
        {
            id: 3,
            company: 'Logística Express',
            contact: 'Diego Fernández',
            email: 'dfernandez@logexpress.com',
            phone: '+54 11 2345-6789',
            type: 'logistica',
            status: 'activo',
            since: '2023-06-10',
            description: 'Servicios de logística y distribución'
        }
    ];
    
    renderPartnersTable();
}

// Cargar eventos
async function loadEvents() {
    // Cargar eventos desde el almacenamiento o API
    const eventsData = localStorage.getItem('companyEvents');
    if (eventsData) {
        events = JSON.parse(eventsData);
    }
    renderEvents();
}

// Renderizar tabla de aliados
function renderPartnersTable() {
    const tbody = document.getElementById('partnerTableBody');
    tbody.innerHTML = '';
    
    partners.forEach(partner => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${partner.company}</td>
            <td>${partner.contact}</td>
            <td>${partner.email}</td>
            <td>${partner.phone}</td>
            <td><span class="badge ${partner.type}">${getPartnerTypeLabel(partner.type)}</span></td>
            <td><span class="status-badge ${partner.status}">${partner.status === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="btn-icon" onclick="viewPartner(${partner.id})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="editPartner(${partner.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="deletePartner(${partner.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Actualizar estadísticas
function updateStats() {
    const activePartners = partners.filter(p => p.status === 'activo').length;
    document.getElementById('totalPartners').textContent = activePartners;
    
    // Actualizar actividad reciente
    updateRecentActivity();
}

// Actualizar actividad reciente
function updateRecentActivity() {
    const activities = [
        { icon: 'handshake', text: 'Nuevo aliado agregado: Tech Solutions', time: 'Hace 1 día' },
        { icon: 'file-signature', text: 'Contrato renovado con Marketing Pro', time: 'Hace 3 días' }
    ];
    
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <i class="fas fa-${activity.icon}"></i>
            <div>
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        `;
        activityList.appendChild(item);
    });
}

// Renderizar eventos
function renderEvents() {
    const eventsList = document.querySelector('.events-grid');
    const adminEvents = events.filter(e => 
        e.department === 'all' || e.department === 'Administración'
    );
    
    if (adminEvents.length === 0) {
        eventsList.innerHTML = '<p class="no-data">No hay eventos próximos</p>';
        return;
    }
    
    eventsList.innerHTML = '';
    adminEvents.slice(0, 5).forEach(event => {
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
                <p><i class="fas fa-clock"></i> ${eventDate.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</p>
                <p><i class="fas fa-users"></i> ${event.department === 'all' ? 'Todos los departamentos' : event.department}</p>
            </div>
        `;
        eventsList.appendChild(eventCard);
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
        'overview': 'Vista General',
        'partners': 'Gestión de Aliados',
        'calendar': 'Calendario',
        'documents': 'Documentos',
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

// Manejo de modal de aliados
function openPartnerModal() {
    document.getElementById('partnerModal').classList.add('active');
}

function closePartnerModal() {
    document.getElementById('partnerModal').classList.remove('active');
    document.getElementById('partnerForm').reset();
}

// Agregar aliado
async function handleAddPartner(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newPartner = {
        id: Date.now(),
        company: formData.get('company'),
        contact: formData.get('contact'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        type: formData.get('type'),
        description: formData.get('description'),
        status: 'activo',
        since: new Date().toISOString().split('T')[0]
    };
    
    // Aquí se haría la llamada al backend
    // const response = await fetch('/api/partners', {...})
    
    partners.push(newPartner);
    renderPartnersTable();
    updateStats();
    closePartnerModal();
    
    showNotification('Aliado agregado exitosamente', 'success');
}

// Ver detalles del aliado
function viewPartner(id) {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        alert(`
            Empresa: ${partner.company}
            Contacto: ${partner.contact}
            Email: ${partner.email}
            Teléfono: ${partner.phone}
            Tipo: ${getPartnerTypeLabel(partner.type)}
            Descripción: ${partner.description}
            Miembro desde: ${formatDate(partner.since)}
        `);
    }
}

// Editar aliado
function editPartner(id) {
    const partner = partners.find(p => p.id === id);
    if (partner) {
        // Abrir modal con datos del partner
        openPartnerModal();
        
        // Llenar formulario con datos existentes
        document.querySelector('[name="company"]').value = partner.company;
        document.querySelector('[name="contact"]').value = partner.contact;
        document.querySelector('[name="email"]').value = partner.email;
        document.querySelector('[name="phone"]').value = partner.phone;
        document.querySelector('[name="type"]').value = partner.type;
        document.querySelector('[name="description"]').value = partner.description;
        
        // Cambiar el comportamiento del submit para actualizar
        const form = document.getElementById('partnerForm');
        form.onsubmit = function(e) {
            e.preventDefault();
            updatePartner(id, e);
        };
    }
}

// Actualizar aliado
function updatePartner(id, e) {
    const formData = new FormData(e.target);
    const index = partners.findIndex(p => p.id === id);
    
    if (index !== -1) {
        partners[index] = {
            ...partners[index],
            company: formData.get('company'),
            contact: formData.get('contact'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            type: formData.get('type'),
            description: formData.get('description')
        };
        
        renderPartnersTable();
        closePartnerModal();
        
        // Restaurar comportamiento original del formulario
        document.getElementById('partnerForm').onsubmit = handleAddPartner;
        
        showNotification('Aliado actualizado exitosamente', 'success');
    }
}

// Eliminar aliado
function deletePartner(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este aliado?')) {
        return;
    }
    
    partners = partners.filter(p => p.id !== id);
    renderPartnersTable();
    updateStats();
    
    showNotification('Aliado eliminado', 'info');
}

// Filtrar aliados
function filterPartners() {
    const searchTerm = document.getElementById('searchPartner').value.toLowerCase();
    const filterType = document.getElementById('filterPartnerType').value;
    
    const filteredPartners = partners.filter(partner => {
        const matchesSearch = partner.company.toLowerCase().includes(searchTerm) || 
                            partner.contact.toLowerCase().includes(searchTerm) ||
                            partner.email.toLowerCase().includes(searchTerm);
        const matchesType = !filterType || partner.type === filterType;
        
        return matchesSearch && matchesType;
    });
    
    // Renderizar tabla filtrada
    const tbody = document.getElementById('partnerTableBody');
    tbody.innerHTML = '';
    
    filteredPartners.forEach(partner => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${partner.company}</td>
            <td>${partner.contact}</td>
            <td>${partner.email}</td>
            <td>${partner.phone}</td>
            <td><span class="badge ${partner.type}">${getPartnerTypeLabel(partner.type)}</span></td>
            <td><span class="status-badge ${partner.status}">${partner.status === 'activo' ? 'Activo' : 'Inactivo'}</span></td>
            <td>
                <button class="btn-icon" onclick="viewPartner(${partner.id})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="editPartner(${partner.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon danger" onclick="deletePartner(${partner.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Obtener etiqueta del tipo de aliado
function getPartnerTypeLabel(type) {
    const labels = {
        'tecnologia': 'Tecnología',
        'marketing': 'Marketing',
        'logistica': 'Logística',
        'financiero': 'Financiero'
    };
    return labels[type] || type;
}

// Cambiar foto de perfil
function handleProfilePicChange(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('adminProfilePic').src = e.target.result;
            currentUser.profilePic = e.target.result;
            updateSession();
        };
        reader.readAsDataURL(file);
    }
}

// Actualizar perfil
function handleUpdateProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('profileName').value;
    const phone = document.getElementById('profilePhone').value;
    
    currentUser.name = name;
    currentUser.phone = phone;
    
    updateSession();
    document.getElementById('adminName').textContent = name;
    
    showNotification('Perfil actualizado exitosamente', 'success');
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
        month: 'long', 
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

// Estilos adicionales
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
    
    .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .badge.tecnologia {
        background-color: #e3f2fd;
        color: #1976d2;
    }
    
    .badge.marketing {
        background-color: #fce4ec;
        color: #c2185b;
    }
    
    .badge.logistica {
        background-color: #e8f5e9;
        color: #388e3c;
    }
    
    .badge.financiero {
        background-color: #fff3e0;
        color: #f57c00;
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .status-badge.activo {
        background-color: #d4edda;
        color: #155724;
    }
    
    .status-badge.inactivo {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .no-data {
        text-align: center;
        color: var(--light-gray);
        padding: 2rem;
    }
`;
document.head.appendChild(style);