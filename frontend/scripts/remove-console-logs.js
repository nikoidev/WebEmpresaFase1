#!/usr/bin/env node

/**
 * Script para eliminar console.log statements del código frontend para producción
 * Uso: node scripts/remove-console-logs.js
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Directorio fuente
const srcDir = path.join(__dirname, '../src')

// Patrones de archivos a procesar
const patterns = [
    `${srcDir}/**/*.ts`,
    `${srcDir}/**/*.tsx`,
    `${srcDir}/**/*.js`,
    `${srcDir}/**/*.jsx`
]

// Regex para encontrar console.log statements
const consoleLogRegex = /console\.(log|debug|info|warn|error)\([^)]*\)[\s]*;?/g

function removeConsoleLogs() {
    let totalFiles = 0
    let modifiedFiles = 0
    let totalRemovals = 0

    patterns.forEach(pattern => {
        const files = glob.sync(pattern)
        
        files.forEach(file => {
            totalFiles++
            
            const content = fs.readFileSync(file, 'utf8')
            const originalContent = content
            
            // Buscar y contar console.logs
            const matches = content.match(consoleLogRegex)
            if (matches) {
                // Remover console.logs
                const newContent = content.replace(consoleLogRegex, '')
                
                // Solo escribir si hay cambios
                if (newContent !== originalContent) {
                    fs.writeFileSync(file, newContent, 'utf8')
                    modifiedFiles++
                    totalRemovals += matches.length
                    console.log(`✅ Removido ${matches.length} console.log(s) de: ${path.relative(srcDir, file)}`)
                }
            }
        })
    })
    
    console.log(`\n📊 Resumen:`)
    console.log(`- Archivos procesados: ${totalFiles}`)
    console.log(`- Archivos modificados: ${modifiedFiles}`)
    console.log(`- Total console.log(s) removidos: ${totalRemovals}`)
    console.log(`\n🎉 ¡Limpieza completada!`)
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
    console.log('🧹 Iniciando limpieza de console.log statements...\n')
    removeConsoleLogs()
}

module.exports = { removeConsoleLogs }
