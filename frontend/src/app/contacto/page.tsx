'use client'

import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react'
import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'
import PublicLayout from '@/components/layout/PublicLayout'

export default function ContactoPage() {
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    const loadContent = async () => {
        try {
            console.log('🔄 Cargando contenido de /contacto...')
            const response = await publicApi.getPageContent('contact')
            console.log('✅ Contenido cargado:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('❌ Error loading contact content:', error)
            // Usar contenido por defecto si falla
            setContent({
                hero: {
                    title: 'Contáctanos',
                    subtitle: 'Estamos aquí para ayudarte'
                },
                contact_items: [
                    {
                        id: 'email',
                        icon: 'Mail',
                        title: 'Email',
                        value: 'contacto@sevp.com',
                        description: 'Respuesta en 24 horas'
                    },
                    {
                        id: 'phone',
                        icon: 'Phone',
                        title: 'Teléfono',
                        value: '+51 1 234-5678',
                        description: 'Lun - Vie, 9am - 6pm'
                    }
                ]
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

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Mail': return Mail
            case 'Phone': return Phone
            case 'MapPin': return MapPin
            case 'Clock': return Clock
            case 'MessageSquare': return MessageSquare
            default: return Mail
        }
    }

    return (
        <PublicLayout>
            <DevFileInfo filePath="frontend/src/app/contacto/page.tsx" />
            
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
                            {content?.hero?.title || 'Contáctanos'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            {content?.hero?.subtitle || 'Estamos aquí para ayudarte'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Información de Contacto"
                    onEdit={() => handleSectionEdit('contact_info', 'Información de Contacto')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Ponte en Contacto
                        </h2>
                        <p className="text-xl text-gray-600">
                            Elige la forma que más te convenga para comunicarte con nosotros
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {content?.contact_items?.map((item: any, index: number) => {
                            const IconComponent = getIcon(item.icon)
                            return (
                                <div key={item.id || index} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                                        <IconComponent className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg text-primary-600 font-medium mb-2">
                                        {item.value}
                                    </p>
                                    <p className="text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Formulario de Contacto"
                    onEdit={() => handleSectionEdit('form', 'Formulario de Contacto')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Envíanos un Mensaje
                        </h2>
                        <p className="text-xl text-gray-600">
                            Completa el formulario y nos pondremos en contacto contigo
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Institución
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Nombre de tu institución educativa"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje *
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Cuéntanos cómo podemos ayudarte..."
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                                >
                                    <MessageSquare className="mr-2 h-5 w-5" />
                                    Enviar Mensaje
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white relative">
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
                            Respuestas a las consultas más comunes
                        </p>
                    </div>

                    {content?.faq?.length > 0 ? (
                        <div className="space-y-6">
                            {content.faq.map((item: any, index: number) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-lg">
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
                    pageKey="contact"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                />
            )}
        </PublicLayout>
    )
}
