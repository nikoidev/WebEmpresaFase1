'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Calendar, Award, Users, Target } from 'lucide-react'

interface Milestone {
    id?: number
    year: string
    title: string
    description: string
    image_url?: string
    achievement_type: 'foundation' | 'expansion' | 'product' | 'award' | 'other'
}

interface HistoryData {
    page_content: {
        title: string
        subtitle: string
        intro_text: string
    }
    milestones: Milestone[]
    company_stats: {
        founded_year: string
        employees_count: number
        projects_completed: number
        countries_served: number
    }
}

interface HistoryEditorProps {
    data: HistoryData
    onChange: (data: HistoryData) => void
}

export default function HistoryEditor({ data, onChange }: HistoryEditorProps) {
    const [pageContent, setPageContent] = useState(data.page_content || {
        title: 'Nuestra Historia',
        subtitle: 'Un viaje de innovación y crecimiento',
        intro_text: 'Desde nuestros inicios, hemos estado comprometidos con la excelencia y la innovación tecnológica.'
    })
    const [milestones, setMilestones] = useState<Milestone[]>(data.milestones || [])
    const [companyStats, setCompanyStats] = useState(data.company_stats || {
        founded_year: '',
        employees_count: 0,
        projects_completed: 0,
        countries_served: 0
    })
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    useEffect(() => {
        onChange({ page_content: pageContent, milestones, company_stats: companyStats })
    }, [pageContent, milestones, companyStats, onChange])

    const addMilestone = () => {
        const newMilestone: Milestone = {
            year: new Date().getFullYear().toString(),
            title: '',
            description: '',
            achievement_type: 'other'
        }
        setMilestones([...milestones, newMilestone])
        setEditingIndex(milestones.length)
    }

    const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
        const updatedMilestones = [...milestones]
        updatedMilestones[index] = { ...updatedMilestones[index], [field]: value }
        setMilestones(updatedMilestones)
    }

    const deleteMilestone = (index: number) => {
        const updatedMilestones = milestones.filter((_, i) => i !== index)
        setMilestones(updatedMilestones)
        setEditingIndex(null)
    }

    const sortMilestonesByYear = () => {
        const sorted = [...milestones].sort((a, b) => parseInt(a.year) - parseInt(b.year))
        setMilestones(sorted)
    }

    const getAchievementIcon = (type: string) => {
        switch (type) {
            case 'foundation': return <Target className="h-5 w-5" />
            case 'expansion': return <Users className="h-5 w-5" />
            case 'award': return <Award className="h-5 w-5" />
            default: return <Calendar className="h-5 w-5" />
        }
    }

    const getAchievementColor = (type: string) => {
        switch (type) {
            case 'foundation': return 'bg-blue-100 text-blue-800'
            case 'expansion': return 'bg-green-100 text-green-800'
            case 'product': return 'bg-purple-100 text-purple-800'
            case 'award': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Historia</h3>
                <div className="flex gap-2">
                    <button
                        onClick={sortMilestonesByYear}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Ordenar por Año
                    </button>
                    <button
                        onClick={addMilestone}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Hito
                    </button>
                </div>
            </div>

            {/* Contenido de la Página */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Contenido de la Página</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título Principal
                        </label>
                        <input
                            type="text"
                            value={pageContent.title}
                            onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Nuestra Historia"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtítulo
                        </label>
                        <input
                            type="text"
                            value={pageContent.subtitle}
                            onChange={(e) => setPageContent({ ...pageContent, subtitle: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Un viaje de innovación y crecimiento"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Texto Introductorio
                        </label>
                        <textarea
                            value={pageContent.intro_text}
                            onChange={(e) => setPageContent({ ...pageContent, intro_text: e.target.value })}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Descripción general de la historia de la empresa..."
                        />
                    </div>
                </div>
            </div>

            {/* Estadísticas de la Empresa */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Estadísticas de la Empresa</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Año de Fundación
                        </label>
                        <input
                            type="text"
                            value={companyStats.founded_year}
                            onChange={(e) => setCompanyStats({ ...companyStats, founded_year: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="2020"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Users className="inline h-4 w-4 mr-1" />
                            Número de Empleados
                        </label>
                        <input
                            type="number"
                            value={companyStats.employees_count}
                            onChange={(e) => setCompanyStats({ ...companyStats, employees_count: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proyectos Completados
                        </label>
                        <input
                            type="number"
                            value={companyStats.projects_completed}
                            onChange={(e) => setCompanyStats({ ...companyStats, projects_completed: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Países Atendidos
                        </label>
                        <input
                            type="number"
                            value={companyStats.countries_served}
                            onChange={(e) => setCompanyStats({ ...companyStats, countries_served: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Timeline de Hitos */}
            {milestones.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay hitos históricos. Haz clic en "Agregar Hito" para empezar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Hito #{index + 1}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${getAchievementColor(milestone.achievement_type)}`}>
                                        {getAchievementIcon(milestone.achievement_type)}
                                        {milestone.achievement_type}
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {milestone.year}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingIndex === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteMilestone(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingIndex === index ? (
                                <div className="space-y-4">
                                    {/* Información Básica */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Calendar className="inline h-4 w-4 mr-1" />
                                                Año *
                                            </label>
                                            <input
                                                type="text"
                                                value={milestone.year}
                                                onChange={(e) => updateMilestone(index, 'year', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="2020"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo de Logro
                                            </label>
                                            <select
                                                value={milestone.achievement_type}
                                                onChange={(e) => updateMilestone(index, 'achievement_type', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="foundation">Fundación</option>
                                                <option value="expansion">Expansión</option>
                                                <option value="product">Producto</option>
                                                <option value="award">Premio</option>
                                                <option value="other">Otro</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                URL de Imagen
                                            </label>
                                            <input
                                                type="url"
                                                value={milestone.image_url || ''}
                                                onChange={(e) => updateMilestone(index, 'image_url', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://ejemplo.com/imagen.jpg"
                                            />
                                        </div>
                                    </div>

                                    {/* Título */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título del Hito *
                                        </label>
                                        <input
                                            type="text"
                                            value={milestone.title}
                                            onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Título del hito histórico"
                                        />
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción *
                                        </label>
                                        <textarea
                                            value={milestone.description}
                                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Descripción detallada del hito..."
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start gap-4">
                                        {milestone.image_url && (
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={milestone.image_url}
                                                    alt={milestone.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {milestone.title || 'Sin título'}
                                            </h4>
                                            <p className="text-sm text-gray-700 mt-1">
                                                {milestone.description || 'Sin descripción'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
