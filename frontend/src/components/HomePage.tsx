'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { ArrowRight, BookOpen, CheckCircle, Shield, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InlineEditButton from './InlineEditButton'
import SectionEditButton from './SectionEditButton'
import SectionEditModal from './SectionEditModal'

// Definir interfaces para el contenido de la página de inicio
interface HomepageContent {
    hero_title?: string
    hero_subtitle?: string
    hero_description?: string
    hero_button_text?: string
    hero_button_link?: string
    hero_image?: string
    hero_video?: string
    features?: Array<{
        title: string
        description: string
        icon?: string
        image?: string
        is_active?: boolean
    }>
    testimonials?: Array<{
        name: string
        position: string
        company: string
        content: string
        image?: string
        rating?: number
        is_featured?: boolean
    }>
    stats?: {
        clients?: number
        projects?: number
        experience?: number
        satisfaction?: number
    }
    call_to_action?: {
        title: string
        description: string
        button_text: string
        button_link: string
    }
}

export default function HomePage() {
    const [content, setContent] = useState<HomepageContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<'hero' | 'features' | 'cta' | null>(null)
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        try {
            console.log('Attempting to load homepage content from:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002')
            const response = await publicApi.getPageContent('homepage')
            console.log('Homepage content loaded successfully:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data) // Guardar la respuesta completa para edición
        } catch (error: any) {
            console.error('Error loading homepage content:', error)
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status
            })
            // Set default content
            setContent({
                hero_title: 'Sistema Educativo Virtual Profesional',
                hero_subtitle: 'Transformamos la educación con tecnología',
                hero_description: 'La plataforma educativa más completa para transformar tu institución educativa',
                features: [],
                testimonials: [],
                stats: {}
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
                </div>
            </PublicLayout>
        )
    }

    const handleContentUpdate = () => {
        // Recargar contenido después de editar
        loadContent()
    }

    const handleSectionEdit = (section: 'hero' | 'features' | 'cta') => {
        setEditingSection(section)
    }

    const handleSectionSave = async () => {
        // Recargar contenido después de guardar
        await loadContent()
        setEditingSection(null)
    }

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white relative">
                <SectionEditButton 
                    sectionName="Sección Hero"
                    onEdit={() => handleSectionEdit('hero')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                                {content?.hero_title || 'Sistema Educativo Virtual Profesional'}
                            </h1>
                            <p className="text-xl md:text-2xl mb-4 text-primary-100">
                                {content?.hero_subtitle || 'Transformamos la educación con tecnología'}
                            </p>
                            <p className="text-lg mb-8 text-primary-200">
                                {content?.hero_description || 'La plataforma educativa más completa para transformar tu institución educativa'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={content?.hero_button_link || "/precios"}
                                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                                >
                                    {content?.hero_button_text || 'Ver Planes'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    href="/contacto"
                                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                                >
                                    Solicitar Demo
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            {content?.hero_image ? (
                                <img
                                    src={content.hero_image}
                                    alt="SEVP Platform"
                                    className="rounded-lg shadow-2xl"
                                />
                            ) : content?.hero_video ? (
                                <video
                                    src={content.hero_video}
                                    className="rounded-lg shadow-2xl w-full h-96 object-cover"
                                    autoPlay
                                    muted
                                    loop
                                />
                            ) : (
                                <div className="bg-white/10 rounded-lg h-96 flex items-center justify-center">
                                    <BookOpen className="h-32 w-32 text-white/50" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Características"
                    onEdit={() => handleSectionEdit('features')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.features_title || '¿Por qué elegir SEVP?'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {content?.features_description || 'Una plataforma completa diseñada específicamente para las necesidades de instituciones educativas modernas'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content?.features?.map((feature, index) => {
                            // Mapear iconos
                            const getIcon = (iconName: string) => {
                                switch (iconName) {
                                    case 'Users': return Users
                                    case 'BookOpen': return BookOpen
                                    case 'Shield': return Shield
                                    case 'Zap': return Zap
                                    case 'CheckCircle': return CheckCircle
                                    case 'Star': return Star
                                    default: return Users
                                }
                            }
                            
                            const IconComponent = getIcon(feature.icon || 'Users')
                            
                            return (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <IconComponent className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            )
                        }) || (
                            <>
                                {/* Contenido fallback si no hay features en DB */}
                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <Users className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Gestión de Estudiantes
                                    </h3>
                                    <p className="text-gray-600">
                                        Administra perfiles, matrículas, asistencia y comunicación con estudiantes de manera centralizada.
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <BookOpen className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Cursos y Contenido
                                    </h3>
                                    <p className="text-gray-600">
                                        Crea, organiza y gestiona cursos con contenido multimedia, tareas y evaluaciones integradas.
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <Shield className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Seguridad Avanzada
                                    </h3>
                                    <p className="text-gray-600">
                                        Protección de datos con encriptación, copias de seguridad automáticas y control de acceso granular.
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <Zap className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Integración Fácil
                                    </h3>
                                    <p className="text-gray-600">
                                        API robusta para integrarse con sistemas existentes y herramientas de terceros.
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <CheckCircle className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Reportes Avanzados
                                    </h3>
                                    <p className="text-gray-600">
                                        Analíticas detalladas y reportes personalizables para tomar decisiones informadas.
                                    </p>
                                </div>

                                <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                        <Star className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Soporte 24/7
                                    </h3>
                                    <p className="text-gray-600">
                                        Equipo de soporte técnico disponible las 24 horas para resolver cualquier incidencia.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            {content?.featured_testimonials && content.featured_testimonials.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Lo que dicen nuestros clientes
                            </h2>
                            <p className="text-xl text-gray-600">
                                Instituciones educativas que han transformado su gestión con SEVP
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {content.featured_testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="bg-gray-50 p-8 rounded-xl">
                                    <div className="flex items-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 mb-6 italic">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center">
                                        {testimonial.client_photo && (
                                            <img
                                                src={testimonial.client_photo}
                                                alt={testimonial.client_name}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {testimonial.client_name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {testimonial.client_position}, {testimonial.client_company}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-24 bg-primary-600 relative">
                <SectionEditButton 
                    sectionName="Llamada a la Acción"
                    onEdit={() => handleSectionEdit('cta')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        {content?.call_to_action?.title || '¿Listo para transformar tu institución educativa?'}
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                        {content?.call_to_action?.description || 'Únete a las instituciones que ya están revolucionando la educación con SEVP. Solicita una demo gratuita y descubre todo lo que podemos hacer por ti.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={content?.call_to_action?.button_link || "/contacto"}
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                        >
                            {content?.call_to_action?.button_text || 'Solicitar Demo Gratuita'}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            href="/precios"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center"
                        >
                            Ver Precios
                        </Link>
                    </div>
                </div>
            </section>

            {/* Botón de edición inline general */}
            <InlineEditButton 
                pageKey="homepage" 
                onContentUpdate={handleContentUpdate}
                tooltip="Editar página completa (Ctrl+E)"
            />

            {/* Modal de edición por sección */}
            {editingSection && fullPageContent && (
                <SectionEditModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    sectionType={editingSection}
                    pageKey="homepage"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                />
            )}
        </PublicLayout>
    )
}
