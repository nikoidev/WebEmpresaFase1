'use client'

import { Check, Star } from 'lucide-react'
import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import SectionEditButton from '@/components/SectionEditButton'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import DevFileInfo from '@/components/DevFileInfo'
import PublicLayout from '@/components/layout/PublicLayout'

export default function PreciosPage() {
    const [content, setContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [fullPageContent, setFullPageContent] = useState<any>(null)
    const [plans, setPlans] = useState<any[]>([])
    const [loadingPlans, setLoadingPlans] = useState(true)
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

    const loadContent = async () => {
        try {
            console.log('🔄 Cargando contenido de /precios...')
            const response = await publicApi.getPageContent('pricing')
            console.log('✅ Contenido cargado:', response.data)
            setContent(response.data.content_json)
            setFullPageContent(response.data)
        } catch (error) {
            console.error('❌ Error loading pricing content:', error)
            // Usar contenido por defecto si falla
            setContent({
                hero_title: 'Planes y Precios',
                hero_subtitle: 'Elige el plan perfecto para tu institución educativa'
            })
        } finally {
            setLoading(false)
        }
    }

    const loadPlans = async () => {
        try {
            console.log('🔄 Cargando planes de servicio...')
            const response = await publicApi.getServicePlans()
            console.log('✅ Planes cargados:', response.data)
            setPlans(response.data)
        } catch (error) {
            console.error('❌ Error loading plans:', error)
            setPlans([])
        } finally {
            setLoadingPlans(false)
        }
    }

    const handleSectionEdit = (sectionType: string, sectionName: string) => {
        setEditingSection(sectionType)
        setEditingSectionName(sectionName)
    }

    const handleSectionSave = async () => {
        // Recargar contenido después de guardar
        await loadContent()
        // Si se editó la sección de pricing, también recargar planes
        if (editingSection === 'pricing') {
            await loadPlans()
        }
        setEditingSection(null)
        setEditingSectionName('')
    }


    useEffect(() => {
        loadContent()
        loadPlans()
    }, [])

    useEffect(() => {
        // Recargar contenido cuando la página vuelve a tener foco
        // Esto detecta cuando regresas del admin
        const handleFocus = () => {
            // NO recargar si hay un modal abierto (evita cerrar modals accidentalmente)
            if (editingSection) {
                console.log('🚨 Modal abierto - EVITANDO recarga por focus')
                return
            }
            console.log('🔄 Precios - Página recuperó foco, recargando contenido...')
            loadContent()
        }
        
        window.addEventListener('focus', handleFocus)
        
        return () => {
            window.removeEventListener('focus', handleFocus)
        }
    }, [editingSection])

    if (loading) {
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
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white relative">
                <SectionEditButton 
                    sectionName="Sección Hero"
                    onEdit={() => handleSectionEdit('hero', 'Sección Hero')}
                    position="top-right"
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                            {content?.hero_title || 'Planes y Precios'}
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
                            {content?.hero_subtitle || 'Elige el plan perfecto para tu institución educativa'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
                <SectionEditButton 
                    sectionName="Planes y Precios"
                    onEdit={() => handleSectionEdit('pricing', 'Planes y Precios')}
                    position="top-right"
                />
                
                {/* Light Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Subtle gradient orbs */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/30 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-green-200/20 to-emerald-200/20 animate-pulse" style={{animationDelay: '2s'}}></div>
                    
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-grid-slate-200/50 bg-[size:60px_60px]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section Enhanced */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
                            <span className="mr-2 text-base">🚀</span>
                            PLANES DE SERVICIO PREMIUM
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-800 mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {content?.pricing_title || 'ELIGE TU PLAN'}
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {content?.pricing_description || 'Potencia tu organización con nuestras soluciones innovadoras y escalables'}
                        </p>
                    </div>

                    {/* Modern Light Billing Toggle */}
                    <div className="flex justify-center mb-10">
                        <div className="relative">
                            {/* Subtle outer glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl blur opacity-60"></div>
                            
                            {/* Toggle container */}
                            <div className="relative bg-white p-2 rounded-2xl border border-gray-200 shadow-xl">
                                <div className="relative flex items-center bg-gray-50 rounded-xl p-1">
                                    
                                    {/* Active indicator */}
                                    <div 
                                        className={`absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg transition-all duration-700 ease-out ${
                                            billingPeriod === 'monthly' 
                                                ? 'left-1 w-[45%]' 
                                                : 'right-1 w-[55%]'
                                        }`}
                                    />
                                    
                                    {/* Monthly button */}
                                    <button
                                        onClick={() => setBillingPeriod('monthly')}
                                        className={`relative z-10 flex items-center justify-center px-8 py-4 text-lg font-bold transition-all duration-500 rounded-lg ${
                                            billingPeriod === 'monthly' 
                                                ? 'text-white transform scale-105' 
                                                : 'text-gray-700 hover:text-gray-900 hover:scale-102'
                                        }`}
                                        style={{ minWidth: '120px' }}
                                    >
                                        <span className="tracking-wider">MENSUAL</span>
                                    </button>
                                    
                                    {/* Yearly button */}
                                    <button
                                        onClick={() => setBillingPeriod('yearly')}
                                        className={`relative z-10 flex items-center justify-center px-8 py-4 text-lg font-bold transition-all duration-500 rounded-lg ${
                                            billingPeriod === 'yearly' 
                                                ? 'text-white transform scale-105' 
                                                : 'text-gray-700 hover:text-gray-900 hover:scale-102'
                                        }`}
                                        style={{ minWidth: '140px' }}
                                    >
                                        <span className="tracking-wider mr-3">ANUAL</span>
                                        
                                        {/* Savings badge */}
                                        <div className="relative">
                                            <div className="absolute -inset-1 bg-green-200 rounded-full blur opacity-60"></div>
                                            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md">
                                                <div className="flex items-center">
                                                    <span className="text-yellow-200 mr-1">⚡</span>
                                                    <span className="tracking-wide">40% OFF</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loadingPlans ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-800 font-medium mt-4">Cargando planes disponibles...</p>
                            <p className="text-gray-600 text-sm mt-2">Preparando las mejores opciones para ti</p>
                        </div>
                    ) : plans.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {plans
                                .filter(plan => plan.is_active)
                                .sort((a, b) => a.display_order - b.display_order)
                                .map((plan, index) => {
                                    const currentPrice = billingPeriod === 'yearly' ? plan.price_yearly : plan.price_monthly;
                                    const yearlyDiscount = plan.price_yearly && plan.price_monthly ? 
                                        Math.round(((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100) : 0;
                                    
                                    return (
                                        <div 
                                            key={plan.id} 
                                            className={`relative group transition-all duration-500 transform hover:scale-105 ${
                                                plan.is_popular 
                                                    ? 'scale-105 lg:scale-105 z-10' 
                                                    : 'hover:scale-102'
                                            }`}
                                        >
                                            {/* Subtle shadow effect */}
                                            <div className={`absolute -inset-1 rounded-3xl transition duration-500 ${
                                                plan.is_popular 
                                                    ? 'bg-gradient-to-br shadow-2xl opacity-20' 
                                                    : 'bg-gray-200 opacity-0 group-hover:opacity-40'
                                            }`}
                                                style={{
                                                    background: plan.is_popular 
                                                        ? `linear-gradient(135deg, ${plan.color_primary}40, ${plan.color_primary}20)` 
                                                        : undefined
                                                }}
                                            ></div>
                                            
                            {/* Main card with fixed height */}
                            <div className={`relative bg-white rounded-3xl border-2 transition-all duration-500 overflow-hidden h-[750px] flex flex-col ${
                                plan.is_popular 
                                    ? 'border-2 shadow-xl' 
                                    : 'border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300'
                            }`}
                                style={{
                                    borderColor: plan.is_popular ? plan.color_primary + '60' : undefined
                                }}
                            >
                                                
                                                {/* Popular floating badge - FULLY VISIBLE */}
                                                {plan.is_popular && (
                                                    <div className="absolute top-4 left-4 z-30">
                                                        <div className="relative">
                                                            <div 
                                                                className="rounded-full px-4 py-2 shadow-2xl border-3 border-white transform -rotate-12"
                                                                style={{ 
                                                                    background: `linear-gradient(135deg, ${plan.color_primary}, ${plan.color_primary}DD)` 
                                                                }}
                                                            >
                                                                <div className="flex items-center space-x-1">
                                                                    <span className="text-yellow-300 text-sm">⭐</span>
                                                                    <span className="text-white text-sm font-black tracking-wide">TOP</span>
                                                                    <span className="text-yellow-300 text-sm">⭐</span>
                                                                </div>
                                                            </div>
                                                            {/* Enhanced pulse animation */}
                                                            <div 
                                                                className="absolute inset-0 rounded-full animate-ping opacity-25"
                                                                style={{ 
                                                                    background: plan.color_primary 
                                                                }}
                                                            ></div>
                                                            {/* Extra glow effect */}
                                                            <div 
                                                                className="absolute -inset-1 rounded-full blur-sm opacity-30 animate-pulse"
                                                                style={{ 
                                                                    background: `linear-gradient(135deg, ${plan.color_primary}, ${plan.color_primary}60)` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="p-6 flex-1 flex flex-col">
                                                    {/* Plan header */}
                                                    <div className="text-center mb-4">
                                                        <div className="flex justify-center mb-3">
                                                            <div 
                                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg border-3 border-white"
                                                                style={{ 
                                                                    background: `linear-gradient(135deg, ${plan.color_primary}, ${plan.color_primary}DD)` 
                                                                }}
                                                            >
                                                                {plan.name.charAt(0)}
                                                            </div>
                                                        </div>
                                                        <h3 className="text-xl font-black text-gray-800 mb-2">{plan.name}</h3>
                                                        <p className="text-gray-600 text-sm leading-relaxed px-2">{plan.description}</p>
                                                    </div>

                                                    {/* Price section */}
                                                    <div className="text-center mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                        <div className="relative">
                                                            {/* Price display */}
                                                            <div className="transition-all duration-700 ease-out">
                                                                <div className="flex items-baseline justify-center mb-1">
                                                                    <span className="text-xl text-gray-600 font-bold">€</span>
                                                                    <span 
                                                                        className="text-4xl font-black ml-1 tracking-tight"
                                                                        style={{ color: plan.color_primary }}
                                                                    >
                                                                        {currentPrice}
                                                                    </span>
                                                                </div>
                                                                <div className="mb-2">
                                                                    <span className="text-gray-700 font-bold text-xs tracking-wider bg-white px-2 py-1 rounded-full border border-gray-200">
                                                                        {billingPeriod === 'yearly' ? '🗓️ ANUAL' : '📅 MENSUAL'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Savings badge for yearly */}
                                                            {billingPeriod === 'yearly' && yearlyDiscount > 0 && (
                                                                <div className="mb-1">
                                                                    <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                                        <span className="mr-1">💰</span>
                                                                        AHORRAS {yearlyDiscount}%
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Comparison price */}
                                                            {billingPeriod === 'yearly' && plan.price_yearly && plan.price_monthly && (
                                                                <div className="text-gray-500 text-xs">
                                                                    <span className="line-through font-semibold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">€{plan.price_monthly * 12} al año</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Features */}
                                                    <div className="flex-1 mb-3">
                                                        <div className="bg-white rounded-xl border border-gray-200 p-3">
                                                            <h4 className="text-sm font-bold text-gray-800 mb-2 text-center">✨ Características incluidas</h4>
                                                            <div className="space-y-1">
                                                                {plan.features?.slice(0, 4).map((feature: string, featureIndex: number) => (
                                                                    <div key={featureIndex} className="flex items-center space-x-2 p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                                        <div className="flex-shrink-0">
                                                                            <div 
                                                                                className="w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                                                                                style={{ backgroundColor: plan.color_primary }}
                                                                            >
                                                                                <Check className="h-2.5 w-2.5 text-white font-bold" />
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-gray-800 font-medium text-xs leading-tight">{feature}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* CTA Button */}
                                                    <div className="space-y-2">
                                                        <button 
                                                            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 ${
                                                                plan.is_popular 
                                                                    ? 'text-white border-transparent' 
                                                                    : 'bg-gray-800 text-white hover:bg-gray-700 border-gray-800 hover:border-gray-700'
                                                            }`}
                                                            style={{
                                                                background: plan.is_popular 
                                                                    ? `linear-gradient(135deg, ${plan.color_primary}, ${plan.color_primary}DD)` 
                                                                    : undefined
                                                            }}
                                                        >
                                                            {plan.is_popular ? '🚀 EMPEZAR AHORA' : '📞 MÁS INFO'}
                                                        </button>

                                                        {/* Trial info */}
                                                        <div className="text-center p-1.5 bg-blue-50 rounded-lg border border-blue-200">
                                                            <p className="text-xs text-blue-800 font-semibold">
                                                                🎁 Prueba GRATIS por 14 días
                                                            </p>
                                                            <p className="text-xs text-blue-600">
                                                                Sin compromisos • Cancelación fácil
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <div className="relative mb-8">
                                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto border-4 border-white shadow-lg">
                                        <span className="text-6xl">📋</span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 mb-4">No hay planes disponibles</h3>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">Estamos preparando opciones increíbles para ti. ¡Vuelve pronto!</p>
                                <div className="space-y-4">
                                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                        💬 Contactar para más información
                                    </button>
                                    <p className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                                        ✨ O suscríbete para recibir notificaciones
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Enterprise Section */}
            <section className="py-24 bg-white relative">
                <SectionEditButton 
                    sectionName="Sección Empresarial"
                    onEdit={() => handleSectionEdit('enterprise', 'Sección Empresarial')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        {content?.enterprise_title || '¿Necesitas algo más personalizado?'}
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        {content?.enterprise_description || 'Contáctanos para soluciones empresariales a medida'}
                    </p>
                    <a
                        href={content?.enterprise_button_link || "/contacto"}
                        className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center justify-center"
                    >
                        {content?.enterprise_button_text || 'Solicitar Cotización'}
                    </a>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-gray-50 relative">
                <SectionEditButton 
                    sectionName="Preguntas Frecuentes"
                    onEdit={() => handleSectionEdit('faq', 'Preguntas Frecuentes')}
                    position="top-right"
                />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {content?.faq_title || 'Preguntas Frecuentes'}
                        </h2>
                        <p className="text-xl text-gray-600">
                            {content?.faq_description || 'Respuestas sobre nuestros planes y precios'}
                        </p>
                    </div>

                    {content?.faqs?.length > 0 ? (
                        <div className="space-y-6">
                            {content.faqs.map((item: any, index: number) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
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
                    pageKey="pricing"
                    initialContent={fullPageContent}
                    onSave={handleSectionSave}
                    isSaving={false}
                />
            )}

        </PublicLayout>
    )
}
