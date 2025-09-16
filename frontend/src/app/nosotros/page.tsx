'use client'

import { Award, Heart, Target, Users } from 'lucide-react'
import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'
import PublicLayout from '@/components/layout/PublicLayout'

export default function NosotrosPage() {
    const [aboutContent, setAboutContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    const loadContent = async () => {
        try {
            console.log('🔄 Cargando contenido de /nosotros...')
            const response = await publicApi.getPageContent('about')
            console.log('✅ Contenido cargado:', response.data)
            setAboutContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('❌ Error loading about content:', error)
            // Usar contenido por defecto si falla
            setAboutContent({
                hero: {
                    title: 'Sobre Nosotros',
                    subtitle: 'Quiénes somos y qué nos motiva'
                },
                mission: 'Transformar la educación con tecnología innovadora',
                values: [],
                team: []
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
            <DevFileInfo filePath="frontend/src/app/nosotros/page.tsx" />
            
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
                            {aboutContent?.hero?.title || 'Sobre Nosotros'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            {aboutContent?.hero?.subtitle || 'Quiénes somos y qué nos motiva'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Misión y Visión"
                    onEdit={() => handleSectionEdit('mission', 'Misión y Visión')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Nuestra Misión
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            {aboutContent?.mission || 'Transformar la educación con tecnología innovadora'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Valores"
                    onEdit={() => handleSectionEdit('values', 'Valores')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Nuestros Valores
                        </h2>
                        <p className="text-xl text-gray-600">
                            Los principios que guían nuestro trabajo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {aboutContent?.values?.map((value: any, index: number) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                    <Heart className="h-8 w-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">
                                    {value.description}
                                </p>
                            </div>
                        )) || (
                            // Contenido por defecto
                            <>
                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <Target className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Innovación
                                    </h3>
                                    <p className="text-gray-600">
                                        Buscamos constantemente nuevas formas de mejorar la experiencia educativa.
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <Heart className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Compromiso
                                    </h3>
                                    <p className="text-gray-600">
                                        Nos comprometemos con el éxito de cada institución educativa.
                                    </p>
                                </div>
                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <Award className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Excelencia
                                    </h3>
                                    <p className="text-gray-600">
                                        Mantenemos los más altos estándares de calidad en todo lo que hacemos.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Equipo"
                    onEdit={() => handleSectionEdit('team', 'Equipo')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Nuestro Equipo
                        </h2>
                        <p className="text-xl text-gray-600">
                            Profesionales dedicados a transformar la educación
                        </p>
                    </div>

                    {aboutContent?.team?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {aboutContent.team.map((member: any, index: number) => (
                                <div key={index} className="text-center">
                                    {member.image && (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                        />
                                    )}
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-primary-600 font-medium mb-2">
                                        {member.position}
                                    </p>
                                    <p className="text-gray-600">
                                        {member.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <Users className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">
                                Información del equipo disponible próximamente
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary-600 relative">
                <SectionEditButton 
                    sectionName="Llamada a la Acción"
                    onEdit={() => handleSectionEdit('cta', 'Llamada a la Acción')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        ¿Quieres conocer más sobre nosotros?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                        Contáctanos y descubre cómo podemos ayudar a transformar tu institución educativa
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contacto"
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                        >
                            Contáctanos
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
                    pageKey="about"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                />
            )}
        </PublicLayout>
    )
}
