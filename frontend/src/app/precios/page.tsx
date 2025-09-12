'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { ServicePlan } from '@/types'
import { ArrowRight, Check, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import InlineEditButton from '@/components/InlineEditButton'

// Definir tipos para el contenido de Precios
interface PricingContent {
    hero?: {
        title?: string
        subtitle?: string
        description?: string
    }
    faqs?: {
        question: string
        answer: string
    }[]
}

export default function PreciosPage() {
    const [plans, setPlans] = useState<ServicePlan[]>([])
    const [content, setContent] = useState<PricingContent | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isYearly, setIsYearly] = useState(false)

    useEffect(() => {
        loadPlans()
        loadContent()
    }, [])

    const loadPlans = async () => {
        try {
            const response = await publicApi.getServicePlans()
            setPlans(response.data)
        } catch (error) {
            console.error('Error loading plans:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const loadContent = async () => {
        try {
            const response = await publicApi.getPageContent('pricing')
            console.log('Pricing content loaded:', response.data)
            setContent(response.data.content_json)
        } catch (error) {
            console.error('Error loading pricing content:', error)
            // Usar contenido fallback
            setContent({
                hero: {
                    title: 'Planes y Precios',
                    description: 'Elige el plan perfecto para tu institución educativa'
                },
                faqs: []
            })
        }
    }

    const formatPrice = (plan: ServicePlan) => {
        if (isYearly && plan.price_yearly) {
            return {
                price: (plan.price_yearly / 12).toFixed(0),
                period: '/mes',
                savings: `Ahorras $${plan.monthly_savings.toFixed(0)}/mes`
            }
        }
        return {
            price: plan.price_monthly.toString(),
            period: '/mes',
            savings: null
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

    return (
        <PublicLayout>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            {content?.hero?.title || 'Planes y Precios'}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            {content?.hero?.description || 'Elige el plan perfecto para tu institución educativa'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Toggle */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-md">
                            <button
                                onClick={() => setIsYearly(false)}
                                className={`px-6 py-3 rounded-md font-medium transition-colors ${!isYearly
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Mensual
                            </button>
                            <button
                                onClick={() => setIsYearly(true)}
                                className={`px-6 py-3 rounded-md font-medium transition-colors ${isYearly
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Anual
                                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                    Ahorra hasta 20%
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {plans.map((plan) => {
                            const pricing = formatPrice(plan)
                            return (
                                <div
                                    key={plan.id}
                                    className={`bg-white rounded-2xl shadow-lg overflow-hidden ${plan.is_popular
                                        ? 'ring-2 ring-primary-500 relative'
                                        : ''
                                        }`}
                                >
                                    {plan.is_popular && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                                                <Star className="h-4 w-4 mr-1" />
                                                Más Popular
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-8">
                                        {/* Plan Header */}
                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {plan.name}
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                {plan.description}
                                            </p>

                                            <div className="mb-4">
                                                <span className="text-4xl font-bold text-gray-900">
                                                    ${pricing.price}
                                                </span>
                                                <span className="text-gray-600">
                                                    {pricing.period}
                                                </span>
                                                {pricing.savings && (
                                                    <div className="text-sm text-green-600 font-medium mt-1">
                                                        {pricing.savings}
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.is_popular
                                                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                                    }`}
                                            >
                                                Comenzar Ahora
                                                <ArrowRight className="inline-block ml-2 h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Plan Features */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Usuarios</span>
                                                <span className="font-semibold text-gray-900">
                                                    {plan.max_users.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Cursos</span>
                                                <span className="font-semibold text-gray-900">
                                                    {plan.max_courses.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Almacenamiento</span>
                                                <span className="font-semibold text-gray-900">
                                                    {plan.storage_gb} GB
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">API Requests</span>
                                                <span className="font-semibold text-gray-900">
                                                    {plan.api_requests_limit.toLocaleString()}/mes
                                                </span>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4 mt-6">
                                                <p className="text-sm font-medium text-gray-900 mb-3">
                                                    Características incluidas:
                                                </p>
                                                <ul className="space-y-2">
                                                    {plan.features.map((feature, index) => (
                                                        <li key={index} className="flex items-start text-sm">
                                                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                                            <span className="text-gray-600">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Enterprise CTA */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            ¿Necesitas algo más personalizado?
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                            Para instituciones con necesidades específicas, ofrecemos planes empresariales
                            con características y soporte personalizado.
                        </p>
                        <a
                            href="/contacto"
                            className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                        >
                            Contactar Ventas
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Respuestas a las dudas más comunes sobre nuestros planes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {content?.faqs?.map((faq, index) => (
                            <div key={index}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">
                                    {faq.answer}
                                </p>
                            </div>
                        )) || (
                            <>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        ¿Puedo cambiar de plan en cualquier momento?
                                    </h3>
                                    <p className="text-gray-600">
                                        Sí, puedes actualizar o cambiar tu plan en cualquier momento desde
                                        el panel de administración. Los cambios se aplicarán inmediatamente.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        ¿Ofrecen descuentos para instituciones sin fines de lucro?
                                    </h3>
                                    <p className="text-gray-600">
                                        Sí, ofrecemos descuentos especiales para instituciones educativas
                                        sin fines de lucro. Contacta a nuestro equipo de ventas para más información.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        ¿Qué incluye el soporte técnico?
                                    </h3>
                                    <p className="text-gray-600">
                                        Todos los planes incluyen soporte por email. Los planes Premium y
                                        Enterprise incluyen soporte telefónico y chat en vivo.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        ¿Hay período de prueba gratuito?
                                    </h3>
                                    <p className="text-gray-600">
                                        Sí, ofrecemos 14 días de prueba gratuita para que puedas explorar
                                        todas las funcionalidades antes de comprometerte.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Botón de edición inline */}
            <InlineEditButton 
                pageKey="pricing" 
                onContentUpdate={loadContent}
                tooltip="Editar página de precios (Ctrl+E)"
            />
        </PublicLayout>
    )
}
