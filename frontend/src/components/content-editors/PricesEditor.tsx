'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Check, X, DollarSign, Crown } from 'lucide-react'

interface Plan {
    name: string
    price: string
    period: string
    description: string
    features: string[]
    recommended: boolean
    cta: string
}

interface FeatureComparison {
    feature: string
    basic: string
    professional: string
    enterprise: string
}

interface FAQ {
    question: string
    answer: string
}

interface PricesContent {
    hero: {
        title: string
        subtitle: string
        description: string
    }
    plans: Plan[]
    features_comparison: FeatureComparison[]
    faq: FAQ[]
}

interface PricesEditorProps {
    data: PricesContent
    onChange: (data: PricesContent) => void
}

export default function PricesEditor({ data, onChange }: PricesEditorProps) {
    const [formData, setFormData] = useState<PricesContent>(data)

    // Sincronizar estado local con props cuando cambian los datos
    useEffect(() => {
        setFormData(data)
    }, [data])
    const [editingPlan, setEditingPlan] = useState<number | null>(null)
    const [editingFeature, setEditingFeature] = useState<number | null>(null)
    const [editingFAQ, setEditingFAQ] = useState<number | null>(null)
    const [activeSection, setActiveSection] = useState<'hero' | 'plans' | 'comparison' | 'faq'>('hero')

    const handleChange = (newData: PricesContent) => {
        setFormData(newData)
        onChange(newData)
    }

    const updateHero = (field: keyof typeof formData.hero, value: string) => {
        const updatedData = {
            ...formData,
            hero: { ...formData.hero, [field]: value }
        }
        handleChange(updatedData)
    }

    const updatePlan = (index: number, field: keyof Plan, value: any) => {
        const updatedPlans = [...formData.plans]
        updatedPlans[index] = { ...updatedPlans[index], [field]: value }
        const updatedData = { ...formData, plans: updatedPlans }
        handleChange(updatedData)
    }

    const addFeatureToPlan = (planIndex: number) => {
        const updatedPlans = [...formData.plans]
        updatedPlans[planIndex].features.push('Nueva característica')
        const updatedData = { ...formData, plans: updatedPlans }
        handleChange(updatedData)
    }

    const updatePlanFeature = (planIndex: number, featureIndex: number, value: string) => {
        const updatedPlans = [...formData.plans]
        updatedPlans[planIndex].features[featureIndex] = value
        const updatedData = { ...formData, plans: updatedPlans }
        handleChange(updatedData)
    }

    const removePlanFeature = (planIndex: number, featureIndex: number) => {
        const updatedPlans = [...formData.plans]
        updatedPlans[planIndex].features.splice(featureIndex, 1)
        const updatedData = { ...formData, plans: updatedPlans }
        handleChange(updatedData)
    }

    const addComparison = () => {
        const newComparison: FeatureComparison = {
            feature: 'Nueva característica',
            basic: 'Básico',
            professional: 'Profesional',
            enterprise: 'Completo'
        }
        const updatedData = {
            ...formData,
            features_comparison: [...formData.features_comparison, newComparison]
        }
        handleChange(updatedData)
        setEditingFeature(formData.features_comparison.length)
    }

    const updateComparison = (index: number, field: keyof FeatureComparison, value: string) => {
        const updatedComparisons = [...formData.features_comparison]
        updatedComparisons[index] = { ...updatedComparisons[index], [field]: value }
        const updatedData = { ...formData, features_comparison: updatedComparisons }
        handleChange(updatedData)
    }

    const deleteComparison = (index: number) => {
        const updatedComparisons = formData.features_comparison.filter((_, i) => i !== index)
        const updatedData = { ...formData, features_comparison: updatedComparisons }
        handleChange(updatedData)
        setEditingFeature(null)
    }

    const addFAQ = () => {
        const newFAQ: FAQ = {
            question: '¿Nueva pregunta?',
            answer: 'Nueva respuesta...'
        }
        const updatedData = {
            ...formData,
            faq: [...formData.faq, newFAQ]
        }
        handleChange(updatedData)
        setEditingFAQ(formData.faq.length)
    }

    const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
        const updatedFAQs = [...formData.faq]
        updatedFAQs[index] = { ...updatedFAQs[index], [field]: value }
        const updatedData = { ...formData, faq: updatedFAQs }
        handleChange(updatedData)
    }

    const deleteFAQ = (index: number) => {
        const updatedFAQs = formData.faq.filter((_, i) => i !== index)
        const updatedData = { ...formData, faq: updatedFAQs }
        handleChange(updatedData)
        setEditingFAQ(null)
    }

    const sections = [
        { id: 'hero', label: 'Contenido Principal', icon: '🏢' },
        { id: 'plans', label: 'Planes de Servicios', icon: '💰' },
        { id: 'comparison', label: 'Comparación', icon: '📊' },
        { id: 'faq', label: 'Preguntas Frecuentes', icon: '❓' }
    ]

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones de Precios</h3>
                <nav className="space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                activeSection === section.id
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Editor */}
            <div className="flex-1 p-6 overflow-y-auto">
                {activeSection === 'hero' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Contenido Principal</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                value={formData.hero.title}
                                onChange={(e) => updateHero('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Planes y Precios"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={formData.hero.subtitle}
                                onChange={(e) => updateHero('subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Soluciones para instituciones de todos los tamaños"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.hero.description}
                                onChange={(e) => updateHero('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Elige el plan que mejor se adapte a las necesidades de tu institución educativa."
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'plans' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Planes de Servicios</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {formData.plans.map((plan, index) => (
                                <div key={index} className={`border rounded-lg p-4 relative ${plan.recommended ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                                    {plan.recommended && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                                <Crown className="h-3 w-3" />
                                                Recomendado
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-sm font-medium text-gray-500">
                                            Plan #{index + 1}
                                        </span>
                                        <button
                                            onClick={() => setEditingPlan(editingPlan === index ? null : index)}
                                            className="text-green-600 hover:text-green-700 text-sm"
                                        >
                                            {editingPlan === index ? 'Cerrar' : 'Editar'}
                                        </button>
                                    </div>

                                    {editingPlan === index ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del Plan</label>
                                                <input
                                                    type="text"
                                                    value={plan.name}
                                                    onChange={(e) => updatePlan(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                    placeholder="Básico"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Precio</label>
                                                    <input
                                                        type="text"
                                                        value={plan.price}
                                                        onChange={(e) => updatePlan(index, 'price', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="$99"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Período</label>
                                                    <input
                                                        type="text"
                                                        value={plan.period}
                                                        onChange={(e) => updatePlan(index, 'period', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="mes"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                                                <textarea
                                                    value={plan.description}
                                                    onChange={(e) => updatePlan(index, 'description', e.target.value)}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                    placeholder="Perfecto para instituciones pequeñas..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">CTA Button</label>
                                                <input
                                                    type="text"
                                                    value={plan.cta}
                                                    onChange={(e) => updatePlan(index, 'cta', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                    placeholder="Comenzar Gratis"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={plan.recommended}
                                                        onChange={(e) => updatePlan(index, 'recommended', e.target.checked)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-xs font-medium text-gray-700">Plan Recomendado</span>
                                                </label>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-xs font-medium text-gray-700">Características</label>
                                                    <button
                                                        onClick={() => addFeatureToPlan(index)}
                                                        className="text-green-600 hover:text-green-700 text-xs"
                                                    >
                                                        + Agregar
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    {plan.features.map((feature, featureIndex) => (
                                                        <div key={featureIndex} className="flex gap-1">
                                                            <input
                                                                type="text"
                                                                value={feature}
                                                                onChange={(e) => updatePlanFeature(index, featureIndex, e.target.value)}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                            />
                                                            <button
                                                                onClick={() => removePlanFeature(index, featureIndex)}
                                                                className="text-red-600 hover:text-red-700 px-1"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h5 className="font-semibold text-lg">{plan.name}</h5>
                                            <div className="flex items-baseline gap-1 mb-2">
                                                <span className="text-2xl font-bold">{plan.price}</span>
                                                {plan.period && <span className="text-gray-600">/{plan.period}</span>}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                                            <ul className="space-y-1 mb-4">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                                        <Check className="h-3 w-3 text-green-600" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button className="w-full bg-green-600 text-white py-2 rounded text-sm">
                                                {plan.cta}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'comparison' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Comparación de Características</h3>
                            <button
                                onClick={addComparison}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Comparación
                            </button>
                        </div>

                        {formData.features_comparison.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No hay comparaciones. Haz clic en "Agregar Comparación" para empezar.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.features_comparison.map((comparison, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-sm font-medium text-gray-500">Característica #{index + 1}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingFeature(editingFeature === index ? null : index)}
                                                    className="text-green-600 hover:text-green-700 text-sm"
                                                >
                                                    {editingFeature === index ? 'Cerrar' : 'Editar'}
                                                </button>
                                                <button
                                                    onClick={() => deleteComparison(index)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {editingFeature === index ? (
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Característica
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={comparison.feature}
                                                        onChange={(e) => updateComparison(index, 'feature', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="Número de estudiantes"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Plan Básico
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={comparison.basic}
                                                        onChange={(e) => updateComparison(index, 'basic', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="100"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Plan Profesional
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={comparison.professional}
                                                        onChange={(e) => updateComparison(index, 'professional', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="1,000"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Plan Enterprise
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={comparison.enterprise}
                                                        onChange={(e) => updateComparison(index, 'enterprise', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="Ilimitado"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-4 gap-4 text-sm">
                                                <div className="font-medium">{comparison.feature}</div>
                                                <div className="text-center">{comparison.basic}</div>
                                                <div className="text-center">{comparison.professional}</div>
                                                <div className="text-center">{comparison.enterprise}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'faq' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Preguntas Frecuentes</h3>
                            <button
                                onClick={addFAQ}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar FAQ
                            </button>
                        </div>

                        {formData.faq.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No hay FAQs. Haz clic en "Agregar FAQ" para empezar.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.faq.map((faq, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-sm font-medium text-gray-500">FAQ #{index + 1}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingFAQ(editingFAQ === index ? null : index)}
                                                    className="text-green-600 hover:text-green-700 text-sm"
                                                >
                                                    {editingFAQ === index ? 'Cerrar' : 'Editar'}
                                                </button>
                                                <button
                                                    onClick={() => deleteFAQ(index)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {editingFAQ === index ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Pregunta
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={faq.question}
                                                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="¿Pregunta frecuente?"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Respuesta
                                                    </label>
                                                    <textarea
                                                        value={faq.answer}
                                                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                                        rows={4}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="Respuesta detallada..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-2">{faq.question}</h5>
                                                <p className="text-sm text-gray-600">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}