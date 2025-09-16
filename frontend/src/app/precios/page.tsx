'use client'

import { Check, Star } from 'lucide-react'
import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'
import PublicLayout from '@/components/layout/PublicLayout'

export default function PreciosPage() {
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    const loadContent = async () => {
        try {
            console.log('🔄 Cargando contenido de /precios...')
            const response = await publicApi.getPageContent('pricing')
            console.log('✅ Contenido cargado:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('❌ Error loading pricing content:', error)
            // Usar contenido por defecto si falla
            setContent({
                hero: {
                    title: 'Planes y Precios',
                    subtitle: 'Elige el plan perfecto para tu institución educativa'
                }
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSectionEdit = (sectionType: string, sectionName: string) => {
        setEditingSection(sectionType)
        setEditingSectionName(sectionName)
    }

    const handleSectionSave = async () => {
        // Recargar contenido después de guardar
        await loadContent()
        setEditingSection(null)
        setEditingSectionName('')
    }

    useEffect(() => {
        loadContent()
    }, [])

    if (loading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
                </div>
            </PublicLayout>
        )
    }

    return (
        <PublicLayout>
            <DevFileInfo filePath="frontend/src/app/precios/page.tsx" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white relative">
                <SectionEditButton 
                    sectionName="Sección Hero"
                    onEdit={() => handleSectionEdit('hero', 'Sección Hero')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                            {content?.hero?.title || 'Planes y Precios'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            {content?.hero?.subtitle || 'Elige el plan perfecto para tu institución educativa'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Planes y Precios"
                    onEdit={() => handleSectionEdit('pricing', 'Planes y Precios')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Planes Disponibles
                        </h2>
                        <p className="text-xl text-gray-600">
                            Soluciones escalables para instituciones de todos los tamaños
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Plan Básico */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
                                <div className="text-4xl font-bold text-primary-600 mb-2">$99</div>
                                <p className="text-gray-600">por mes</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Hasta 100 estudiantes</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>5 cursos activos</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Soporte por email</span>
                                </li>
                            </ul>
                            <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                                Comenzar
                            </button>
                        </div>

                        {/* Plan Profesional */}
                        <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-primary-600 relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                                    <Star className="h-4 w-4 mr-1" />
                                    Popular
                                </span>
                            </div>
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Profesional</h3>
                                <div className="text-4xl font-bold text-primary-600 mb-2">$299</div>
                                <p className="text-gray-600">por mes</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Hasta 500 estudiantes</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Cursos ilimitados</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Soporte prioritario</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Reportes avanzados</span>
                                </li>
                            </ul>
                            <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                                Comenzar
                            </button>
                        </div>

                        {/* Plan Empresarial */}
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Empresarial</h3>
                                <div className="text-4xl font-bold text-primary-600 mb-2">$599</div>
                                <p className="text-gray-600">por mes</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Estudiantes ilimitados</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Funciones premium</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Soporte 24/7</span>
                                </li>
                                <li className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                    <span>Integración personalizada</span>
                                </li>
                            </ul>
                            <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                                Contactar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Sección Empresarial"
                    onEdit={() => handleSectionEdit('enterprise', 'Sección Empresarial')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        ¿Necesitas algo más personalizado?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Contáctanos para soluciones empresariales a medida
                    </p>
                    <a
                        href="/contacto"
                        className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                    >
                        Solicitar Cotización
                    </a>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Preguntas Frecuentes"
                    onEdit={() => handleSectionEdit('faq', 'Preguntas Frecuentes')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-xl text-gray-600">
                            Respuestas sobre nuestros planes y precios
                        </p>
                    </div>

                    {content?.faq?.length > 0 ? (
                        <div className="space-y-6">
                            {content.faq.map((item: any, index: number) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {item.question}
                                    </h3>
                                    <p className="text-gray-600">
                                        {item.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            <p>Preguntas frecuentes disponibles próximamente</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal de edición por sección */}
            {editingSection && fullPageContent && (
                <UniversalSectionEditModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    sectionType={editingSection}
                    sectionName={editingSectionName}
                    pageKey="pricing"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                />
            )}
        </PublicLayout>
    )
}
