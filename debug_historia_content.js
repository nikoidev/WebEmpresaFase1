const axios = require('axios');

async function debugHistoriaContent() {
    try {
        console.log('🔍 Obteniendo contenido de página Historia...');
        
        const response = await axios.get('http://localhost:8002/api/v1/page-content/history/');
        
        console.log('✅ Respuesta del servidor:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        
        if (response.data && response.data.content_json) {
            console.log('\n📋 Contenido JSON parseado:');
            console.log(JSON.stringify(response.data.content_json, null, 2));
            
            if (response.data.content_json.stats) {
                console.log('\n📊 Estadísticas encontradas:');
                response.data.content_json.stats.forEach((stat, index) => {
                    console.log(`Stat ${index + 1}:`);
                    console.log(`  Número: "${stat.number}"`);
                    console.log(`  Etiqueta: "${stat.label}"`);
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

debugHistoriaContent();
