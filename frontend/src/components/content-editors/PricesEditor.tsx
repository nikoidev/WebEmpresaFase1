'use client'

import React, { useState, useEffect } from 'react'
import { Plus, X, DollarSign, Check, Star, Eye, EyeOff } from 'lucide-react'

interface PricingFeature {
    name: string
    included: boolean
    description?: string
}

interface PricingPlan {
    id?: number
    name: string
    price: number
    currency: string
    billing_period: string
    description: string
    features: PricingFeature[]
    is_popular: boolean
    is_active: boolean
    order: number
    button_text: string
    button_link?: string
}

interface PricesData {
    plans: PricingPlan[]
    general_info: {
        title: string
        subtitle: string
        footer_note?: string
    }
}

interface PricesEditorProps {
    data: PricesData
    onChange: (data: PricesData) => void
}

export default function PricesEditor({ data, onChange }: PricesEditorProps) {
    const [plans, setPlans] = useState<PricingPlan[]>(data.plans || [])
    const [generalInfo, setGeneralInfo] = useState(data.general_info || {
        title: 'Nuestros Planes',
        subtitle: 'Elige el plan que mejor se adapte a tus necesidades'
    })
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [newFeatureName, setNewFeatureName] = useState('')

    useEffect(() => {
        onChange({ plans, general_info: generalInfo })
    }, [plans, generalInfo, onChange])

    const addPlan = () => {
        const newPlan: PricingPlan = {
            name: '',
            price: 0,
            currency: '$',
            billing_period: 'mes',
            description: '',
            features: [],
            is_popular: false,
            is_active: true,
            order: plans.length + 1,
            button_text: 'Contratar'
        }
        setPlans([...plans, newPlan])
        setEditingIndex(plans.length)
    }

    const updatePlan = (index: number, field: keyof PricingPlan, value: any) => {
        const updatedPlans = [...plans]
        updatedPlans[index] = { ...updatedPlans[index], [field]: value }
        setPlans(updatedPlans)
    }

    const deletePlan = (index: number) => {
        const updatedPlans = plans.filter((_, i) => i !== index)
        setPlans(updatedPlans)
        setEditingIndex(null)
    }

    const addFeature = (planIndex: number) => {
        if (!newFeatureName.trim()) return
        const updatedPlans = [...plans]
        updatedPlans[planIndex].features.push({
            name: newFeatureName.trim(),
            included: true
        })
        setPlans(updatedPlans)
        setNewFeatureName('')
    }

    const updateFeature = (planIndex: number, featureIndex: number, field: keyof PricingFeature, value: any) => {
        const updatedPlans = [...plans]
        updatedPlans[planIndex].features[featureIndex] = {
            ...updatedPlans[planIndex].features[featureIndex],
            [field]: value
        }
        setPlans(updatedPlans)
    }

    const deleteFeature = (planIndex: number, featureIndex: number) => {
        const updatedPlans = [...plans]
        updatedPlans[planIndex].features = updatedPlans[planIndex].features.filter((_, i) => i !== featureIndex)
        setPlans(updatedPlans)
    }

    const movePlan = (index: number, direction: 'up' | 'down') => {
        const newPlans = [...plans]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        
        if (targetIndex < 0 || targetIndex >= plans.length) return
        
        // Intercambiar elementos
        [newPlans[index], newPlans[targetIndex]] = [newPlans[targetIndex], newPlans[index]]
        
        // Actualizar órdenes
        newPlans[index].order = index + 1
        newPlans[targetIndex].order = targetIndex + 1
        
        setPlans(newPlans)
        setEditingIndex(targetIndex)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Precios y Planes</h3>
                <button
                    onClick={addPlan}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Plan
                </button>
            </div>

            {/* Información General */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información General</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título Principal
                        </label>
                        <input
                            type="text"
                            value={generalInfo.title}
                            onChange={(e) => setGeneralInfo({ ...generalInfo, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Nuestros Planes"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtítulo
                        </label>
                        <input
                            type="text"
                            value={generalInfo.subtitle}
                            onChange={(e) => setGeneralInfo({ ...generalInfo, subtitle: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Elige el plan que mejor se adapte a tus necesidades"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nota al pie (opcional)
                        </label>
                        <textarea
                            value={generalInfo.footer_note || ''}
                            onChange={(e) => setGeneralInfo({ ...generalInfo, footer_note: e.target.value })}
                            rows={2}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Información adicional sobre los precios..."
                        />
                    </div>
                </div>
            </div>

            {plans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay planes. Haz clic en "Agregar Plan" para empezar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {plans.map((plan, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Plan #{index + 1}
                                    </span>
                                    {plan.is_popular && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            Popular
                                        </span>
                                    )}
                                    {!plan.is_active && (
                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                            Inactivo
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {index > 0 && (
                                        <button
                                            onClick={() => movePlan(index, 'up')}
                                            className="text-gray-600 hover:text-gray-700 text-sm"
                                        >
                                            ↑
                                        </button>
                                    )}
                                    {index < plans.length - 1 && (
                                        <button
                                            onClick={() => movePlan(index, 'down')}
                                            className="text-gray-600 hover:text-gray-700 text-sm"
                                        >
                                            ↓
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingIndex === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deletePlan(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingIndex === index ? (
                                <div className="space-y-4">
                                    {/* Información Básica */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre del Plan *
                                            </label>
                                            <input
                                                type="text"
                                                value={plan.name}
                                                onChange={(e) => updatePlan(index, 'name', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Plan Básico"
                                            />
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Moneda
                                                </label>
                                                <select
                                                    value={plan.currency}
                                                    onChange={(e) => updatePlan(index, 'currency', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                >
                                                    <option value="$">$ USD</option>
                                                    <option value="€">€ EUR</option>
                                                    <option value="£">£ GBP</option>
                                                    <option value="₡">₡ CRC</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Precio *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={plan.price}
                                                    onChange={(e) => updatePlan(index, 'price', parseFloat(e.target.value))}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    min="0"
                                                    step="0.01"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Período
                                                </label>
                                                <select
                                                    value={plan.billing_period}
                                                    onChange={(e) => updatePlan(index, 'billing_period', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                >
                                                    <option value="mes">por mes</option>
                                                    <option value="año">por año</option>
                                                    <option value="único">pago único</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={plan.description}
                                            onChange={(e) => updatePlan(index, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Descripción del plan..."
                                        />
                                    </div>

                                    {/* Características */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Características
                                        </label>
                                        <div className="space-y-2 mb-3">
                                            {plan.features.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={feature.included}
                                                        onChange={(e) => updateFeature(index, featureIndex, 'included', e.target.checked)}
                                                        className="rounded"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={feature.name}
                                                        onChange={(e) => updateFeature(index, featureIndex, 'name', e.target.value)}
                                                        className="flex-1 border border-gray-300 rounded px-2 py-1"
                                                        placeholder="Nombre de la característica"
                                                    />
                                                    <button
                                                        onClick={() => deleteFeature(index, featureIndex)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newFeatureName}
                                                onChange={(e) => setNewFeatureName(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addFeature(index)}
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nueva característica"
                                            />
                                            <button
                                                onClick={() => addFeature(index)}
                                                className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Botón y Enlaces */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Texto del Botón
                                            </label>
                                            <input
                                                type="text"
                                                value={plan.button_text}
                                                onChange={(e) => updatePlan(index, 'button_text', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Contratar"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Enlace del Botón (opcional)
                                            </label>
                                            <input
                                                type="url"
                                                value={plan.button_link || ''}
                                                onChange={(e) => updatePlan(index, 'button_link', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://ejemplo.com/contratar"
                                            />
                                        </div>
                                    </div>

                                    {/* Opciones */}
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={plan.is_popular}
                                                onChange={(e) => updatePlan(index, 'is_popular', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Plan popular</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={plan.is_active}
                                                onChange={(e) => updatePlan(index, 'is_active', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Plan activo</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">
                                                {plan.name || 'Sin nombre'}
                                            </h4>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                                {plan.currency}{plan.price}
                                                <span className="text-sm font-normal text-gray-600">
                                                    /{plan.billing_period}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {plan.description || 'Sin descripción'}
                                            </p>
                                        </div>
                                        <div className="text-right text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                {plan.is_active ? (
                                                    <><Eye className="h-3 w-3" /> Visible</>
                                                ) : (
                                                    <><EyeOff className="h-3 w-3" /> Oculto</>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {plan.features.length > 0 && (
                                        <div className="mt-3">
                                            <h5 className="text-sm font-medium text-gray-700 mb-2">Características:</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                                {plan.features.slice(0, 4).map((feature, featureIndex) => (
                                                    <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                                        {feature.included ? (
                                                            <Check className="h-3 w-3 text-green-600" />
                                                        ) : (
                                                            <X className="h-3 w-3 text-red-600" />
                                                        )}
                                                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                                            {feature.name}
                                                        </span>
                                                    </div>
                                                ))}
                                                {plan.features.length > 4 && (
                                                    <div className="text-sm text-gray-500">
                                                        +{plan.features.length - 4} más...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
