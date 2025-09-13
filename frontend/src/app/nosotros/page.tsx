'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { Award, Heart, Target, Users } from 'lucide-react'
import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import InlineEditButton from '@/components/InlineEditButton'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'

// Metadata se maneja desde layout.tsx para client components

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

    return (
        <PublicLayout>
            <DevFileInfo filePath="frontend/src/app/nosotros/page.tsx" />
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24 relative">
                <SectionEditButton 
                    sectionName="Sección Hero"
                    onEdit={() => handleSectionEdit('hero', 'Sección Hero')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {aboutContent?.hero_title || 'Nosotros'}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            {aboutContent?.hero_subtitle || aboutContent?.hero_description || 'Somos un equipo apasionado por transformar la educación a través de la tecnología'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Misión y Visión"
                    onEdit={() => handleSectionEdit('mission', 'Misión y Visión')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <div>
                            <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                <Target className="h-8 w-8 text-primary-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                {aboutContent?.mission || 'Democratizar el acceso a herramientas educativas de calidad profesional, permitiendo que instituciones educativas de todos los tamaños puedan ofrecer experiencias de aprendizaje excepcionales.'}
                            </p>
                            <p className="text-lg text-gray-600">
                                {aboutContent?.mission_description || 'Creemos que cada estudiante merece acceso a una educación de calidad, y trabajamos cada día para hacer realidad esta visión a través de tecnología innovadora y accesible.'}
                            </p>
                        </div>

                        <div>
                            <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                <Heart className="h-8 w-8 text-primary-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nuestra Visión</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                {aboutContent?.vision || 'Ser la plataforma educativa líder en América Latina, reconocida por su capacidad de transformar instituciones educativas y empoderar a educadores y estudiantes.'}
                            </p>
                            <p className="text-lg text-gray-600">
                                {aboutContent?.vision_description || 'Aspiramos a un futuro donde la tecnología educativa sea intuitiva, accesible y poderosa, creando oportunidades ilimitadas de aprendizaje para todos.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Valores"
                    onEdit={() => handleSectionEdit('values', 'Valores')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {aboutContent?.values_title || 'Nuestros Valores'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {aboutContent?.values_description || 'Los principios que guían cada decisión que tomamos'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {aboutContent?.values?.map((value: any, index: number) => (
                            <div key={index} className="text-center">
                                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-2xl">{value.icon || '💎'}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                                <p className="text-gray-600">
                                    {value.description}
                                </p>
                            </div>
                        )) || (
                            <>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Users className="h-10 w-10 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Colaboración</h3>
                                    <p className="text-gray-600">
                                        Creemos en el poder del trabajo en equipo y la construcción conjunta
                                        de soluciones innovadoras.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Award className="h-10 w-10 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Excelencia</h3>
                                    <p className="text-gray-600">
                                        Nos comprometemos a entregar productos y servicios de la más alta
                                        calidad en cada interacción.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Heart className="h-10 w-10 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Pasión</h3>
                                    <p className="text-gray-600">
                                        Amamos lo que hacemos y ponemos el corazón en cada proyecto
                                        para crear impacto real.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Target className="h-10 w-10 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovación</h3>
                                    <p className="text-gray-600">
                                        Buscamos constantemente nuevas formas de resolver problemas
                                        y mejorar la experiencia educativa.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Equipo"
                    onEdit={() => handleSectionEdit('team', 'Equipo')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {aboutContent?.team_title || 'Nuestro Equipo'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {aboutContent?.team_description || 'Profesionales apasionados por la educación y la tecnología'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {aboutContent?.team?.map((member: any, index: number) => {
                            const initials = member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className="text-3xl font-bold text-white">{initials}</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                                    <p className="text-primary-600 font-medium mb-4">{member.position}</p>
                                    <p className="text-gray-600">
                                        {member.bio}
                                    </p>
                                </div>
                            )
                        }) || (
                            <>
                                {/* Contenido por defecto si no hay equipo en BD */}
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">AM</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ana Martínez</h3>
                                    <p className="text-primary-600 font-medium mb-4">CEO & Fundadora</p>
                                    <p className="text-gray-600">
                                        Más de 15 años de experiencia en tecnología educativa.
                                        Visionaria apasionada por democratizar la educación.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">CL</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Carlos López</h3>
                                    <p className="text-primary-600 font-medium mb-4">CTO</p>
                                    <p className="text-gray-600">
                                        Experto en arquitectura de software y sistemas distribuidos.
                                        Lidera el desarrollo técnico de la plataforma.
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white">MR</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">María Rodríguez</h3>
                                    <p className="text-primary-600 font-medium mb-4">Head of Product</p>
                                    <p className="text-gray-600">
                                        Especialista en UX/UI y productos digitales.
                                        Se asegura que cada funcionalidad sea intuitiva y útil.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-primary-600 relative">
                <SectionEditButton 
                    sectionName="Llamada a la Acción"
                    onEdit={() => handleSectionEdit('cta', 'Llamada a la Acción')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {aboutContent?.call_to_action?.title || '¿Quieres formar parte de nuestra misión?'}
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                        {aboutContent?.call_to_action?.description || 'Estamos siempre buscando personas talentosas y apasionadas que quieran ayudarnos a transformar la educación.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={aboutContent?.call_to_action?.primary_button_link || "/contacto"}
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                        >
                            {aboutContent?.call_to_action?.primary_button_text || 'Únete al Equipo'}
                        </a>
                        <a
                            href={aboutContent?.call_to_action?.secondary_button_link || "/contacto"}
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                        >
                            {aboutContent?.call_to_action?.secondary_button_text || 'Contáctanos'}
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
