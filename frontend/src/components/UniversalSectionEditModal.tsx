'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, User, BookOpen, Award, Globe, Heart, Copy, Move, Mail, Phone, MapPin, Clock, Building, Wifi, Calendar, MessageSquare, Smartphone, Send, MessageCircle, Video, Headphones, Users, Globe2, ExternalLink } from 'lucide-react'
import { adminApi } from '@/lib/api'

// Componente específico para el editor de precios
const PricingEditor = ({ content, updateContent }: { content: any, updateContent: any }) => {
    const [plans, setPlans] = useState<any[]>([])
    const [loadingPlans, setLoadingPlans] = useState(true)
    
    // Cargar planes cuando se abre el modal
    useEffect(() => {
        const loadPlans = async () => {
            try {
                const response = await adminApi.plans.list()
                setPlans(response.data)
            } catch (error) {
                console.error('Error loading plans:', error)
            } finally {
                setLoadingPlans(false)
            }
        }
        loadPlans()
    }, [])
    
    const updatePlan = async (planId: number, field: string, value: any) => {
        try {
            await adminApi.plans.update(planId, { [field]: value })
            
            // Si se está marcando como popular, desmarcar todos los otros
            if (field === 'is_popular' && value === true) {
                // Actualizar estado local: quitar popular de todos y asignar solo al seleccionado
                setPlans(prev => prev.map(plan => ({
                    ...plan,
                    is_popular: plan.id === planId
                })))
                
                // Actualizar en el backend: desmarcar todos los otros planes
                const otherPlans = plans.filter(plan => plan.id !== planId && plan.is_popular)
                for (const otherPlan of otherPlans) {
                    try {
                        await adminApi.plans.update(otherPlan.id, { is_popular: false })
                    } catch (error) {
                        console.error(`Error removing popular from plan ${otherPlan.id}:`, error)
                    }
                }
            } else {
                // Actualizar estado local normalmente para otros campos
                setPlans(prev => prev.map(plan => 
                    plan.id === planId ? { ...plan, [field]: value } : plan
                ))
            }
        } catch (error) {
            console.error('Error updating plan:', error)
        }
    }

    const addNewPlan = async () => {
        try {
            const newPlan = {
                name: `Nuevo Plan ${plans.length + 1}`,
                slug: `nuevo-plan-${plans.length + 1}`,
                description: 'Descripción del nuevo plan',
                price_monthly: 5.0,
                price_yearly: 50.0,
                monthly_savings: 1.67,
                max_users: 100,
                max_courses: 50,
                storage_gb: 100,
                api_requests_limit: 5000,
                features: ['Funcionalidad básica', 'Soporte por email'],
                color_primary: '#3B82F6',
                color_secondary: '#EBF4FF',
                is_active: true,
                is_popular: false,
                display_order: plans.length + 1
            }
            
            const response = await adminApi.plans.create(newPlan)
            setPlans(prev => [...prev, response.data])
            console.log('✅ Plan creado exitosamente')
        } catch (error) {
            console.error('Error creating plan:', error)
            alert('❌ Error al crear el plan')
        }
    }

    const deletePlan = async (planId: number) => {
        const plan = plans.find(p => p.id === planId)
        if (!plan) return

        const confirmDelete = window.confirm(
            `¿Estás seguro de que quieres eliminar el plan "${plan.name}"?\n\nEsta acción no se puede deshacer.`
        )
        
        if (confirmDelete) {
            try {
                await adminApi.plans.delete(planId)
                setPlans(prev => prev.filter(plan => plan.id !== planId))
                console.log('✅ Plan eliminado exitosamente')
            } catch (error) {
                console.error('Error deleting plan:', error)
                alert('❌ Error al eliminar el plan')
            }
        }
    }

    const duplicatePlan = async (planId: number) => {
        try {
            const originalPlan = plans.find(p => p.id === planId)
            if (!originalPlan) return

            const duplicatedPlan = {
                ...originalPlan,
                name: `${originalPlan.name} (Copia)`,
                slug: `${originalPlan.slug}-copia-${Date.now()}`,
                is_popular: false, // Las copias nunca son populares por defecto
                display_order: plans.length + 1
            }
            
            // Quitar el ID para crear un nuevo registro
            delete duplicatedPlan.id
            delete duplicatedPlan.created_at
            delete duplicatedPlan.updated_at
            
            const response = await adminApi.plans.create(duplicatedPlan)
            setPlans(prev => [...prev, response.data])
            console.log('✅ Plan duplicado exitosamente')
        } catch (error) {
            console.error('Error duplicating plan:', error)
            alert('❌ Error al duplicar el plan')
        }
    }
    
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    💰 Editor de Planes y Precios
                </h3>
                <p className="text-blue-700 text-sm">
                    Configura los planes de servicio, precios y características.
                </p>
            </div>

            {/* Configuración de etiquetas */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Etiqueta Mensual
                    </label>
                    <input
                        type="text"
                        value={content.pricing_monthly_label || ''}
                        onChange={(e) => updateContent('pricing_monthly_label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Mensual"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Etiqueta Anual
                    </label>
                    <input
                        type="text"
                        value={content.pricing_yearly_label || ''}
                        onChange={(e) => updateContent('pricing_yearly_label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Anual"
                    />
                </div>
            </div>

            {/* Editor de planes */}
            <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Planes de Servicio</h4>
                    <div className="flex items-center space-x-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1">
                            <p className="text-xs text-amber-700 font-medium">
                                💡 Solo un plan puede ser "Más Popular"
                            </p>
                        </div>
                        <button
                            onClick={addNewPlan}
                            className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Plan
                        </button>
                    </div>
                </div>
                
                {loadingPlans ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Cargando planes...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {plans.map((plan) => (
                            <div key={plan.id} className="bg-gray-50 rounded-lg p-4 border">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                                    <div className="flex items-center space-x-2">
                                        <label className={`flex items-center px-3 py-1 rounded-md border transition-all duration-200 cursor-pointer ${
                                            plan.is_popular 
                                                ? 'bg-primary-50 border-primary-200 text-primary-700' 
                                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}>
                                            <input
                                                type="radio"
                                                name="popular-plan"
                                                checked={plan.is_popular || false}
                                                onChange={(e) => updatePlan(plan.id, 'is_popular', e.target.checked)}
                                                className="mr-2 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium">⭐ Más Popular</span>
                                        </label>
                                        
                                        {/* Botones de acción */}
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => duplicatePlan(plan.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Duplicar plan"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => deletePlan(plan.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Eliminar plan"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre del Plan
                                        </label>
                                        <input
                                            type="text"
                                            value={plan.name || ''}
                                            onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <input
                                            type="text"
                                            value={plan.description || ''}
                                            onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio Mensual (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={plan.price_monthly || ''}
                                            onChange={(e) => updatePlan(plan.id, 'price_monthly', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio Anual (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={plan.price_yearly || ''}
                                            onChange={(e) => updatePlan(plan.id, 'price_yearly', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ahorro Mensual (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={plan.monthly_savings || ''}
                                            onChange={(e) => updatePlan(plan.id, 'monthly_savings', parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Límites y capacidades */}
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Máx. Usuarios
                                        </label>
                                        <input
                                            type="number"
                                            value={plan.max_users || ''}
                                            onChange={(e) => updatePlan(plan.id, 'max_users', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Máx. Cursos
                                        </label>
                                        <input
                                            type="number"
                                            value={plan.max_courses || ''}
                                            onChange={(e) => updatePlan(plan.id, 'max_courses', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Almacenamiento (GB)
                                        </label>
                                        <input
                                            type="number"
                                            value={plan.storage_gb || ''}
                                            onChange={(e) => updatePlan(plan.id, 'storage_gb', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            API Requests/mes
                                        </label>
                                        <input
                                            type="number"
                                            value={plan.api_requests_limit || ''}
                                            onChange={(e) => updatePlan(plan.id, 'api_requests_limit', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Configuración de estado y orden */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={plan.is_active || false}
                                                onChange={(e) => updatePlan(plan.id, 'is_active', e.target.checked)}
                                                className="mr-2 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Plan Activo</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Orden de Visualización
                                        </label>
                                        <input
                                            type="number"
                                            value={plan.display_order || ''}
                                            onChange={(e) => updatePlan(plan.id, 'display_order', parseInt(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Color Principal
                                        </label>
                                        <input
                                            type="color"
                                            value={plan.color_primary || '#3B82F6'}
                                            onChange={(e) => updatePlan(plan.id, 'color_primary', e.target.value)}
                                            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Función para sincronizar stats entre páginas
const syncStatsAcrossPages = async (stats: any[], isGlobalStats: boolean = true) => {
    try {
        if (isGlobalStats) {
            // Sincronizar global_stats (Historia -> Clientes y Company)
            
            // Actualizar en Clientes (usar las mismas stats para hero)
            try {
                const clientsResponse = await adminApi.getPageContent('clients')
                const clientsContent = clientsResponse.data.content_json
                clientsContent.stats = stats // Hero usa stats generales
                await adminApi.updatePageContent('clients', {
                    content_json: clientsContent
                })
                console.log('✅ Stats sincronizadas en Clientes')
            } catch (err) {
                console.warn('⚠️ No se pudo sincronizar con Clientes:', err)
            }

            // Actualizar en Company page
            try {
                const companyResponse = await adminApi.getPageContent('company')
                const companyContent = companyResponse.data.content_json
                companyContent.global_stats = stats
                await adminApi.updatePageContent('company', {
                    content_json: companyContent
                })
                console.log('✅ Global stats sincronizadas en Company')
            } catch (err) {
                console.warn('⚠️ No se pudo sincronizar con Company:', err)
            }
        } else {
            // Sincronizar success_metrics (Clientes -> Company)
            try {
                const companyResponse = await adminApi.getPageContent('company')
                const companyContent = companyResponse.data.content_json
                companyContent.success_metrics = stats
                await adminApi.updatePageContent('company', {
                    content_json: companyContent
                })
                console.log('✅ Success metrics sincronizadas en Company')
            } catch (err) {
                console.warn('⚠️ No se pudo sincronizar success metrics con Company:', err)
            }
        }
    } catch (error) {
        console.error('❌ Error en sincronización:', error)
    }
}

interface UniversalSectionEditModalProps {
    isOpen: boolean
    onClose: () => void
    sectionType: string
    sectionName: string
    pageKey: string
    initialContent: any
    onSave: () => Promise<void>
    isSaving?: boolean
}

export default function UniversalSectionEditModal({
    isOpen,
    onClose,
    sectionType,
    sectionName,
    pageKey,
    initialContent,
    onSave,
    isSaving = false
}: UniversalSectionEditModalProps) {
    
    const [content, setContent] = useState<any>({})

    // Actualizar contenido cuando cambie initialContent
    useEffect(() => {
        if (initialContent?.content_json) {
            setContent(initialContent.content_json)
        }
    }, [initialContent])

    if (!isOpen) return null

    const handleSave = async () => {
        // Estado de guardado manejado por el parent
        try {
            // Actualizar el contenido completo
            await adminApi.updatePageContent(pageKey, {
                title: initialContent.title,
                content_json: content,
                meta_title: initialContent.meta_title,
                meta_description: initialContent.meta_description,
                meta_keywords: initialContent.meta_keywords,
                is_active: initialContent.is_active
            })

            // 🔄 SINCRONIZACIÓN AUTOMÁTICA DE STATS
            if (pageKey === 'history' && sectionType === 'impact' && content.stats) {
                console.log('🔄 Sincronizando stats de Historia con otras páginas...')
                await syncStatsAcrossPages(content.stats, true)
            } else if (pageKey === 'clients' && sectionType === 'metrics' && content.success_metrics) {
                console.log('🔄 Sincronizando métricas de Clientes con Company...')
                await syncStatsAcrossPages(content.success_metrics, false)
            } else if (pageKey === 'company') {
                // Sincronizar desde Company hacia Historia y Clientes
                if (content.global_stats) {
                    console.log('🔄 Sincronizando global_stats desde Company...')
                    // Actualizar Historia
                    try {
                        const historyResponse = await adminApi.getPageContent('history')
                        const historyContent = historyResponse.data.content_json
                        historyContent.stats = content.global_stats
                        await adminApi.updatePageContent('history', {
                            content_json: historyContent
                        })
                        console.log('✅ Stats sincronizadas en Historia')
                    } catch (err) {
                        console.warn('⚠️ No se pudo sincronizar con Historia:', err)
                    }
                    
                    // Actualizar Clientes
                    try {
                        const clientsResponse = await adminApi.getPageContent('clients')
                        const clientsContent = clientsResponse.data.content_json
                        clientsContent.stats = content.global_stats
                        await adminApi.updatePageContent('clients', {
                            content_json: clientsContent
                        })
                        console.log('✅ Stats sincronizadas en Clientes')
                    } catch (err) {
                        console.warn('⚠️ No se pudo sincronizar con Clientes:', err)
                    }
                }
                
                if (content.success_metrics) {
                    console.log('🔄 Sincronizando success_metrics desde Company...')
                    // Actualizar sección métricas en Clientes
                    try {
                        const clientsResponse = await adminApi.getPageContent('clients')
                        const clientsContent = clientsResponse.data.content_json
                        clientsContent.success_metrics = content.success_metrics
                        await adminApi.updatePageContent('clients', {
                            content_json: clientsContent
                        })
                        console.log('✅ Success metrics sincronizadas en Clientes')
                    } catch (err) {
                        console.warn('⚠️ No se pudo sincronizar success metrics con Clientes:', err)
                    }
                }
            }
            
            // Llamar onSave ANTES de cerrar el modal para recargar contenido
            await onSave()
            onClose()
            
            // Mostrar notificación temporal
            const notification = document.createElement('div')
            notification.innerHTML = '✅ Sección actualizada exitosamente'
            notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg'
            document.body.appendChild(notification)
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 3000)

            // Llamar al callback del parent para actualizar la página
            await onSave()
        } catch (error) {
            console.error('Error saving section:', error)
            alert('❌ Error al guardar la sección')
        }
    }

    const updateContent = (field: string, value: any) => {
        setContent((prev: any) => {
            const newContent = { ...prev }
            
            // Manejar campos anidados como "hero.title"
            if (field.includes('.')) {
                const [section, subField] = field.split('.')
                if (!newContent[section]) newContent[section] = {}
                newContent[section][subField] = value
            } else {
                newContent[field] = value
            }
            
            return newContent
        })
    }

    // Funciones helper para Historia - Milestones
    const addMilestone = () => {
        const newMilestone = {
            year: '2024',
            title: 'Nuevo Hito',
            description: 'Descripción del hito',
            color: 'bg-blue-500'
        }
        updateContent('milestones', [...(content.milestones || []), newMilestone])
    }

    const updateMilestone = (index: number, field: string, value: string) => {
        const milestones = [...(content.milestones || [])]
        milestones[index] = { ...milestones[index], [field]: value }
        updateContent('milestones', milestones)
    }

    const removeMilestone = (index: number) => {
        const milestones = content.milestones?.filter((_: any, i: number) => i !== index) || []
        updateContent('milestones', milestones)
    }

    // Funciones helper para Historia - Stats
    const addStat = () => {
        const newStat = {
            number: '100+',
            label: 'Nueva Métrica',
            description: 'Descripción de la estadística'
        }
        updateContent('stats', [...(content.stats || []), newStat])
    }

    const updateStat = (index: number, field: string, value: string) => {
        const stats = [...(content.stats || [])]
        stats[index] = { ...stats[index], [field]: value }
        updateContent('stats', stats)
    }

    const removeStat = (index: number) => {
        const stats = content.stats?.filter((_: any, i: number) => i !== index) || []
        updateContent('stats', stats)
    }

    const renderSectionEditor = () => {
        const sectionData = content[sectionType] || {}

        switch (sectionType) {
            case 'hero':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={content.hero_title || ''}
                                onChange={(e) => updateContent('hero_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Título del hero"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={content.hero_subtitle || ''}
                                onChange={(e) => updateContent('hero_subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Subtítulo del hero"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                rows={4}
                                value={content.hero_description || ''}
                                onChange={(e) => updateContent('hero_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción del hero"
                            />
                        </div>
                    </div>
                )

            case 'mission':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Misión
                            </label>
                            <textarea
                                rows={4}
                                value={content.mission || ''}
                                onChange={(e) => updateContent('mission', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Texto de la misión"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de la Misión
                            </label>
                            <textarea
                                rows={3}
                                value={content.mission_description || ''}
                                onChange={(e) => updateContent('mission_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción adicional de la misión"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visión
                            </label>
                            <textarea
                                rows={4}
                                value={content.vision || ''}
                                onChange={(e) => updateContent('vision', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Texto de la visión"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de la Visión
                            </label>
                            <textarea
                                rows={3}
                                value={content.vision_description || ''}
                                onChange={(e) => updateContent('vision_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción adicional de la visión"
                            />
                        </div>
                    </div>
                )

            case 'contact_info':
                // Lista de iconos disponibles para la información de contacto
                const availableIcons = [
                    { name: 'Mail', component: Mail, label: 'Email' },
                    { name: 'Phone', component: Phone, label: 'Teléfono' },
                    { name: 'Smartphone', component: Smartphone, label: 'WhatsApp' },
                    { name: 'MessageCircle', component: MessageCircle, label: 'Telegram' },
                    { name: 'Send', component: Send, label: 'Mensaje Directo' },
                    { name: 'MapPin', component: MapPin, label: 'Ubicación' },
                    { name: 'Building', component: Building, label: 'Oficina' },
                    { name: 'Clock', component: Clock, label: 'Horario' },
                    { name: 'Calendar', component: Calendar, label: 'Calendario' },
                    { name: 'Video', component: Video, label: 'Videollamada' },
                    { name: 'MessageSquare', component: MessageSquare, label: 'Chat en Vivo' },
                    { name: 'Headphones', component: Headphones, label: 'Soporte' },
                    { name: 'Users', component: Users, label: 'Reuniones' },
                    { name: 'Wifi', component: Wifi, label: 'Online' },
                    { name: 'Globe2', component: Globe2, label: 'Sitio Web' },
                    { name: 'ExternalLink', component: ExternalLink, label: 'Enlace Externo' }
                ]

                // Estructura de datos para la información de contacto
                const contactItems = content.contact_items || [
                    {
                        id: 'email',
                        icon: 'Mail',
                        title: 'Email',
                        value: 'contacto@sevp.com',
                        description: 'Respuesta en 24 horas'
                    },
                    {
                        id: 'phone',
                        icon: 'Phone',
                        title: 'Teléfono',
                        value: '+51 1 234-5678',
                        description: 'Lun - Vie, 9am - 6pm'
                    },
                    {
                        id: 'whatsapp',
                        icon: 'Smartphone',
                        title: 'WhatsApp',
                        value: '+51 999 888 777',
                        description: 'Respuesta inmediata'
                    },
                    {
                        id: 'address',
                        icon: 'MapPin',
                        title: 'Oficina',
                        value: 'Lima, Perú',
                        description: 'San Isidro, Lima 27'
                    }
                ]

                const addContactItem = () => {
                    const newItems = [...contactItems, {
                        id: `contact_${Date.now()}`,
                        icon: 'MessageSquare',
                        title: 'Nueva información',
                        value: 'Valor',
                        description: 'Descripción'
                    }]
                    updateContent('contact_items', newItems)
                }

                const updateContactItem = (index: number, field: string, value: string) => {
                    const newItems = [...contactItems]
                    newItems[index] = { ...newItems[index], [field]: value }
                    updateContent('contact_items', newItems)
                }

                const removeContactItem = (index: number) => {
                    const newItems = contactItems.filter((_, i) => i !== index)
                    updateContent('contact_items', newItems)
                }

                const getIconComponent = (iconName: string) => {
                    const iconObj = availableIcons.find(icon => icon.name === iconName)
                    return iconObj ? iconObj.component : MessageSquare
                }

                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                📞 Editor de Información de Contacto
                            </h3>
                            <p className="text-green-700 text-sm">
                                Gestiona toda la información de contacto con iconos personalizables.
                            </p>
                        </div>

                        {/* Lista de información de contacto */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Información de Contacto</h4>
                                <button
                                    onClick={addContactItem}
                                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Información
                                </button>
                            </div>

                            <div className="space-y-4">
                                {contactItems.map((item, index) => {
                                    const IconComponent = getIconComponent(item.icon)
                                    return (
                                        <div key={item.id || index} className="bg-gray-50 rounded-lg p-4 border">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                                                        <IconComponent className="h-5 w-5 text-primary-600" />
                                                    </div>
                                                    <h5 className="font-medium text-gray-900">{item.title}</h5>
                                                </div>
                                                <button
                                                    onClick={() => removeContactItem(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Eliminar información"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Icono
                                                    </label>
                                                    <select
                                                        value={item.icon}
                                                        onChange={(e) => updateContactItem(index, 'icon', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    >
                                                        {availableIcons.map((iconOption) => (
                                                            <option key={iconOption.name} value={iconOption.name}>
                                                                {iconOption.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Título
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.title || ''}
                                                        onChange={(e) => updateContactItem(index, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                        placeholder="Título"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Valor Principal
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.value || ''}
                                                        onChange={(e) => updateContactItem(index, 'value', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                        placeholder="Valor principal (email, teléfono, dirección, etc.)"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Descripción
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.description || ''}
                                                        onChange={(e) => updateContactItem(index, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                        placeholder="Descripción adicional"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {contactItems.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📞</div>
                                    <p>No hay información de contacto.</p>
                                    <p className="text-sm">Haz clic en "Agregar Información" para comenzar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )

            case 'values':
                const values = content.values || []
                const valueIcons = [
                    { emoji: '💎', name: 'Diamante' },
                    { emoji: '🎆', name: 'Fuegos artificiales' },
                    { emoji: '⭐', name: 'Estrella' },
                    { emoji: '🚀', name: 'Cohete' },
                    { emoji: '💪', name: 'Músculo' },
                    { emoji: '❤️', name: 'Corazón' },
                    { emoji: '🤝', name: 'Apretón de manos' },
                    { emoji: '🏆', name: 'Trofeo' },
                    { emoji: '💡', name: 'Bombilla' },
                    { emoji: '🌱', name: 'Brote' },
                    { emoji: '🔥', name: 'Fuego' },
                    { emoji: '⚡', name: 'Rayo' },
                    { emoji: '🎯', name: 'Diana' },
                    { emoji: '🥰', name: 'Cara enamorada' },
                    { emoji: '🦜', name: 'Genio' },
                    { emoji: '🙏', name: 'Manos juntas' },
                    { emoji: '🌍', name: 'Mundo' },
                    { emoji: '🔍', name: 'Lupa' },
                    { emoji: '⚙️', name: 'Engranaje' },
                    { emoji: '🌈', name: 'Arcoiris' }
                ]
                
                return (
                    <div className="space-y-6">
                        {/* Títulos de la sección */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de la Sección</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.values_title || ''}
                                        onChange={(e) => updateContent('values_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Nuestros Valores"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtítulo de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.values_description || ''}
                                        onChange={(e) => updateContent('values_description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Los principios que guían cada decisión que tomamos"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Lista de valores */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Valores de la Empresa</h3>
                            <button
                                onClick={() => {
                                    const newValues = [...values, {
                                        title: 'Nuevo Valor',
                                        description: 'Descripción del valor',
                                        icon: '💎'
                                    }]
                                    updateContent('values', newValues)
                                }}
                                className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar Valor
                            </button>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {values.map((value: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-sm font-medium text-gray-500">Valor #{index + 1}</span>
                                        <button
                                            onClick={() => {
                                                const newValues = values.filter((_: any, i: number) => i !== index)
                                                updateContent('values', newValues)
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-2">
                                            Seleccionar Icono
                                        </label>
                                        <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                                            {valueIcons.map((iconOption, iconIndex) => (
                                                <button
                                                    key={iconIndex}
                                                    type="button"
                                                    onClick={() => {
                                                        const newValues = [...values]
                                                        newValues[index] = { ...newValues[index], icon: iconOption.emoji }
                                                        updateContent('values', newValues)
                                                    }}
                                                    className={`p-2 text-xl rounded hover:bg-gray-200 transition-colors ${
                                                        value.icon === iconOption.emoji ? 'bg-primary-100 ring-2 ring-primary-500' : ''
                                                    }`}
                                                    title={iconOption.name}
                                                >
                                                    {iconOption.emoji}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={value.icon || ''}
                                                onChange={(e) => {
                                                    const newValues = [...values]
                                                    newValues[index] = { ...newValues[index], icon: e.target.value }
                                                    updateContent('values', newValues)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="O escribe tu propio emoji: 💎"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Título
                                            </label>
                                            <input
                                                type="text"
                                                value={value.title || ''}
                                                onChange={(e) => {
                                                    const newValues = [...values]
                                                    newValues[index] = { ...newValues[index], title: e.target.value }
                                                    updateContent('values', newValues)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Título del valor"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={value.description || ''}
                                            onChange={(e) => {
                                                const newValues = [...values]
                                                newValues[index] = { ...newValues[index], description: e.target.value }
                                                updateContent('values', newValues)
                                            }}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            placeholder="Descripción del valor"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {values.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No hay valores agregados</p>
                                <p className="text-sm">Haz clic en "Agregar Valor" para comenzar</p>
                            </div>
                        )}
                    </div>
                )

            case 'team':
                const team = content.team || []
                return (
                    <div className="space-y-6">
                        {/* Títulos de la sección */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de la Sección</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.team_title || ''}
                                        onChange={(e) => updateContent('team_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Nuestro Equipo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtítulo de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.team_description || ''}
                                        onChange={(e) => updateContent('team_description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Profesionales apasionados por la educación y la tecnología"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Lista de miembros */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Miembros del Equipo</h3>
                            <button
                                onClick={() => {
                                    const newTeam = [...team, {
                                        name: 'Nuevo Miembro',
                                        position: 'Cargo',
                                        bio: 'Biografía breve...',
                                        image: '',
                                        linkedin: '',
                                        email: ''
                                    }]
                                    updateContent('team', newTeam)
                                }}
                                className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar Miembro
                            </button>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {team.map((member: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-sm font-medium text-gray-500">Miembro #{index + 1}</span>
                                        <button
                                            onClick={() => {
                                                const newTeam = team.filter((_: any, i: number) => i !== index)
                                                updateContent('team', newTeam)
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={member.name || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], name: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Nombre completo"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Cargo
                                            </label>
                                            <input
                                                type="text"
                                                value={member.position || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], position: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="CEO, CTO, etc."
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Biografía
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={member.bio || ''}
                                            onChange={(e) => {
                                                const newTeam = [...team]
                                                newTeam[index] = { ...newTeam[index], bio: e.target.value }
                                                updateContent('team', newTeam)
                                            }}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            placeholder="Biografía breve del miembro del equipo"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                LinkedIn (opcional)
                                            </label>
                                            <input
                                                type="url"
                                                value={member.linkedin || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], linkedin: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Email (opcional)
                                            </label>
                                            <input
                                                type="email"
                                                value={member.email || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], email: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="email@empresa.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {team.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No hay miembros del equipo agregados</p>
                                <p className="text-sm">Haz clic en "Agregar Miembro" para comenzar</p>
                            </div>
                        )}
                    </div>
                )

            case 'features':
                const features = content.features || []
                
                const addFeature = () => {
                    const newFeatures = [...features, {
                        title: 'Nueva característica',
                        description: 'Descripción de la característica',
                        icon: '🚀',
                        is_active: true
                    }]
                    updateContent('features', newFeatures)
                }

                const updateFeature = (index: number, field: string, value: any) => {
                    const newFeatures = [...features]
                    newFeatures[index] = { ...newFeatures[index], [field]: value }
                    updateContent('features', newFeatures)
                }

                const removeFeature = (index: number) => {
                    const newFeatures = features.filter((_: any, i: number) => i !== index)
                    updateContent('features', newFeatures)
                }

                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                ⭐ Editor de Características
                            </h3>
                            <p className="text-blue-700 text-sm">
                                Gestiona las características principales del sistema que se muestran en la homepage.
                            </p>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Características</h4>
                                <button
                                    onClick={addFeature}
                                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Característica
                                </button>
                            </div>

                            <div className="space-y-4">
                                {features.map((feature: any, index: number) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium text-gray-900">Característica #{index + 1}</h5>
                                            <button
                                                onClick={() => removeFeature(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Eliminar característica"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    value={feature.title || ''}
                                                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    placeholder="Título de la característica"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Icono
                                                </label>
                                                <input
                                                    type="text"
                                                    value={feature.icon || ''}
                                                    onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    placeholder="🚀 (emoji o código de icono)"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Descripción
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={feature.description || ''}
                                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                placeholder="Descripción detallada de la característica..."
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={feature.is_active !== false}
                                                    onChange={(e) => updateFeature(index, 'is_active', e.target.checked)}
                                                    className="mr-2 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Activa</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {features.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">⭐</div>
                                    <p>No hay características configuradas.</p>
                                    <p className="text-sm">Haz clic en "Agregar Característica" para comenzar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )

            case 'stats':
                const stats = content.stats || {}
                
                const updateStat = (key: string, value: string) => {
                    updateContent(`stats.${key}`, value)
                }

                const addStat = () => {
                    const newKey = `stat_${Date.now()}`
                    updateStat(newKey, '0')
                }

                const removeStat = (key: string) => {
                    const newStats = { ...stats }
                    delete newStats[key]
                    updateContent('stats', newStats)
                }

                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-green-900 mb-2">
                                📊 Editor de Estadísticas
                            </h3>
                            <p className="text-green-700 text-sm">
                                Gestiona las estadísticas de impacto que se muestran en la homepage.
                            </p>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Estadísticas</h4>
                                <button
                                    onClick={addStat}
                                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Estadística
                                </button>
                            </div>

                            <div className="space-y-4">
                                {Object.entries(stats).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium text-gray-900">Estadística: {key}</h5>
                                            <button
                                                onClick={() => removeStat(key)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Eliminar estadística"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Clave
                                                </label>
                                                <input
                                                    type="text"
                                                    value={key}
                                                    onChange={(e) => {
                                                        const newStats = { ...stats }
                                                        delete newStats[key]
                                                        newStats[e.target.value] = value
                                                        updateContent('stats', newStats)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    placeholder="clave_estadistica"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Valor
                                                </label>
                                                <input
                                                    type="text"
                                                    value={value as string}
                                                    onChange={(e) => updateStat(key, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    placeholder="1000+"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {Object.keys(stats).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">📊</div>
                                    <p>No hay estadísticas configuradas.</p>
                                    <p className="text-sm">Haz clic en "Agregar Estadística" para comenzar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )

            case 'cta':
                const cta = content.call_to_action || {}
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Llamada a la Acción</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={cta.title || ''}
                                onChange={(e) => updateContent('call_to_action.title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="¿Quieres formar parte de nuestra misión?"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                rows={3}
                                value={cta.description || ''}
                                onChange={(e) => updateContent('call_to_action.description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Estamos siempre buscando personas talentosas..."
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto Botón Principal
                                </label>
                                <input
                                    type="text"
                                    value={cta.primary_button_text || ''}
                                    onChange={(e) => updateContent('call_to_action.primary_button_text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Únete al Equipo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace Botón Principal
                                </label>
                                <input
                                    type="url"
                                    value={cta.primary_button_link || ''}
                                    onChange={(e) => updateContent('call_to_action.primary_button_link', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto Botón Secundario
                                </label>
                                <input
                                    type="text"
                                    value={cta.secondary_button_text || ''}
                                    onChange={(e) => updateContent('call_to_action.secondary_button_text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Contáctanos"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace Botón Secundario
                                </label>
                                <input
                                    type="url"
                                    value={cta.secondary_button_link || ''}
                                    onChange={(e) => updateContent('call_to_action.secondary_button_link', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                    </div>
                )

            // Editores para página Historia
            case 'intro':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de la Introducción
                            </label>
                            <input
                                type="text"
                                value={content.intro_title || ''}
                                onChange={(e) => updateContent('intro_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Título de la introducción"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primer Párrafo (Descripción Principal)
                            </label>
                            <textarea
                                rows={4}
                                value={content.intro_description || ''}
                                onChange={(e) => updateContent('intro_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción principal de la introducción a la historia"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Segundo Párrafo (Descripción Adicional)
                            </label>
                            <textarea
                                rows={4}
                                value={content.intro_subtitle || ''}
                                onChange={(e) => updateContent('intro_subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción adicional o continuación de la historia"
                            />
                        </div>
                    </div>
                )

            case 'timeline':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de la Línea de Tiempo
                            </label>
                            <input
                                type="text"
                                value={content.timeline_title || ''}
                                onChange={(e) => updateContent('timeline_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Hitos Importantes"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de la Línea de Tiempo
                            </label>
                            <textarea
                                rows={3}
                                value={content.timeline_description || ''}
                                onChange={(e) => updateContent('timeline_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Los momentos que definieron nuestro camino hacia la excelencia educativa"
                            />
                        </div>
                        
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 pt-4 border-t">Hitos</h4>
                        {(content.milestones || []).map((milestone: any, index: number) => (
                            <div key={index} className="border p-4 rounded-md space-y-3 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <h5 className="font-medium text-gray-900">Hito #{index + 1}</h5>
                                    <button onClick={() => removeMilestone(index)} className="text-red-600 hover:text-red-800">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                        <input
                                            type="text"
                                            value={milestone.year || ''}
                                            onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="2024"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                        <input
                                            type="text"
                                            value={milestone.color || ''}
                                            onChange={(e) => updateMilestone(index, 'color', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="bg-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input
                                        type="text"
                                        value={milestone.title || ''}
                                        onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Título del hito"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        value={milestone.description || ''}
                                        onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        rows={2}
                                        placeholder="Descripción del hito"
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={addMilestone} className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                            <Plus className="h-5 w-5" /> Agregar Hito
                        </button>
                    </div>
                )

            case 'impact':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de Números de Impacto
                            </label>
                            <input
                                type="text"
                                value={content.impact_title || ''}
                                onChange={(e) => updateContent('impact_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Nuestro Impacto en Números"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de Números de Impacto
                            </label>
                            <textarea
                                rows={3}
                                value={content.impact_description || ''}
                                onChange={(e) => updateContent('impact_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Los resultados de años de dedicación y trabajo arduo"
                            />
                        </div>
                        
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 pt-4 border-t">Estadísticas</h4>
                        {(content.stats || []).map((stat: any, index: number) => (
                            <div key={index} className="border p-4 rounded-md space-y-3 bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <h5 className="font-medium text-gray-900">Estadística #{index + 1}</h5>
                                    <button onClick={() => removeStat(index)} className="text-red-600 hover:text-red-800">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                    <input
                                        type="text"
                                        value={stat.number || ''}
                                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="100+"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                                    <input
                                        type="text"
                                        value={stat.label || ''}
                                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Instituciones Educativas"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        value={stat.description || ''}
                                        onChange={(e) => updateStat(index, 'description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        rows={2}
                                        placeholder="Descripción de la estadística"
                                    />
                                </div>
                            </div>
                        ))}
                        <button onClick={addStat} className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                            <Plus className="h-5 w-5" /> Agregar Estadística
                        </button>
                    </div>
                )

            case 'future':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de Visión de Futuro
                            </label>
                            <input
                                type="text"
                                value={content.future_title || ''}
                                onChange={(e) => updateContent('future_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Mirando hacia el Futuro"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de Visión de Futuro
                            </label>
                            <textarea
                                rows={4}
                                value={content.future_description || ''}
                                onChange={(e) => updateContent('future_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Estamos apenas comenzando. Nuestro objetivo para los próximos años..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción Adicional
                            </label>
                            <textarea
                                rows={4}
                                value={content.future_vision || ''}
                                onChange={(e) => updateContent('future_vision', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Con nuevas tecnologías como IA, realidad virtual y análisis predictivo..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto Botón Principal
                                </label>
                                <input
                                    type="text"
                                    value={content.future_button_text || ''}
                                    onChange={(e) => updateContent('future_button_text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Conoce al Equipo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace Botón Principal
                                </label>
                                <input
                                    type="url"
                                    value={content.future_button_link || ''}
                                    onChange={(e) => updateContent('future_button_link', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/nosotros"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto Botón Secundario
                                </label>
                                <input
                                    type="text"
                                    value={content.future_secondary_text || ''}
                                    onChange={(e) => updateContent('future_secondary_text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Únete a Nosotros"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace Botón Secundario
                                </label>
                                <input
                                    type="url"
                                    value={content.future_secondary_link || ''}
                                    onChange={(e) => updateContent('future_secondary_link', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                    </div>
                )

            // Editores para página Clientes
            case 'client_types':
                // Limpiar datos antiguos y usar estructura nueva
                const clientTypes = Array.isArray(content.clients) && content.clients.length > 0 && content.clients[0].title 
                    ? content.clients 
                    : [
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
                
                const addClientType = () => {
                    const newClientType = {
                        title: '',
                        description: '',
                        icon: 'Users',
                        count: '0+',
                        color: 'bg-blue-500',
                        examples: []
                    }
                    updateContent('clients', [...clientTypes, newClientType])
                }
                
                const updateClientType = (index: number, field: string, value: any) => {
                    const updatedTypes = [...clientTypes]
                    updatedTypes[index] = { ...updatedTypes[index], [field]: value }
                    updateContent('clients', updatedTypes)
                }
                
                const removeClientType = (index: number) => {
                    const updatedTypes = clientTypes.filter((_, i) => i !== index)
                    updateContent('clients', updatedTypes)
                }

                const resetToDefaults = () => {
                    const defaultTypes = [
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
                    updateContent('clients', defaultTypes)
                }

                const iconOptions = [
                    { value: 'GraduationCap', label: '🎓 Universidad' },
                    { value: 'School', label: '🏫 Colegio' },
                    { value: 'Building', label: '🏢 Empresa' },
                    { value: 'Users', label: '👥 Organización' },
                    { value: 'BookOpen', label: '📖 Instituto' },
                    { value: 'Award', label: '🏆 Academia' },
                    { value: 'Globe', label: '🌍 Internacional' },
                    { value: 'Heart', label: '❤️ ONG' }
                ]

                const colorOptions = [
                    { value: 'bg-blue-500', label: 'Azul', preview: '#3B82F6' },
                    { value: 'bg-green-500', label: 'Verde', preview: '#10B981' },
                    { value: 'bg-purple-500', label: 'Morado', preview: '#8B5CF6' },
                    { value: 'bg-orange-500', label: 'Naranja', preview: '#F97316' },
                    { value: 'bg-red-500', label: 'Rojo', preview: '#EF4444' },
                    { value: 'bg-yellow-500', label: 'Amarillo', preview: '#EAB308' },
                    { value: 'bg-pink-500', label: 'Rosa', preview: '#EC4899' },
                    { value: 'bg-indigo-500', label: 'Índigo', preview: '#6366F1' }
                ]
                
                return (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                🎨 Editor Completo de Tipos de Clientes
                            </h3>
                            <p className="text-blue-700 text-sm">
                                Controla completamente esta sección: iconos, colores, títulos, descripciones y ejemplos. 
                                Usa "🔄 Restablecer" para cargar tipos por defecto si tienes datos incompatibles.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título de la Sección
                                </label>
                                <input
                                    type="text"
                                    value={content.client_types_title || ''}
                                    onChange={(e) => updateContent('client_types_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Tipos de Clientes"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción de la Sección
                                </label>
                                <textarea
                                    rows={3}
                                    value={content.client_types_description || ''}
                                    onChange={(e) => updateContent('client_types_description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Descripción de los tipos de clientes"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Tipos de Clientes</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={resetToDefaults}
                                        className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
                                        title="Restablecer a tipos por defecto"
                                    >
                                        🔄 Restablecer
                                    </button>
                                    <button
                                        onClick={addClientType}
                                        className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Agregar Tipo
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {clientTypes.map((clientType: any, index: number) => (
                                    <div key={index} className="bg-gray-50 p-6 rounded-lg border">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-md font-semibold text-gray-800">Tipo {index + 1}</h4>
                                            <button
                                                onClick={() => removeClientType(index)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Eliminar tipo de cliente"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    value={clientType.title || ''}
                                                    onChange={(e) => updateClientType(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                    placeholder="ej. Universidades"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cantidad
                                                </label>
                                                <input
                                                    type="text"
                                                    value={clientType.count || ''}
                                                    onChange={(e) => updateClientType(index, 'count', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                    placeholder="ej. 250+"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Descripción
                                            </label>
                                            <textarea
                                                rows={3}
                                                value={clientType.description || ''}
                                                onChange={(e) => updateClientType(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Descripción del tipo de cliente"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Icono
                                                </label>
                                                <select
                                                    value={clientType.icon || 'Users'}
                                                    onChange={(e) => updateClientType(index, 'icon', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                >
                                                    {iconOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Color
                                                </label>
                                                <select
                                                    value={clientType.color || 'bg-blue-500'}
                                                    onChange={(e) => updateClientType(index, 'color', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                >
                                                    {colorOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div 
                                                        className="w-6 h-6 rounded border"
                                                        style={{ 
                                                            backgroundColor: colorOptions.find(c => c.value === clientType.color)?.preview || '#3B82F6' 
                                                        }}
                                                    ></div>
                                                    <span className="text-sm text-gray-600">Vista previa del color</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ejemplos (separados por comas)
                                            </label>
                                            <input
                                                type="text"
                                                value={(clientType.examples || []).join(', ')}
                                                onChange={(e) => updateClientType(index, 'examples', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Universidad Nacional, Instituto Tecnológico, Universidad Privada"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {clientTypes.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        No hay tipos de clientes configurados. Haz clic en "Agregar Tipo" para comenzar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )

            case 'testimonials':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de Testimonios
                            </label>
                            <input
                                type="text"
                                value={content.testimonials_title || ''}
                                onChange={(e) => updateContent('testimonials_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Testimonios"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de Testimonios
                            </label>
                            <textarea
                                rows={3}
                                value={content.testimonials_description || ''}
                                onChange={(e) => updateContent('testimonials_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción de testimonios"
                            />
                        </div>
                    </div>
                )

            case 'metrics':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de Métricas de Éxito
                            </label>
                            <input
                                type="text"
                                value={content.metrics_title || ''}
                                onChange={(e) => updateContent('metrics_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Métricas de Éxito"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de Métricas
                            </label>
                            <textarea
                                rows={3}
                                value={content.metrics_description || ''}
                                onChange={(e) => updateContent('metrics_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción de las métricas"
                            />
                        </div>
                    </div>
                )

            // Editores para página Precios
            case 'pricing':
                return <PricingEditor content={content} updateContent={updateContent} />

            case 'enterprise':
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-primary-900 mb-2">
                                🚀 Editor de Sección Empresarial
                            </h3>
                            <p className="text-primary-700 text-sm">
                                Personaliza la sección de llamada a la acción para planes empresariales.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título Principal
                                </label>
                                <input
                                    type="text"
                                    value={content.enterprise_title || ''}
                                    onChange={(e) => updateContent('enterprise_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="¿Necesitas algo más personalizado?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    rows={3}
                                    value={content.enterprise_description || ''}
                                    onChange={(e) => updateContent('enterprise_description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Descripción de los planes empresariales"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-md font-semibold text-gray-900 mb-4">Características Destacadas</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Característica 1
                                    </label>
                                    <input
                                        type="text"
                                        value={content.enterprise_feature1_number || ''}
                                        onChange={(e) => updateContent('enterprise_feature1_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                                        placeholder="24/7"
                                    />
                                    <input
                                        type="text"
                                        value={content.enterprise_feature1_text || ''}
                                        onChange={(e) => updateContent('enterprise_feature1_text', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Soporte Dedicado"
                                    />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Característica 2
                                    </label>
                                    <input
                                        type="text"
                                        value={content.enterprise_feature2_number || ''}
                                        onChange={(e) => updateContent('enterprise_feature2_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                                        placeholder="100%"
                                    />
                                    <input
                                        type="text"
                                        value={content.enterprise_feature2_text || ''}
                                        onChange={(e) => updateContent('enterprise_feature2_text', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Personalizable"
                                    />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Característica 3
                                    </label>
                                    <input
                                        type="text"
                                        value={content.enterprise_feature3_number || ''}
                                        onChange={(e) => updateContent('enterprise_feature3_number', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                                        placeholder="SLA"
                                    />
                                    <input
                                        type="text"
                                        value={content.enterprise_feature3_text || ''}
                                        onChange={(e) => updateContent('enterprise_feature3_text', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Garantizado"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-md font-semibold text-gray-900 mb-4">Botones de Acción</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Botón Principal
                                    </label>
                                    <input
                                        type="text"
                                        value={content.enterprise_button_primary || ''}
                                        onChange={(e) => updateContent('enterprise_button_primary', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Contactar Ventas"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Botón Secundario
                                    </label>
                                    <input
                                        type="text"
                                        value={content.enterprise_button_secondary || ''}
                                        onChange={(e) => updateContent('enterprise_button_secondary', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Ver Demo"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'faq':
                const faqs = content.faqs || [
                    {
                        question: '¿Puedo cambiar de plan en cualquier momento?',
                        answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento desde el panel de administración. Los cambios se aplicarán inmediatamente.'
                    },
                    {
                        question: '¿Ofrecen descuentos para instituciones sin fines de lucro?',
                        answer: 'Sí, ofrecemos descuentos especiales para instituciones educativas sin fines de lucro. Contacta a nuestro equipo de ventas para más información.'
                    },
                    {
                        question: '¿Qué incluye el soporte técnico?',
                        answer: 'Todos los planes incluyen soporte por email. Los planes Premium y Enterprise incluyen soporte telefónico y chat en vivo.'
                    },
                    {
                        question: '¿Hay período de prueba gratuito?',
                        answer: 'Sí, ofrecemos 14 días de prueba gratuita para que puedas explorar todas las funcionalidades antes de comprometerte.'
                    }
                ]

                const addFaq = () => {
                    const newFaqs = [...faqs, {
                        question: 'Nueva pregunta',
                        answer: 'Nueva respuesta'
                    }]
                    updateContent('faqs', newFaqs)
                }

                const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
                    const newFaqs = [...faqs]
                    newFaqs[index] = { ...newFaqs[index], [field]: value }
                    updateContent('faqs', newFaqs)
                }

                const removeFaq = (index: number) => {
                    const newFaqs = faqs.filter((_, i) => i !== index)
                    updateContent('faqs', newFaqs)
                }

                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-purple-900 mb-2">
                                ❓ Editor de Preguntas Frecuentes
                            </h3>
                            <p className="text-purple-700 text-sm">
                                Gestiona el título, descripción y todas las preguntas frecuentes.
                            </p>
                        </div>

                        {/* Configuración general */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título de Preguntas Frecuentes
                                </label>
                                <input
                                    type="text"
                                    value={content.faq_title || ''}
                                    onChange={(e) => updateContent('faq_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Preguntas Frecuentes"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción de FAQ
                                </label>
                                <textarea
                                    rows={3}
                                    value={content.faq_description || ''}
                                    onChange={(e) => updateContent('faq_description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Descripción de las preguntas frecuentes"
                                />
                            </div>
                        </div>

                        {/* Lista de FAQs */}
                        <div className="border-t pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-gray-900">Preguntas y Respuestas</h4>
                                <button
                                    onClick={addFaq}
                                    className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar FAQ
                                </button>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="font-medium text-gray-900">FAQ #{index + 1}</h5>
                                            <button
                                                onClick={() => removeFaq(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Eliminar FAQ"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Pregunta
                                                </label>
                                                <input
                                                    type="text"
                                                    value={faq.question || ''}
                                                    onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    placeholder="¿Cuál es tu pregunta?"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Respuesta
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={faq.answer || ''}
                                                    onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                    placeholder="Respuesta a la pregunta..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {faqs.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">❓</div>
                                    <p>No hay preguntas frecuentes.</p>
                                    <p className="text-sm">Haz clic en "Agregar FAQ" para comenzar.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )

            // Editores para página Contacto
            case 'form':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del Formulario
                            </label>
                            <input
                                type="text"
                                value={content.form_title || ''}
                                onChange={(e) => updateContent('form_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Envíanos un Mensaje"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción del Formulario
                            </label>
                            <textarea
                                rows={3}
                                value={content.form_description || ''}
                                onChange={(e) => updateContent('form_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Completa el formulario y nos pondremos en contacto contigo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Texto del Botón
                            </label>
                            <input
                                type="text"
                                value={content.form_button_text || ''}
                                onChange={(e) => updateContent('form_button_text', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enviar Mensaje"
                            />
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="p-8 text-center text-gray-500">
                        <h3 className="text-lg font-medium mb-2">Sección: {sectionName}</h3>
                        <p>Editor específico en desarrollo para esta sección.</p>
                        <p className="text-sm mt-2">Tipo: {sectionType}</p>
                    </div>
                )
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] shadow-lg rounded-md bg-white flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">
                        Editar {sectionName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderSectionEditor()}
                </div>
                
                {/* Footer */}
                <div className="flex justify-end space-x-4 p-6 border-t flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    )
}
