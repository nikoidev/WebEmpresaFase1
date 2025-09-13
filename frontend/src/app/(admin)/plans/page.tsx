'use client'

import adminApi from '@/services/adminApi'
import type { ServicePlan } from '@/types'
import {
    CheckCircle,
    Edit,
    Plus,
    Search,
    Star,
    Trash2,
    Users
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PlansManagementPage() {
    const [plans, setPlans] = useState<ServicePlan[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingPlan, setEditingPlan] = useState<ServicePlan | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        billing_period: 'monthly' as 'monthly' | 'yearly',
        features: '',
        is_popular: false,
        is_active: true,
        button_text: 'Contratar',
        max_users: ''
    })

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = async () => {
        try {
            const response = await adminApi.getPlans()
            setPlans(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching plans:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const planData = {
                ...formData,
                price: parseFloat(formData.price),
                max_users: formData.max_users ? parseInt(formData.max_users) : null,
                features: formData.features.split('\n').filter(f => f.trim())
            }

            if (editingPlan) {
                await adminApi.updatePlan(editingPlan.id, planData)
            } else {
                await adminApi.createPlan(planData)
            }

            setShowModal(false)
            setEditingPlan(null)
            resetForm()
            fetchPlans()
        } catch (error) {
            console.error('Error saving plan:', error)
        }
    }

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            billing_period: 'monthly',
            features: '',
            is_popular: false,
            is_active: true,
            button_text: 'Contratar',
            max_users: ''
        })
    }

    const handleEdit = (plan: ServicePlan) => {
        setEditingPlan(plan)
        setFormData({
            name: plan.name,
            description: plan.description,
            price: plan.price.toString(),
            billing_period: plan.billing_period,
            features: Array.isArray(plan.features) ? plan.features.join('\n') : plan.features,
            is_popular: plan.is_popular,
            is_active: plan.is_active,
            button_text: plan.button_text || 'Contratar',
            max_users: plan.max_users ? plan.max_users.toString() : ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este plan?')) {
            try {
                await adminApi.deletePlan(id)
                fetchPlans()
            } catch (error) {
                console.error('Error deleting plan:', error)
            }
        }
    }

    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Planes</h1>
                    <p className="mt-2 text-gray-600">
                        Administra los planes de servicios y precios
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nuevo Plan
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar planes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    {plan.is_popular && (
                                        <div className="flex items-center gap-1 text-yellow-600 text-sm mt-1">
                                            <Star size={16} />
                                            Popular
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${plan.is_active ? 'bg-green-500' : 'bg-red-500'
                                        }`}></span>
                                    <span className="text-sm text-gray-500">
                                        {plan.is_active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">{plan.description}</p>

                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-3xl font-bold text-gray-900">
                                    S/. {plan.price}
                                </span>
                                <span className="text-gray-500">
                                    /{plan.billing_period === 'monthly' ? 'mes' : 'año'}
                                </span>
                            </div>

                            {plan.max_users && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <Users size={16} />
                                    Hasta {plan.max_users} usuarios
                                </div>
                            )}

                            <div className="space-y-2 mb-6">
                                {Array.isArray(plan.features) ? (
                                    plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <CheckCircle size={16} className="text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-600">{plan.features}</div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Edit size={16} />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Plan
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Precio
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Período de Facturación
                                    </label>
                                    <select
                                        value={formData.billing_period}
                                        onChange={(e) => setFormData({ ...formData, billing_period: e.target.value as 'monthly' | 'yearly' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="monthly">Mensual</option>
                                        <option value="yearly">Anual</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Máximo de Usuarios
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_users}
                                        onChange={(e) => setFormData({ ...formData, max_users: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ilimitado"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Características (una por línea)
                                </label>
                                <textarea
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={5}
                                    placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del Botón
                                </label>
                                <input
                                    type="text"
                                    value={formData.button_text}
                                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_popular}
                                        onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Plan Popular
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Activo
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingPlan(null)
                                        resetForm()
                                    }}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingPlan ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
