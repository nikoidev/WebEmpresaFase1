'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { Clock, MapPin, Trophy, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import InlineEditButton from '@/components/InlineEditButton'

// Definir tipos para el contenido de Historia
interface Milestone {
    year: string
    title: string
    description: string
    icon: string
    color: string
}

interface ImpactNumber {
    number: string
    label: string
    description?: string
}

interface HistoryContent {
    hero?: {
        title?: string
        subtitle?: string
        description?: string
    }
    timeline?: Milestone[]
    stats?: ImpactNumber[]
}

export default function HistoriaPage() {
    const [content, setContent] = useState<HistoryContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        try {
            const response = await publicApi.getPageContent('history')
            console.log('Historia content loaded:', response.data)
            setContent(response.data.content_json)
        } catch (error) {
            console.error('Error loading historia content:', error)
            // Fallback content
            setContent({
                hero_title: 'Nuestra Historia',
                hero_description: 'Un viaje de innovación, crecimiento y transformación educativa que comenzó con un sueño',
                milestones: []
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Iconos por defecto
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Users': return Users
            case 'Trophy': return Trophy
            case 'MapPin': return MapPin
            case 'Clock': return Clock
            default: return Users
        }
    }

    // Fallback data si no hay contenido
    const defaultMilestones = [
        {
            year: '2018',
            title: 'Los Inicios',
            description: 'SEVP nace como una idea para democratizar el acceso a herramientas educativas de calidad.',
            icon: 'Users',
            color: 'bg-blue-500'
        },
        {
            year: '2019',
            title: 'Primera Plataforma',
            description: 'Lanzamos nuestra primera versión beta con funcionalidades básicas de gestión educativa.',
            icon: 'Trophy',
            color: 'bg-green-500'
        },
        {
            year: '2020',
            title: 'Expansión Digital',
            description: 'La pandemia acelera nuestra misión. Ayudamos a 500+ instituciones a digitalizar su educación.',
            icon: 'MapPin',
            color: 'bg-purple-500'
        },
        {
            year: '2021',
            title: 'Reconocimientos',
            description: 'Recibimos el premio "Innovación Educativa" y alcanzamos 10,000 usuarios activos.',
            icon: 'Trophy',
            color: 'bg-yellow-500'
        },
        {
            year: '2022',
            title: 'Crecimiento Internacional',
            description: 'Expandimos operaciones a 5 países de América Latina con nuevas funcionalidades.',
            icon: 'MapPin',
            color: 'bg-red-500'
        },
        {
            year: '2023',
            title: 'Líderes del Sector',
            description: 'Nos consolidamos como la plataforma educativa #1 en innovación y satisfacción del cliente.',
            icon: 'Trophy',
            color: 'bg-indigo-500'
        }
    ]

    const milestones = content?.timeline || defaultMilestones

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
                            {content?.hero?.title || 'Nuestra Historia'}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            {content?.hero?.description || 'Un viaje de innovación, crecimiento y transformación educativa que comenzó con un sueño'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Intro */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Clock className="h-10 w-10 text-primary-600" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Todo Comenzó con una Visión
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        {content?.hero?.subtitle || 'En 2018, un grupo de educadores y tecnólogos se unió con una misión clara: hacer que la tecnología educativa de alta calidad fuera accesible para todas las instituciones, sin importar su tamaño o presupuesto.'}
                    </p>
                    <p className="text-lg text-gray-600">
                        Lo que comenzó como un proyecto de fin de semana se ha convertido en la plataforma educativa más innovadora de América Latina, transformando la forma en que millones de estudiantes aprenden cada día.
                    </p>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Hitos Importantes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Los momentos que definieron nuestro camino hacia la excelencia educativa
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
                        
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => {
                                const IconComponent = getIcon(milestone.icon)
                                return (
                                    <div key={milestone.year} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                        {/* Timeline dot */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                                        
                                        {/* Content */}
                                        <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${milestone.color}`}>
                                                    <IconComponent className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="text-2xl font-bold text-primary-600 mb-2">
                                                    {milestone.year}
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                                    {milestone.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {milestone.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Numbers */}
            <section className="py-24 bg-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Nuestro Impacto en Números
                        </h2>
                        <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                            Los resultados de años de dedicación y trabajo arduo
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {content?.stats?.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold mb-2">{item.number}</div>
                                <div className="text-primary-100">{item.label}</div>
                            </div>
                        )) || (
                            <>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                                    <div className="text-primary-100">Estudiantes Activos</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2">1,500+</div>
                                    <div className="text-primary-100">Instituciones</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2">8</div>
                                    <div className="text-primary-100">Países</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
                                    <div className="text-primary-100">Uptime</div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Future Vision */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Mirando hacia el Futuro
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Estamos apenas comenzando. Nuestro objetivo para los próximos años es clara: democratizar el acceso a educación de calidad mundial para cada estudiante en América Latina y más allá.
                    </p>
                    <p className="text-lg text-gray-600 mb-8">
                        Con nuevas tecnologías como IA, realidad virtual y análisis predictivo, estamos construyendo el futuro de la educación, un estudiante a la vez.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/nosotros"
                            className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                        >
                            Conoce al Equipo
                        </a>
                        <a
                            href="/contacto"
                            className="border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors inline-flex items-center justify-center"
                        >
                            Únete a Nosotros
                        </a>
                    </div>
                </div>
            </section>

            {/* Botón de edición inline */}
            <InlineEditButton 
                pageKey="history" 
                onContentUpdate={loadContent}
                tooltip="Editar página de historia (Ctrl+E)"
            />
        </PublicLayout>
    )
}
