'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { Building, GraduationCap, School, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import InlineEditButton from '@/components/InlineEditButton'

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

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        try {
            const response = await publicApi.getPageContent('clients')
            console.log('Clientes content loaded:', response.data)
            setContent(response.data.content_json)
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

    // Iconos por defecto
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'GraduationCap': return GraduationCap
            case 'School': return School
            case 'Building': return Building
            case 'Users': return Users
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

    const clientTypes = content?.clients || defaultClientTypes
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
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {content?.hero?.title || 'Nuestros Clientes'}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            {content?.hero?.description || 'Más de 1,500 instituciones educativas confían en SEVP para transformar su educación digital'}
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
                                        <div className="text-3xl md:text-4xl font-bold">1,500+</div>
                                        <div className="text-primary-100">Instituciones</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold">50K+</div>
                                        <div className="text-primary-100">Estudiantes</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold">8</div>
                                        <div className="text-primary-100">Países</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl md:text-4xl font-bold">5</div>
                                        <div className="text-primary-100">Años</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Client Types */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Nuestros Clientes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {content?.hero?.subtitle || 'Instituciones que confían en SEVP para transformar la educación'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {clientTypes.map((client, index) => (
                            <div key={client.name} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow">
                                <div className="bg-blue-500 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                                    <Building className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{client.name}</h3>
                                    <span className="text-lg font-bold text-primary-600">{client.students}</span>
                                </div>
                                <p className="text-gray-600 mb-4">{client.country}</p>
                                <div className="text-sm text-gray-500">
                                    Cliente desde: {client.since}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Lo que Dicen Nuestros Clientes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Testimonios reales de líderes educativos que han transformado sus instituciones con SEVP
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
            <section className="py-24 bg-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Resultados Comprobados
                        </h2>
                        <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                            Los números que demuestran el impacto real de SEVP en nuestros clientes
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
            <section className="py-24 bg-white">
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

            {/* Botón de edición inline */}
            <InlineEditButton 
                pageKey="clients" 
                onContentUpdate={loadContent}
                tooltip="Editar página de clientes (Ctrl+E)"
            />
        </PublicLayout>
    )
}
