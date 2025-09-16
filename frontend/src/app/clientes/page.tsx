'use client'

import { Building, Star, TrendingUp, Users } from 'lucide-react'
import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'
import PublicLayout from '@/components/layout/PublicLayout'

export default function ClientesPage() {
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    const loadContent = async () => {
        try {
            console.log('🔄 Cargando contenido de /clientes...')
            const response = await publicApi.getPageContent('clients')
            console.log('✅ Contenido cargado:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('❌ Error loading clients content:', error)
            // Usar contenido por defecto si falla
            setContent({
                hero: {
                    title: 'Nuestros Clientes',
                    subtitle: 'Instituciones que confían en nosotros'
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
            <DevFileInfo filePath="frontend/src/app/clientes/page.tsx" />
            
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
                            {content?.hero?.title || 'Nuestros Clientes'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            {content?.hero?.subtitle || 'Instituciones que confían en nosotros'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Client Types Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Tipos de Clientes"
                    onEdit={() => handleSectionEdit('client_types', 'Tipos de Clientes')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Tipos de Instituciones
                        </h2>
                        <p className="text-xl text-gray-600">
                            Trabajamos con diferentes tipos de instituciones educativas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content?.client_types?.length > 0 ? (
                            content.client_types.map((type: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                                        <Building className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {type.name}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {type.description}
                                    </p>
                                    <div className="text-2xl font-bold text-primary-600">
                                        {type.count}+
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        instituciones
                                    </p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                                        <Building className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Universidades
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Instituciones de educación superior que buscan modernizar sus procesos
                                    </p>
                                    <div className="text-2xl font-bold text-primary-600">150+</div>
                                    <p className="text-sm text-gray-500">instituciones</p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                                        <Users className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Colegios
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Instituciones de educación básica y media que innovan en su gestión
                                    </p>
                                    <div className="text-2xl font-bold text-primary-600">200+</div>
                                    <p className="text-sm text-gray-500">instituciones</p>
                                </div>
                                <div className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                                        <TrendingUp className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Institutos
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Centros de formación técnica y profesional especializados
                                    </p>
                                    <div className="text-2xl font-bold text-primary-600">100+</div>
                                    <p className="text-sm text-gray-500">instituciones</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Testimonios"
                    onEdit={() => handleSectionEdit('testimonials', 'Testimonios')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Lo que Dicen Nuestros Clientes
                        </h2>
                        <p className="text-xl text-gray-600">
                            Testimonios reales de instituciones que han transformado su gestión
                        </p>
                    </div>

                    {content?.testimonials?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content.testimonials.map((testimonial: any, index: number) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center">
                                        {testimonial.image && (
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {testimonial.position}, {testimonial.institution}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            <Star className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                            <p>Testimonios disponibles próximamente</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Success Metrics Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Métricas de Éxito"
                    onEdit={() => handleSectionEdit('metrics', 'Métricas de Éxito')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Resultados que Hablan por Sí Solos
                        </h2>
                        <p className="text-xl text-gray-600">
                            Métricas de éxito de nuestros clientes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content?.metrics?.length > 0 ? (
                            content.metrics.map((metric: any, index: number) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl font-bold text-primary-600 mb-2">
                                        {metric.value}
                                    </div>
                                    <p className="text-gray-900 font-semibold mb-2">
                                        {metric.label}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {metric.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
                                    <p className="text-gray-900 font-semibold mb-2">Satisfacción</p>
                                    <p className="text-sm text-gray-600">de nuestros clientes</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-primary-600 mb-2">45%</div>
                                    <p className="text-gray-900 font-semibold mb-2">Reducción de Costos</p>
                                    <p className="text-sm text-gray-600">en procesos administrativos</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-primary-600 mb-2">300%</div>
                                    <p className="text-gray-900 font-semibold mb-2">Aumento en Engagement</p>
                                    <p className="text-sm text-gray-600">estudiantil promedio</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
                                    <p className="text-gray-900 font-semibold mb-2">Soporte</p>
                                    <p className="text-sm text-gray-600">disponibilidad completa</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-600 relative">
                <SectionEditButton 
                    sectionName="Llamada a la Acción"
                    onEdit={() => handleSectionEdit('cta', 'Llamada a la Acción')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        ¿Listo para Unirte a Nuestros Clientes Exitosos?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        Descubre cómo SEVP puede transformar tu institución educativa
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contacto"
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                        >
                            Solicitar Demo
                        </a>
                        <a
                            href="/precios"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                        >
                            Ver Precios
                        </a>
                    </div>
                </div>
            </section>

            {/* Modal de edición por sección */}
            {editingSection && fullPageContent && (
                <UniversalSectionEditModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    sectionType={editingSection}
                    sectionName={editingSectionName}
                    pageKey="clients"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                />
            )}
        </PublicLayout>
    )
}
