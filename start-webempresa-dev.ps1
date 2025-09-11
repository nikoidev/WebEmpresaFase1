# Script de PowerShell para iniciar Web Empresa en desarrollo
# Autor: Asistente IA
# Descripción: Inicia servicios de desarrollo para Web Empresa

Write-Host "🚀 Iniciando Web Empresa en modo desarrollo..." -ForegroundColor Green
Write-Host ""

# Verificar que Node.js esté disponible
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar que Docker esté corriendo
try {
    docker ps | Out-Null
    Write-Host "✅ Docker está disponible" -ForegroundColor Green
}
catch {
    Write-Host "❌ Docker no está disponible. Asegúrate de que Docker Desktop esté corriendo." -ForegroundColor Red
    exit 1
}

# Ejecutar el script principal de Node.js
Write-Host "🎯 Ejecutando script principal..." -ForegroundColor Cyan
node dev-start.js
