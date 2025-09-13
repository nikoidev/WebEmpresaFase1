'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { Building, GraduationCap, School, Users, BookOpen, Award, Globe, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import InlineEditButton from '@/components/InlineEditButton'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'

// Definir tipos para el contenido de Clientes
interface ClientType {
    name: string
    logo: string
    country: string
    students: string
    since: string
}

interface Testimonial {
    quote: string
    author: string
    position: string
    institution: string
    country: string
    logo: string
    rating: number
}

interface SuccessMetric {
    number: string
    label: string
    icon?: string
}

interface ClientsContent {
    hero?: {
        title?: string
        subtitle?: string
        description?: string
    }
    testimonials?: Testimonial[]
    clients?: ClientType[]
    stats?: SuccessMetric[]
}

export default function ClientesPage() {
    const [content, setContent] = useState<ClientsContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        try {
            const response = await publicApi.getPageContent('clients')
            console.log('Clientes content loaded:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('Error loading clientes content:', error)
            // Fallback content
            setContent({
                hero_title: 'Nuestros Clientes',
                hero_description: 'Más de 1,500 instituciones educativas confían en SEVP para transformar su educación digital',
                client_types: []
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

    // Iconos por defecto
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'GraduationCap': return GraduationCap
            case 'School': return School
            case 'Building': return Building
            case 'Users': return Users
            case 'BookOpen': return BookOpen
            case 'Award': return Award
            case 'Globe': return Globe
            case 'Heart': return Heart
            default: return Users
        }
    }

    // Fallback data
    const defaultClientTypes = [
        {
            title: 'Universidades',
            description: 'Instituciones de educación superior que han digitalizado completamente sus procesos académicos.',
            icon: 'GraduationCap',
            count: '250+',
            color: 'bg-blue-500',
            examples: ['Universidad Nacional', 'Instituto Tecnológico', 'Universidad Privada del Norte']
        },
        {
            title: 'Colegios',
            description: 'Centros educativos de primaria y secundaria que ofrecen experiencias de aprendizaje innovadoras.',
            icon: 'School',
            count: '800+',
            color: 'bg-green-500',
            examples: ['Colegio San Patricio', 'Instituto María Auxiliadora', 'Colegio Internacional']
        },
        {
            title: 'Centros de Capacitación',
            description: 'Institutos especializados en formación profesional y capacitación empresarial.',
            icon: 'Building',
            count: '300+',
            color: 'bg-purple-500',
            examples: ['Centro TECSUP', 'Instituto CIBERTEC', 'Academia de Liderazgo']
        },
        {
            title: 'Organizaciones',
            description: 'Empresas y ONGs que utilizan nuestra plataforma para capacitación interna.',
            icon: 'Users',
            count: '150+',
            color: 'bg-orange-500',
            examples: ['Fundación Educativa', 'Corporativo Global', 'ONG Desarrollo Social']
        }
    ]

    const defaultTestimonials = [
        {
            quote: "SEVP transformó completamente la forma en que nuestros estudiantes aprenden. La plataforma es intuitiva y poderosa.",
            author: "Dr. María González",
            position: "Rectora",
            institution: "Universidad Tecnológica del Perú",
            avatar: "MG"
        },
        {
            quote: "Implementamos SEVP en pleno 2020 y fue la mejor decisión. Nunca perdimos conectividad con nuestros estudiantes.",
            author: "Prof. Carlos Mendoza", 
            position: "Director Académico",
            institution: "Colegio San Agustín",
            avatar: "CM"
        },
        {
            quote: "La capacitación de nuestro personal se optimizó 300% gracias a las herramientas de SEVP. Excelente ROI.",
            author: "Ana Ruiz",
            position: "Gerente de RRHH",
            institution: "Corporación Empresarial",
            avatar: "AR"
        }
    ]

    const defaultSuccessMetrics = [
        { metric: '98%', label: 'Satisfacción del Cliente' },
        { metric: '45%', label: 'Reducción en Costos Operativos' },
        { metric: '300%', label: 'Aumento en Engagement' },
        { metric: '24/7', label: 'Soporte Técnico' }
    ]

    // Intentar diferentes campos donde pueden estar los datos de tipos de clientes
    const clientTypes = content?.clients || content?.client_types || content?.clientTypes || defaultClientTypes
    const testimonials = content?.testimonials || defaultTestimonials
    const successMetrics = content?.stats || defaultSuccessMetrics


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
            <DevFileInfo filePath="frontend/src/app/clientes/page.tsx" />
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
                            {content?.hero_title || 'Nuestros Clientes'}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            {content?.hero_description || 'Más de 1,500 instituciones educativas confían en SEVP para transformar su educación digital'}
                        </p>
                        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {content?.stats?.slice(0, 4).map((stat, index) => (
                                <div key={index}>
                                    <div className="text-3xl md:text-4xl font-bold">{stat.number}</div>
                                    <div className="text-primary-100">{stat.label}</div>
                                </div>
                            )) || (
                                <>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold">500+</div>
                                        <div className="text-primary-100">Instituciones</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold">100K+</div>
                                        <div className="text-primary-100">Estudiantes</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold">15</div>
                                        <div className="text-primary-100">Países</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold">99.9%</div>
                                        <div className="text-primary-100">Satisfacción</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Client Types */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Tipos de Clientes"
                    onEdit={() => handleSectionEdit('client_types', 'Tipos de Clientes')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.client_types_title || 'Nuestros Clientes'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {content?.client_types_description || 'Instituciones que confían en SEVP para transformar la educación'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(clientTypes && clientTypes.length > 0 ? clientTypes : defaultClientTypes).map((clientType, index) => {
                            // Manejar diferentes estructuras de datos
                            const title = clientType.title || clientType.name || `Tipo ${index + 1}`
                            const description = clientType.description || clientType.desc || ''
                            const icon = clientType.icon || 'Users'
                            const count = clientType.count || clientType.students || '0+'
                            const color = clientType.color || 'bg-blue-500'
                            const examples = clientType.examples || []
                            
                            const IconComponent = getIcon(icon)
                            return (
                                <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border">
                                    <div className={`${color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                                        <IconComponent className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                                        <div className="text-2xl font-bold text-primary-600 mb-3">{count}</div>
                                        <p className="text-gray-600 text-sm mb-4">{description}</p>
                                        {examples && examples.length > 0 && (
                                            <div className="text-xs text-gray-500">
                                                <div className="font-semibold mb-1">Ejemplos:</div>
                                                <div className="space-y-1">
                                                    {examples.slice(0, 3).map((example, idx) => (
                                                        <div key={idx}>{example}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Testimonios"
                    onEdit={() => handleSectionEdit('testimonials', 'Testimonios')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.testimonials_title || 'Lo que Dicen Nuestros Clientes'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {content?.testimonials_description || 'Testimonios reales de líderes educativos que han transformado sus instituciones con SEVP'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.author} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                                <div className="text-gray-600 mb-6 text-lg leading-relaxed">
                                    "{testimonial.quote}"
                                </div>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">{testimonial.avatar}</span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.author}</div>
                                        <div className="text-sm text-gray-600">{testimonial.position}</div>
                                        <div className="text-sm text-primary-600 font-medium">{testimonial.institution}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-24 bg-primary-600 text-white relative">
                <SectionEditButton 
                    sectionName="Métricas de Éxito"
                    onEdit={() => handleSectionEdit('metrics', 'Métricas de Éxito')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {content?.metrics_title || 'Resultados Comprobados'}
                        </h2>
                        <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                            {content?.metrics_description || 'Los números que demuestran el impacto real de SEVP en nuestros clientes'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {successMetrics.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold mb-2">{item.number}</div>
                                <div className="text-primary-100">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Llamada a la Acción"
                    onEdit={() => handleSectionEdit('cta', 'Llamada a la Acción')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        ¿Listo para Unirte a Nuestros Clientes Exitosos?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Únete a más de 1,500 instituciones que ya están transformando la educación con SEVP. Comenzar es fácil y nuestro equipo te acompañará en cada paso.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contacto"
                            className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                        >
                            Solicitar Demo Gratuita
                        </a>
                        <a
                            href="/precios"
                            className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors inline-flex items-center justify-center"
                        >
                            Ver Planes y Precios
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
