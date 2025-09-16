'use client'

import { Calendar, TrendingUp, Users, Award } from 'lucide-react'
import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'
import PublicLayout from '@/components/layout/PublicLayout'

export default function HistoriaPage() {
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    const loadContent = async () => {
        try {
            console.log('🔄 Cargando contenido de /historia...')
            const response = await publicApi.getPageContent('history')
            console.log('✅ Contenido cargado:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('❌ Error loading history content:', error)
            // Usar contenido por defecto si falla
            setContent({
                hero_title: 'Nuestra Historia',
                hero_subtitle: 'Un viaje de innovación y crecimiento',
                hero_description: ''
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

    useEffect(() => {
        // Recargar contenido cuando la página vuelve a tener foco
        // Esto detecta cuando regresas del admin
        const handleFocus = () => {
            // NO recargar si hay un modal abierto (evita cerrar modals accidentalmente)
            if (editingSection) {
                console.log('🚨 Modal abierto - EVITANDO recarga por focus')
                return
            }
            console.log('🔄 Historia - Página recuperó foco, recargando contenido...')
            loadContent()
        }
        
        window.addEventListener('focus', handleFocus)
        
        return () => {
            window.removeEventListener('focus', handleFocus)
        }
    }, [editingSection])

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
            <DevFileInfo filePath="frontend/src/app/historia/page.tsx" />
            
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
                            {content?.hero_title || 'Nuestra Historia'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            {content?.hero_subtitle || 'Un viaje de innovación y crecimiento'}
                        </p>
                        {content?.hero_description && (
                            <p className="text-lg text-primary-200 max-w-2xl mx-auto">
                                {content.hero_description}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Introducción"
                    onEdit={() => handleSectionEdit('intro', 'Introducción')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {content?.intro_title || 'Cómo Comenzó Todo'}
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        {content?.intro_description || 'SEVP nació de la visión de transformar la educación mediante la tecnología, creando soluciones innovadoras que empoderan a las instituciones educativas para alcanzar su máximo potencial.'}
                    </p>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Línea de Tiempo"
                    onEdit={() => handleSectionEdit('timeline', 'Línea de Tiempo')}
                    position="top-right"
                />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.timeline_title || 'Hitos Importantes'}
                        </h2>
                        <p className="text-xl text-gray-600">
                            {content?.timeline_description || 'Los momentos clave en nuestro crecimiento'}
                        </p>
                    </div>

                    {content?.milestones?.length > 0 ? (
                        <div className="space-y-12">
                            {content.milestones.map((milestone: any, index: number) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex-shrink-0 w-24 text-center">
                                        <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Calendar className="h-8 w-8" />
                                        </div>
                                        <span className="text-sm font-semibold text-primary-600">
                                            {milestone.year}
                                        </span>
                                    </div>
                                    <div className="flex-1 ml-8 bg-white p-6 rounded-lg shadow-sm">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {milestone.title}
                                        </h3>
                                        <p className="text-gray-600">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-600">
                            <Calendar className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                            <p>Línea de tiempo disponible próximamente</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Impact Numbers Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Números de Impacto"
                    onEdit={() => handleSectionEdit('impact', 'Números de Impacto')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.impact_title || 'Nuestro Impacto'}
                        </h2>
                        <p className="text-xl text-gray-600">
                            {content?.impact_description || 'Números que reflejan nuestro crecimiento'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content?.stats?.length > 0 ? (
                            content.stats.map((stat: any, index: number) => (
                                <div key={index} className="text-center">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <TrendingUp className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {stat.number}
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {stat.label}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                                    <p className="text-gray-600 font-medium">Instituciones</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <TrendingUp className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">100K+</div>
                                    <p className="text-gray-600 font-medium">Estudiantes</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Award className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
                                    <p className="text-gray-600 font-medium">Países</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">5+</div>
                                    <p className="text-gray-600 font-medium">Años</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Future Vision Section */}
            <section className="py-24 bg-primary-600 relative">
                <SectionEditButton 
                    sectionName="Visión de Futuro"
                    onEdit={() => handleSectionEdit('future', 'Visión de Futuro')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {content?.future_title || 'Hacia el Futuro'}
                    </h2>
                    <p className="text-xl text-primary-100 mb-8">
                        {content?.future_description || 'Continuamos innovando para crear el futuro de la educación, con nuevas tecnologías y soluciones que transformarán la manera de enseñar y aprender.'}
                    </p>
                    {content?.future_vision && (
                        <p className="text-lg text-primary-200 mb-8 max-w-3xl mx-auto">
                            {content.future_vision}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/nosotros"
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                        >
                            Conoce al Equipo
                        </a>
                        <a
                            href="/contacto"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                        >
                            Únete a Nosotros
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
                    pageKey="history"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                    isSaving={false}
                />
            )}
        </PublicLayout>
    )
}
