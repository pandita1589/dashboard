// server.js - Servidor HTTP simple para desarrollo local
// Este archivo es OPCIONAL - Solo si tienes problemas con CORS al abrir los archivos directamente

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Crear servidor
const server = http.createServer((req, res) => {
    // Ruta por defecto
    let filePath = req.url === '/' ? '/login.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // Obtener extensión del archivo
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Leer y servir el archivo
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                // Error del servidor
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            // Servir archivo exitosamente
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache' // Evitar caché durante desarrollo
            });
            res.end(content, 'utf-8');
        }
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║                                            ║
    ║   Sistema Empresarial - Servidor Local     ║
    ║                                            ║
    ╠════════════════════════════════════════════╣
    ║                                            ║
    ║   Servidor ejecutándose en:                ║
    ║   http://localhost:${PORT}                     ║
    ║                                            ║
    ║   Presiona Ctrl+C para detener             ║
    ║                                            ║
    ╚════════════════════════════════════════════╝
    
    Credenciales de acceso:
    - CEO: ceo@empresa.com / ceo123
    - Admin: admin@empresa.com / admin123
    - Empleados: dev@empresa.com / dev123
    `);
});

// Manejo de errores
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Servidor detenido');
    });
});

/*
INSTRUCCIONES DE USO:

1. Asegúrate de tener Node.js instalado
2. Guarda este archivo en la raíz del proyecto
3. Abre una terminal en la carpeta del proyecto
4. Ejecuta: node server.js
5. Abre tu navegador en http://localhost:3000
6. ¡Listo! El sistema estará funcionando

NOTA: Este servidor es solo para desarrollo local.
Para producción, usa un servidor web real como Apache o Nginx.
*/