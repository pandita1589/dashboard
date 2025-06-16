# Sistema Empresarial - Documentación

## 📋 Descripción
Sistema de gestión empresarial completo con diferentes paneles según el rol del usuario. Incluye gestión de empleados, departamentos, reportes y más.

## 🎨 Características del Rediseño

### Mejoras Visuales
- **Nuevo diseño moderno** con gradientes y sombras mejoradas
- **Tema claro/oscuro mejorado** con mejor legibilidad en ambos modos
- **Login con fondo animado** de estrellas y partículas
- **Logo rediseñado** con diseño moderno y animaciones
- **Botón de tema reubicado** en la esquina inferior derecha para no tapar notificaciones

### Sistema de Reportes
- **Todos los empleados y administradores** pueden enviar reportes al CEO
- **4 niveles de prioridad** con colores distintivos:
  - 🔴 **Grave** (Rojo)
  - 🟠 **Urgente** (Naranja)
  - 🟡 **Medio** (Amarillo)
  - 🟢 **Bajo** (Verde)
- **Vista mejorada de reportes** para el CEO con filtros y búsqueda

### Mejoras en Formularios
- **Mejor legibilidad** en modo oscuro
- **Iconos en campos** de entrada
- **Efectos hover** y focus mejorados
- **Validación visual** mejorada

## 🔐 Credenciales de Acceso

### CEO
- Email: `ceo@empresa.com`
- Password: `ceo123`

### Administración
- Email: `admin@empresa.com`
- Password: `admin123`

### Empleados
- **Programación**: `dev@empresa.com` / `dev123`
- **Soporte**: `support@empresa.com` / `support123`
- **Database**: `db@empresa.com` / `db123`
- **Diseño Gráfico**: `design@empresa.com` / `design123`

## 📁 Estructura de Archivos

```
sistema-empresarial/
├── index.html              # Página de login
├── ceo-dashboard.html      # Panel del CEO
├── admin-dashboard.html    # Panel de Administración
├── employee-dashboard.html # Panel de Empleados
├── styles.css             # Estilos principales
├── js/
│   ├── login.js           # Sistema de autenticación
│   ├── ceo-dashboard.js   # Lógica del panel CEO
│   ├── admin-dashboard.js # Lógica del panel Admin
│   └── employee-dashboard.js # Lógica del panel Empleados
└── assets/
    ├── logo-empresa.png   # Logo de la empresa
    └── default-avatar.png # Avatar por defecto
```

## 🚀 Características por Rol

### CEO
- Vista general de la empresa
- Gestión de empleados (contratar/despedir)
- Creación de eventos corporativos
- **Recepción de reportes** de todos los departamentos
- Vista de departamentos
- Configuración del sistema

### Administración
- Gestión de aliados/partners
- Calendario de eventos
- Gestión de documentos
- **Envío de reportes** al CEO
- Vista general administrativa

### Empleados
- Gestión de tareas personales
- Vista del equipo de trabajo
- Recursos del departamento
- **Envío de reportes** al CEO
- Calendario de eventos del departamento

## 🛠️ Personalización

### Cambiar Colores del Tema
En `styles.css`, modifica las variables CSS en `:root` y `[data-theme="dark"]`:

```css
:root {
    --accent-primary: #5b3ff9;  /* Color principal */
    --accent-secondary: #7c5cfc; /* Color secundario */
    /* ... más colores ... */
}
```

### Agregar Nuevos Departamentos
1. En `login.js`, agrega nuevos usuarios al array `users`
2. En `employee-dashboard.js`, agrega la configuración en `departmentConfig`
3. En los formularios de contratación, agrega la opción del departamento

### Modificar Prioridades de Reportes
En `styles.css`, busca las variables de prioridad:

```css
--priority-grave: #dc3545;
--priority-urgente: #ff6b35;
--priority-medio: #ffc107;
--priority-bajo: #28a745;
```

## 📱 Responsive Design
- **Desktop**: Vista completa con sidebar
- **Tablet**: Sidebar colapsable
- **Móvil**: Diseño adaptado con menú hamburguesa

## 🔧 Próximas Mejoras Sugeridas
1. Integración con base de datos real (MongoDB)
2. Sistema de notificaciones en tiempo real
3. Chat interno entre empleados
4. Dashboard con gráficos interactivos
5. Sistema de permisos más granular
6. Exportación de reportes a PDF
7. API REST para integración con otros sistemas

## 💡 Notas Importantes
- El sistema usa `localStorage` y `sessionStorage` para persistencia temporal
- Los datos son de ejemplo y se reinician al recargar
- El límite de empleados está configurado en 50
- Los reportes se almacenan en `localStorage` con la clave 'companyReports'
