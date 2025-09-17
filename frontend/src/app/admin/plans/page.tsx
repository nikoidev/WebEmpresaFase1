'use client'

import React, { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Package, Save, X, DollarSign, Users, HardDrive, Zap, Palette } from 'lucide-react'

interface ServicePlan {
    id: number
    name: string
    slug: string
    description: string
    price_monthly: number
    price_yearly?: number
    max_users: number
    max_courses: number
    storage_gb: number
    api_requests_limit: number
    features: string[]
    color_primary: string
    color_secondary: string
    is_active: boolean
    is_popular: boolean
    display_order: number
    created_at: string
    updated_at?: string
}

interface PlanFormData {
    name: string
    description: string
    price_monthly: number
    price_yearly?: number
    max_users: number
    max_courses: number
    storage_gb: number
    api_requests_limit: number
    features: string[]
    color_primary: string
    color_secondary: string
    is_active: boolean
    is_popular: boolean
    display_order: number
}

export default function PlansManagementPage() {
    const [plans, setPlans] = useState<ServicePlan[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingPlan, setEditingPlan] = useState<ServicePlan | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [newFeature, setNewFeature] = useState('')

    const defaultFormData: PlanFormData = {
        name: '',
        description: '',
        price_monthly: 0,
        price_yearly: 0,
        max_users: 1,
        max_courses: 10,
        storage_gb: 1,
        api_requests_limit: 1000,
        features: [],
        color_primary: '#3B82F6',
        color_secondary: '#1E40AF',
        is_active: true,
        is_popular: false,
        display_order: 0
    }

    const [formData, setFormData] = useState<PlanFormData>(defaultFormData)

    useEffect(() => {
        loadPlans()
    }, [])

    const loadPlans = async () => {
        try {
            setIsLoading(true)
            const response = await adminApi.plans.list()
            setPlans(response.data || [])
        } catch (error) {
            console.error('Error loading plans:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (plan: ServicePlan) => {
        setEditingPlan(plan)
        setFormData({
            name: plan.name,
            description: plan.description,
            price_monthly: plan.price_monthly,
            price_yearly: plan.price_yearly || 0,
            max_users: plan.max_users,
            max_courses: plan.max_courses,
            storage_gb: plan.storage_gb,
            api_requests_limit: plan.api_requests_limit,
            features: [...plan.features],
            color_primary: plan.color_primary,
            color_secondary: plan.color_secondary,
            is_active: plan.is_active,
            is_popular: plan.is_popular,
            display_order: plan.display_order
        })
    }

    const handleCreate = () => {
        setIsCreating(true)
        setEditingPlan(null)
        setFormData(defaultFormData)
    }

    const handleCancel = () => {
        setEditingPlan(null)
        setIsCreating(false)
        setFormData(defaultFormData)
        setNewFeature('')
    }

    const handleSave = async () => {
        try {
            setIsSaving(true)
            
            if (editingPlan) {
                // Actualizar plan existente
                await adminApi.plans.update(editingPlan.id, formData)
            } else if (isCreating) {
                // Crear nuevo plan
                await adminApi.plans.create(formData)
            }
            
            // Recargar lista
            await loadPlans()
            handleCancel()
        } catch (error) {
            console.error('Error saving plan:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (plan: ServicePlan) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar el plan "${plan.name}"?`)) {
            return
        }

        try {
            await adminApi.plans.delete(plan.id)
            await loadPlans()
        } catch (error) {
            console.error('Error deleting plan:', error)
        }
    }

    const addFeature = () => {
        if (newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }))
            setNewFeature('')
        }
    }

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Planes</h1>
                    <p className="text-gray-600 mt-2">Administra los planes de servicio disponibles</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                    <Plus className="h-5 w-5" />
                    <span>Nuevo Plan</span>
                </button>
            </div>

            {/* Plans List */}
            {!editingPlan && !isCreating && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                                plan.is_popular ? 'border-2 border-yellow-400 relative' : 'border-gray-200'
                            }`}
                        >
                            {plan.is_popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-xs font-bold flex items-center">
                                        <Star className="h-3 w-3 mr-1" />
                                        POPULAR
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Plan Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div 
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                                        style={{ backgroundColor: plan.color_primary }}
                                    >
                                        {plan.name.charAt(0)}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {plan.is_active ? (
                                            <Eye className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="text-sm text-gray-500">
                                            #{plan.display_order}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                                {/* Pricing */}
                                <div className="mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span 
                                            className="text-2xl font-black"
                                            style={{ color: plan.color_primary }}
                                        >
                                            €{plan.price_monthly}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            /mes
                                        </span>
                                    </div>
                                    {plan.price_yearly && (
                                        <div className="text-sm text-gray-500">
                                            €{plan.price_yearly}/año
                                        </div>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-1">
                                            <Users className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div className="text-sm font-medium">{plan.max_users}</div>
                                        <div className="text-xs text-gray-500">usuarios</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-1">
                                            <HardDrive className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div className="text-sm font-medium">{plan.storage_gb}GB</div>
                                        <div className="text-xs text-gray-500">almacén</div>
                                    </div>
                                </div>

                                {/* Features Count */}
                                <div className="mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Package className="h-4 w-4 mr-1" />
                                        {plan.features.length} características
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(plan)}
                                        className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-1"
                                    >
                                        <Edit className="h-4 w-4" />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan)}
                                        className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit/Create Form */}
            {(editingPlan || isCreating) && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Plan
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Ej: Plan Básico"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Describe las características principales del plan"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <DollarSign className="h-4 w-4 inline mr-1" />
                                                Precio Mensual (€)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.price_monthly}
                                                onChange={(e) => setFormData(prev => ({ ...prev, price_monthly: parseFloat(e.target.value) || 0 }))}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <DollarSign className="h-4 w-4 inline mr-1" />
                                                Precio Anual (€)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.price_yearly || ''}
                                                onChange={(e) => setFormData(prev => ({ ...prev, price_yearly: parseFloat(e.target.value) || undefined }))}
                                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Plan Limits */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Límites del Plan</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Users className="h-4 w-4 inline mr-1" />
                                            Máx. Usuarios
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_users}
                                            onChange={(e) => setFormData(prev => ({ ...prev, max_users: parseInt(e.target.value) || 1 }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Package className="h-4 w-4 inline mr-1" />
                                            Máx. Cursos
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_courses}
                                            onChange={(e) => setFormData(prev => ({ ...prev, max_courses: parseInt(e.target.value) || 10 }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <HardDrive className="h-4 w-4 inline mr-1" />
                                            Almacenamiento (GB)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.storage_gb}
                                            onChange={(e) => setFormData(prev => ({ ...prev, storage_gb: parseInt(e.target.value) || 1 }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Zap className="h-4 w-4 inline mr-1" />
                                            API Requests
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.api_requests_limit}
                                            onChange={(e) => setFormData(prev => ({ ...prev, api_requests_limit: parseInt(e.target.value) || 1000 }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Configuration */}
                        <div className="space-y-6">
                            {/* Colors */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    <Palette className="h-5 w-5 inline mr-2" />
                                    Configuración Visual
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Color Primario
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                value={formData.color_primary}
                                                onChange={(e) => setFormData(prev => ({ ...prev, color_primary: e.target.value }))}
                                                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.color_primary}
                                                onChange={(e) => setFormData(prev => ({ ...prev, color_primary: e.target.value }))}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Color Secundario
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="color"
                                                value={formData.color_secondary}
                                                onChange={(e) => setFormData(prev => ({ ...prev, color_secondary: e.target.value }))}
                                                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.color_secondary}
                                                onChange={(e) => setFormData(prev => ({ ...prev, color_secondary: e.target.value }))}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Orden de Visualización
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.display_order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Activo</span>
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_popular}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_popular: e.target.checked }))}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Popular</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
                                
                                <div className="space-y-3">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="flex-1 bg-gray-50 px-3 py-2 rounded-lg border">
                                                {feature}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                                            placeholder="Nueva característica..."
                                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                        <button
                                            type="button"
                                            onClick={addFeature}
                                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            <span>{isSaving ? 'Guardando...' : 'Guardar Plan'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
