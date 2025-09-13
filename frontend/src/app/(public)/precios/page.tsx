'use client'

import PublicLayout from '@/components/layout/PublicLayout'
import { publicApi } from '@/lib/api'
import { ServicePlan } from '@/types'
import { ArrowRight, Check, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import InlineEditButton from '@/components/InlineEditButton'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'

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
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [isSaving, setIsSaving] = useState(false)
    const [fullPageContent, setFullPageContent] = useState<any>(null)

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
            setFullPageContent(response.data)
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

    const handleSectionEdit = (sectionType: string, sectionName: string) => {
        setEditingSection(sectionType)
        setEditingSectionName(sectionName)
    }

    const handleSectionSave = async () => {
        setIsSaving(true)
        try {
            // Recargar contenido y planes después de guardar
            await Promise.all([
                loadContent(),
                loadPlans()
            ])
            console.log('✅ Contenido actualizado después de guardar')
        } catch (error) {
            console.error('❌ Error al actualizar contenido:', error)
        } finally {
            setIsSaving(false)
            setEditingSection(null)
            setEditingSectionName('')
        }
    }

    const formatPrice = (plan: ServicePlan) => {
        if (isYearly && plan.price_yearly) {
            const monthlySavings = Number(plan.monthly_savings) || 0
            return {
                price: (plan.price_yearly / 12).toFixed(0),
                period: '/mes',
                savings: `Ahorras €${monthlySavings.toFixed(1)}/mes`
            }
        }
        return {
            price: Number(plan.price_monthly).toFixed(1),
            period: '/mes',
            savings: null
        }
    }

    const getGridClasses = (planCount: number) => {
        if (planCount === 0) return 'grid grid-cols-1'
        if (planCount === 1) return 'grid grid-cols-1 max-w-md mx-auto'
        if (planCount === 2) return 'grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
        if (planCount === 3) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        if (planCount === 4) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
        // Para 5 o más planes, usar un grid responsive que se adapte
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
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
            <DevFileInfo filePath="frontend/src/app/precios/page.tsx" />
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
                            {content?.hero_title || 'Planes y Precios'}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                            {content?.hero_description || 'Elige el plan perfecto para tu institución educativa'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Toggle */}
            <section className="py-16 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Planes y Precios"
                    onEdit={() => handleSectionEdit('pricing', 'Planes y Precios')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-md">
                            <button
                                onClick={() => setIsYearly(false)}
                                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${!isYearly
                                    ? 'bg-primary-600 text-white'
                                    : 'text-black hover:bg-primary-600 hover:text-white'
                                    }`}
                            >
                                <span className={`transition-colors duration-300 ${!isYearly ? 'text-white' : 'text-black'}`}>
                                    {content?.pricing_monthly_label || 'Mensual'}
                                </span>
                            </button>
                            <button
                                onClick={() => setIsYearly(true)}
                                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${isYearly
                                    ? 'bg-primary-600 text-white'
                                    : 'text-black hover:bg-primary-600 hover:text-white'
                                    }`}
                            >
                                <span className={`transition-colors duration-300 ${isYearly ? 'text-white' : 'text-black'}`}>
                                    {content?.pricing_yearly_label || 'Anual'}
                                </span>
                                <span className={`ml-2 text-xs px-2 py-1 rounded-full transition-all duration-300 ${isYearly
                                    ? 'bg-white/20 text-white'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    Ahorra hasta 20%
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    {plans.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                                <div className="text-gray-400 mb-4">
                                    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay planes disponibles</h3>
                                <p className="text-gray-600">Los planes de servicio se están configurando. Vuelve pronto.</p>
                            </div>
                        </div>
                    ) : (
                        <div className={`${getGridClasses(plans.length)} gap-8`}>
                            {plans.map((plan) => {
                            const pricing = formatPrice(plan)
                            return (
                                <div
                                    key={plan.id}
                                    className={`bg-white rounded-2xl shadow-lg overflow-hidden relative ${plan.is_popular
                                        ? 'ring-2 ring-primary-500'
                                        : ''
                                        }`}
                                >
                                    {plan.is_popular && (
                                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
                                            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                                                <Star className="h-4 w-4 mr-1 fill-current" />
                                                Más Popular
                                            </div>
                                        </div>
                                    )}

                                    <div className={`p-8 ${plan.is_popular ? 'pt-12' : ''}`}>
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
                                                    €{pricing.price}
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
                    )}

                    {/* Enterprise CTA - Integrated Design */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center relative">
                        <SectionEditButton 
                            sectionName="Sección Empresarial"
                            onEdit={() => handleSectionEdit('enterprise', 'Sección Empresarial')}
                            position="top-right"
                        />
                        
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6 shadow-lg">
                                <Star className="h-8 w-8 text-white" />
                            </div>
                            
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {content?.enterprise_title || '¿Necesitas algo más personalizado?'}
                            </h3>
                            
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                                {content?.enterprise_description || 'Para instituciones con necesidades específicas, ofrecemos planes empresariales con características y soporte personalizado.'}
                            </p>
                        </div>

                        {/* Features in a simple row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">
                                    {content?.enterprise_feature1_number || '24/7'}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {content?.enterprise_feature1_text || 'Soporte Dedicado'}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">
                                    {content?.enterprise_feature2_number || '100%'}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {content?.enterprise_feature2_text || 'Personalizable'}
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-2">
                                    {content?.enterprise_feature3_number || 'SLA'}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {content?.enterprise_feature3_text || 'Garantizado'}
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons matching plan cards style */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/contacto"
                                className="inline-flex items-center justify-center bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                            >
                                {content?.enterprise_button_primary || 'Contactar Ventas'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </a>
                            
                            <button className="inline-flex items-center justify-center bg-transparent border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                {content?.enterprise_button_secondary || 'Ver Demo'}
                            </button>
                        </div>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.faq_title || 'Preguntas Frecuentes'}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {content?.faq_description || 'Respuestas a las dudas más comunes sobre nuestros planes'}
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

            {/* Modal de edición por sección */}
            {editingSection && fullPageContent && (
                <UniversalSectionEditModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    sectionType={editingSection}
                    sectionName={editingSectionName}
                    pageKey="pricing"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                    isSaving={isSaving}
                />
            )}
        </PublicLayout>
    )
}
