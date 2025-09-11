#!/usr/bin/env node
/**
 * Script de desarrollo para Web Empresa
 * Inicia automáticamente backend (Django) y frontend (Next.js)
 */

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('🚀 Iniciando Web Empresa en modo desarrollo...\n');

// Verificar que Docker esté corriendo
const dockerCheck = spawn('docker', ['ps'], { stdio: 'pipe' });
dockerCheck.on('error', () => {
    console.log('❌ Docker no está disponible. Asegúrate de que Docker Desktop esté corriendo.');
    process.exit(1);
});

dockerCheck.on('close', (code) => {
    if (code !== 0) {
        console.log('❌ Error al conectar con Docker. Asegúrate de que Docker Desktop esté corriendo.');
        process.exit(1);
    }

    console.log('✅ Docker está disponible');
    startServices();
});

function startServices() {
    // Levantar servicios Docker
    console.log('📦 Levantando servicios Docker (PostgreSQL + Redis)...');
    const dockerCompose = spawn('docker-compose', ['-f', 'docker-compose.webempresa.yml', 'up', '-d'], {
        cwd: __dirname,
        stdio: 'inherit'
    });

    dockerCompose.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Servicios Docker iniciados correctamente\n');

            // Esperar un poco para que la base de datos esté lista
            setTimeout(() => {
                startBackend();
                startFrontend();
            }, 3000);
        } else {
            console.log('❌ Error al iniciar servicios Docker');
            process.exit(1);
        }
    });
}

function startBackend() {
    console.log('🐍 Iniciando Django Backend en puerto 8001...');

    const isWindows = os.platform() === 'win32';
    const backendDir = path.join(__dirname, 'backend');

    // Ejecutar migraciones primero
    const migrate = spawn('pipenv', ['run', 'python', 'manage.py', 'migrate'], {
        cwd: backendDir,
        stdio: 'inherit',
        shell: isWindows
    });

    migrate.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Migraciones aplicadas correctamente');

            // Iniciar servidor Django
            const backend = spawn('pipenv', ['run', 'python', 'manage.py', 'runserver', '8001'], {
                cwd: backendDir,
                stdio: 'inherit',
                shell: isWindows
            });

            backend.on('error', (error) => {
                console.log('❌ Error al iniciar backend:', error.message);
            });

            // Manejar cierre del proceso
            process.on('SIGINT', () => {
                console.log('\n🛑 Cerrando backend...');
                backend.kill();
            });

        } else {
            console.log('❌ Error en migraciones de Django');
        }
    });
}

function startFrontend() {
    console.log('⚡ Iniciando Next.js Frontend en puerto 3001...');

    const isWindows = os.platform() === 'win32';
    const frontendDir = path.join(__dirname, 'frontend');

    // En Windows, usar npm directamente para evitar problemas con scripts bash
    const npmCommand = isWindows ? 'npm.cmd' : 'npm';

    const frontend = spawn(npmCommand, ['run', 'dev'], {
        cwd: frontendDir,
        stdio: 'inherit',
        shell: isWindows,
        env: {
            ...process.env,
            NEXT_PUBLIC_API_URL: 'http://localhost:8001'
        }
    });

    frontend.on('error', (error) => {
        console.log('❌ Error al iniciar frontend:', error.message);
    });

    // Manejar cierre del proceso
    process.on('SIGINT', () => {
        console.log('\n🛑 Cerrando frontend...');
        frontend.kill();
    });
}

// Manejar cierre limpio
process.on('SIGINT', () => {
    console.log('\n\n🛑 Cerrando Web Empresa...');
    process.exit(0);
});

// Mostrar información útil
setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🌐 WEB EMPRESA - URLs de Desarrollo');
    console.log('='.repeat(60));
    console.log('📱 Frontend:     http://localhost:3001');
    console.log('🔧 Backend API:  http://localhost:8001');
    console.log('👨‍💼 Admin Panel:  http://localhost:8001/admin');
    console.log('🗄️  PostgreSQL:   localhost:5433');
    console.log('🔴 Redis:        localhost:6380');
    console.log('='.repeat(60));
    console.log('💡 Credenciales Admin: admin / admin123');
    console.log('⏹️  Para detener: Ctrl + C');
    console.log('='.repeat(60) + '\n');
}, 5000);
