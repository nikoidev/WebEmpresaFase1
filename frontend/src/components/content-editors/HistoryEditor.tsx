'use client'

import React, { useState } from 'react'
import { Plus, Calendar, Award, Users, Target } from 'lucide-react'

interface TimelineItem {
    year: string
    title: string
    description: string
    image: string
    milestone: boolean
}

interface Stat {
    number: string
    label: string
    description: string
}

interface HistoryContent {
    timeline: TimelineItem[]
    hero: {
        title: string
        subtitle: string
        description: string
    }
    stats: Stat[]
}

interface HistoryEditorProps {
    data: HistoryContent
    onChange: (data: HistoryContent) => void
    metaData?: {
        meta_title: string
        meta_description: string
        meta_keywords: string
    }
    onMetaChange?: (meta: any) => void
}

export default function HistoryEditor({ data, onChange, metaData, onMetaChange }: HistoryEditorProps) {
    const [formData, setFormData] = useState<HistoryContent>(data)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [activeSection, setActiveSection] = useState<'hero' | 'timeline' | 'stats' | 'seo'>('hero')

    const handleChange = (newData: HistoryContent) => {
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

    const addTimelineItem = () => {
        const newItem: TimelineItem = {
            year: new Date().getFullYear().toString(),
            title: 'Nuevo Hito',
            description: 'Descripción del hito',
            image: '',
            milestone: true
        }
        const updatedData = {
            ...formData,
            timeline: [...formData.timeline, newItem]
        }
        handleChange(updatedData)
        setEditingIndex(formData.timeline.length)
    }

    const updateTimelineItem = (index: number, field: keyof TimelineItem, value: any) => {
        const updatedTimeline = [...formData.timeline]
        updatedTimeline[index] = { ...updatedTimeline[index], [field]: value }
        const updatedData = { ...formData, timeline: updatedTimeline }
        handleChange(updatedData)
    }

    const deleteTimelineItem = (index: number) => {
        const updatedTimeline = formData.timeline.filter((_, i) => i !== index)
        const updatedData = { ...formData, timeline: updatedTimeline }
        handleChange(updatedData)
        setEditingIndex(null)
    }

    const sortTimelineByYear = () => {
        const sorted = [...formData.timeline].sort((a, b) => parseInt(a.year) - parseInt(b.year))
        const updatedData = { ...formData, timeline: sorted }
        handleChange(updatedData)
    }

    const updateStat = (index: number, field: keyof Stat, value: string) => {
        const updatedStats = [...formData.stats]
        updatedStats[index] = { ...updatedStats[index], [field]: value }
        const updatedData = { ...formData, stats: updatedStats }
        handleChange(updatedData)
    }

    const updateMeta = (field: string, value: string) => {
        if (onMetaChange && metaData) {
            onMetaChange({ ...metaData, [field]: value })
        }
    }

    const sections = [
        { id: 'hero', label: 'Contenido Principal', icon: '🏢' },
        { id: 'timeline', label: 'Timeline de Hitos', icon: '📅' },
        { id: 'stats', label: 'Estadísticas', icon: '📊' },
        { id: 'seo', label: 'SEO', icon: '🔍' }
    ]

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones de Historia</h3>
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
                                placeholder="Nuestra Historia"
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
                                placeholder="Un viaje de innovación y transformación educativa"
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
                                placeholder="Desde nuestros humildes comienzos hasta convertirnos en líderes del sector EdTech en América Latina."
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'stats' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Estadísticas de la Empresa</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.stats.map((stat, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Estadística {index + 1}</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                            <input
                                                type="text"
                                                value={stat.number}
                                                onChange={(e) => updateStat(index, 'number', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="500+"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="Instituciones Educativas"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                            <input
                                                type="text"
                                                value={stat.description}
                                                onChange={(e) => updateStat(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="Confían en nuestra plataforma"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'timeline' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Timeline de Hitos</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={sortTimelineByYear}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <Calendar className="h-4 w-4" />
                                    Ordenar por Año
                                </button>
                                <button
                                    onClick={addTimelineItem}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar Hito
                                </button>
                            </div>
                        </div>

                        {formData.timeline.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No hay hitos históricos. Haz clic en "Agregar Hito" para empezar.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.timeline.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Hito #{index + 1}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${item.milestone ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {item.milestone ? 'Importante' : 'Normal'}
                                                </span>
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {item.year}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                                    className="text-green-600 hover:text-green-700 text-sm"
                                                >
                                                    {editingIndex === index ? 'Cerrar' : 'Editar'}
                                                </button>
                                                <button
                                                    onClick={() => deleteTimelineItem(index)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {editingIndex === index ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            <Calendar className="inline h-4 w-4 mr-1" />
                                                            Año *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={item.year}
                                                            onChange={(e) => updateTimelineItem(index, 'year', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                            placeholder="2020"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            URL de Imagen
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={item.image}
                                                            onChange={(e) => updateTimelineItem(index, 'image', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                            placeholder="https://ejemplo.com/imagen.jpg"
                                                        />
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.milestone}
                                                                onChange={(e) => updateTimelineItem(index, 'milestone', e.target.checked)}
                                                                className="mr-2"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Hito Importante</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Título del Hito *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => updateTimelineItem(index, 'title', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="Título del hito histórico"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Descripción *
                                                    </label>
                                                    <textarea
                                                        value={item.description}
                                                        onChange={(e) => updateTimelineItem(index, 'description', e.target.value)}
                                                        rows={4}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="Descripción detallada del hito..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-start gap-4">
                                                    {item.image && (
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">
                                                            {item.title || 'Sin título'}
                                                        </h4>
                                                        <p className="text-sm text-gray-700 mt-1">
                                                            {item.description || 'Sin descripción'}
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
                )}

                {activeSection === 'seo' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Configuración SEO</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Título
                            </label>
                            <input
                                type="text"
                                value={metaData?.meta_title || ''}
                                onChange={(e) => updateMeta('meta_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Historia de SEVP - Nuestra trayectoria"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Descripción
                            </label>
                            <textarea
                                value={metaData?.meta_description || ''}
                                onChange={(e) => updateMeta('meta_description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Conoce la historia y evolución de SEVP, desde nuestros inicios hasta convertirnos en líderes del sector EdTech."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Palabras Clave
                            </label>
                            <input
                                type="text"
                                value={metaData?.meta_keywords || ''}
                                onChange={(e) => updateMeta('meta_keywords', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="historia, SEVP, EdTech, educación, tecnología"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}