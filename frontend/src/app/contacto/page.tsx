'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { Clock, Mail, MapPin, Phone, Building, Wifi, Calendar, MessageSquare, Smartphone, Send, MessageCircle, Video, Headphones, Users, Globe2, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import InlineEditButton from '@/components/InlineEditButton'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'

// Definir tipos para el contenido de Contacto
interface ContactContent {
    hero?: {
        title?: string
        description?: string
    }
    contact_info?: {
        email?: string
        phone?: string
        address?: string
        hours?: string
        email_description?: string
        phone_description?: string
        address_description?: string
        hours_description?: string
    }
    faqs?: {
        question: string
        answer: string
    }[]
}

export default function ContactoPage() {
    const [content, setContent] = useState<ContactContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        try {
            const response = await publicApi.getPageContent('contact')
            console.log('Contact content loaded:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('Error loading contact content:', error)
            // Usar contenido fallback
            setContent({
                hero: {
                    title: 'Contáctanos',
                    description: '¿Listo para transformar tu institución educativa? Estamos aquí para ayudarte a dar el siguiente paso'
                },
                contact_info: {
                    email: 'contacto@sevp.com',
                    phone: '+51 1 234-5678',
                    address: 'Lima, Perú',
                    hours: '9:00 AM - 6:00 PM'
                },
                faqs: []
            })
        } finally {
            setIsLoading(false)
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Enviar al backend
            const response = await fetch('http://localhost:8002/api/public/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Error al enviar mensaje')
            }
            
            setSubmitStatus('success')
            setFormData({
                name: '',
                email: '',
                phone: '',
                company: '',
                subject: '',
                message: ''
            })
        } catch (error) {
            setSubmitStatus('error')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Mapeo de iconos desde el nombre a componente
    const getIconComponent = (iconName: string) => {
        const iconMap: { [key: string]: any } = {
            'Mail': Mail,
            'Phone': Phone,
            'Smartphone': Smartphone,
            'MessageCircle': MessageCircle,
            'Send': Send,
            'MapPin': MapPin,
            'Building': Building,
            'Clock': Clock,
            'Calendar': Calendar,
            'Video': Video,
            'MessageSquare': MessageSquare,
            'Headphones': Headphones,
            'Users': Users,
            'Wifi': Wifi,
            'Globe2': Globe2,
            'ExternalLink': ExternalLink
        }
        return iconMap[iconName] || Mail
    }

    const contactInfo = content?.contact_items || [
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
        },
        {
            id: 'whatsapp',
            icon: 'Smartphone',
            title: 'WhatsApp',
            value: '+51 999 888 777',
            description: 'Respuesta inmediata'
        },
        {
            id: 'address',
            icon: 'MapPin',
            title: 'Oficina',
            value: 'Lima, Perú',
            description: 'San Isidro, Lima 27'
        }
    ]

    if (isLoading) {
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
                            {content?.hero_title || 'Contáctanos'}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            {content?.hero_description || '¿Listo para transformar tu institución educativa? Estamos aquí para ayudarte a dar el siguiente paso'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-16 bg-white relative">
                <SectionEditButton 
                    sectionName="Información de Contacto"
                    onEdit={() => handleSectionEdit('contact_info', 'Información de Contacto')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info) => {
                            const IconComponent = getIconComponent(info.icon)
                            return (
                                <div key={info.id || info.title} className="text-center">
                                    <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <IconComponent className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                                    <p className="text-primary-600 font-medium mb-1">{info.value}</p>
                                    <p className="text-sm text-gray-600">{info.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Formulario de Contacto"
                    onEdit={() => handleSectionEdit('form', 'Formulario de Contacto')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.form_title || 'Envíanos un Mensaje'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {content?.form_description || 'Completa el formulario y nuestro equipo se pondrá en contacto contigo en las próximas 24 horas'}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8">
                        {submitStatus === 'success' && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                Hubo un error al enviar el mensaje. Por favor, inténtalo nuevamente.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre Completo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="+51 999 999 999"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Institución/Empresa
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="Nombre de tu institución"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Asunto *
                                </label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Selecciona un asunto</option>
                                    <option value="demo">Solicitar Demo</option>
                                    <option value="pricing">Información de Precios</option>
                                    <option value="support">Soporte Técnico</option>
                                    <option value="partnership">Alianzas Estratégicas</option>
                                    <option value="other">Otro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mensaje *
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Cuéntanos cómo podemos ayudarte..."
                                />
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                                >
                                    {isSubmitting ? 'Enviando...' : (content?.form_button_text || 'Enviar Mensaje')}
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
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-xl text-gray-600">
                            Respuestas rápidas a las consultas más comunes
                        </p>
                    </div>

                    <div className="space-y-8">
                        {content?.faqs?.map((faq, index) => (
                            <div key={index} className={`border-b border-gray-200 pb-6 ${index === content.faqs!.length - 1 ? 'border-b-0' : ''}`}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">
                                    {faq.answer}
                                </p>
                            </div>
                        )) || (
                            <>
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        ¿Cuánto tiempo toma implementar SEVP?
                                    </h3>
                                    <p className="text-gray-600">
                                        La implementación básica puede completarse en 2-4 semanas, incluyendo migración de datos, 
                                        capacitación del equipo y configuración personalizada.
                                    </p>
                                </div>
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        ¿Ofrecen soporte técnico en español?
                                    </h3>
                                    <p className="text-gray-600">
                                        Sí, nuestro equipo de soporte habla español y está disponible 24/7 para ayudarte 
                                        con cualquier consulta técnica o administrativa.
                                    </p>
                                </div>
                                <div className="border-b border-gray-200 pb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        ¿Puedo migrar desde otra plataforma?
                                    </h3>
                                    <p className="text-gray-600">
                                        Absolutamente. Tenemos experiencia migrando desde todas las plataformas principales 
                                        y nuestro equipo se encarga de todo el proceso sin pérdida de datos.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        ¿Hay contratos de permanencia mínima?
                                    </h3>
                                    <p className="text-gray-600">
                                        No requerimos contratos de permanencia mínima. Puedes cancelar tu suscripción 
                                        en cualquier momento con 30 días de anticipación.
                                    </p>
                                </div>
                            </>
                        )}
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
                    pageKey="contact"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                />
            )}
        </PublicLayout>
    )
}
