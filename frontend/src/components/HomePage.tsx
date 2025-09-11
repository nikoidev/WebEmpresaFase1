'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { HomepageContent } from '@/types'
import { ArrowRight, BookOpen, CheckCircle, Shield, Star, Users, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function HomePage() {
    const [content, setContent] = useState<HomepageContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadContent()
    }, [])

    const loadContent = async () => {
        try {
            console.log('Attempting to load homepage content from:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002')
            const response = await publicApi.getHomepageContent()
            console.log('Homepage content loaded successfully:', response.data)
            setContent(response.data)
        } catch (error: any) {
            console.error('Error loading homepage content:', error)
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status
            })
            // Set empty content to avoid infinite loading
            setContent({
                featured_articles: [],
                featured_testimonials: [],
                company_info: null
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

    const companyInfo = content?.company_info

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                                {companyInfo?.tagline || 'Sistema Educativo Virtual Profesional'}
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-primary-100">
                                La plataforma educativa más completa para transformar tu institución educativa
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/precios"
                                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                                >
                                    Ver Planes
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
                            {companyInfo?.hero_image ? (
                                <img
                                    src={companyInfo.hero_image}
                                    alt="SEVP Platform"
                                    className="rounded-lg shadow-2xl"
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
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            ¿Por qué elegir SEVP?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Una plataforma completa diseñada específicamente para las necesidades de instituciones educativas modernas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <section className="py-24 bg-primary-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        ¿Listo para transformar tu institución educativa?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                        Únete a las instituciones que ya están revolucionando la educación con SEVP.
                        Solicita una demo gratuita y descubre todo lo que podemos hacer por ti.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contacto"
                            className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                        >
                            Solicitar Demo Gratuita
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
        </PublicLayout>
    )
}
