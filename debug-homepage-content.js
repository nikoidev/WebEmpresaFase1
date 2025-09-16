// Script para depurar el contenido de homepage
// Ejecutar desde la raíz del proyecto: node debug-homepage-content.js

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:8002';

async function debugHomepageContent() {
    try {
        console.log('🔍 Debugging Homepage Content...');
        console.log('=' * 50);

        // Obtener contenido actual
        const response = await fetch(`${API_BASE_URL}/api/v1/page-content/public/homepage/`);
        const data = await response.json();

        console.log('📊 Response Status:', response.status);
        console.log('📋 Full Response:');
        console.log(JSON.stringify(data, null, 2));

        console.log('\n🔍 Content JSON Structure:');
        console.log(JSON.stringify(data.content_json, null, 2));

        // Verificar estructura específica
        console.log('\n✅ Structure Analysis:');
        console.log('Hero section exists:', !!data.content_json?.hero);
        console.log('Hero title:', data.content_json?.hero?.title);
        console.log('Hero subtitle:', data.content_json?.hero?.subtitle);
        console.log('Hero description:', data.content_json?.hero?.description);
        console.log('Features exists:', !!data.content_json?.features);
        console.log('Features count:', data.content_json?.features?.length || 0);
        console.log('Features title:', data.content_json?.features_title);
        console.log('CTA exists:', !!data.content_json?.call_to_action);
        console.log('CTA title:', data.content_json?.call_to_action?.title);

        // Verificar estructura plana vs anidada
        console.log('\n📊 Data Structure Check:');
        console.log('Flat structure (hero_title):', data.content_json?.hero_title);
        console.log('Nested structure (hero.title):', data.content_json?.hero?.title);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('❌ Details:', error);
    }
}

debugHomepageContent();
