'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'

interface CompanyStat {
    number: string
    label: string
    description?: string
}

interface CompanyContent {
    global_stats: CompanyStat[]
    success_metrics: CompanyStat[]
}

interface CompanyEditorProps {
    content: CompanyContent
    onChange: (content: CompanyContent) => void
}

export default function CompanyEditor({ content, onChange }: CompanyEditorProps) {
    const [editingContent, setEditingContent] = useState<CompanyContent>(content)

    useEffect(() => {
        setEditingContent(content)
    }, [content])

    const updateContent = (section: 'global_stats' | 'success_metrics', stats: CompanyStat[]) => {
        const newContent = {
            ...editingContent,
            [section]: stats
        }
        setEditingContent(newContent)
        onChange(newContent)
    }

    const addStat = (section: 'global_stats' | 'success_metrics') => {
        const newStat = { number: '', label: '', description: '' }
        const currentStats = editingContent[section] || []
        updateContent(section, [...currentStats, newStat])
    }

    const updateStat = (section: 'global_stats' | 'success_metrics', index: number, field: keyof CompanyStat, value: string) => {
        const currentStats = [...(editingContent[section] || [])]
        currentStats[index] = { ...currentStats[index], [field]: value }
        updateContent(section, currentStats)
    }

    const removeStat = (section: 'global_stats' | 'success_metrics', index: number) => {
        const currentStats = editingContent[section] || []
        updateContent(section, currentStats.filter((_, i) => i !== index))
    }

    const StatEditor = ({ 
        title, 
        section, 
        stats 
    }: { 
        title: string
        section: 'global_stats' | 'success_metrics'
        stats: CompanyStat[] 
    }) => (
        <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                    onClick={() => addStat(section)}
                    className="bg-primary-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Métrica
                </button>
            </div>

            <div className="space-y-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-500">Métrica #{index + 1}</span>
                            <button
                                onClick={() => removeStat(section, index)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Eliminar métrica"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número/Valor
                                </label>
                                <input
                                    type="text"
                                    value={stat.number}
                                    onChange={(e) => updateStat(section, index, 'number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="ej. 500+, 99.9%, 24/7"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Etiqueta
                                </label>
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => updateStat(section, index, 'label', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="ej. Instituciones, Estudiantes"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción (opcional)
                            </label>
                            <textarea
                                value={stat.description || ''}
                                onChange={(e) => updateStat(section, index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                                placeholder="Descripción adicional de la métrica"
                            />
                        </div>
                    </div>
                ))}

                {stats.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No hay métricas configuradas. Haz clic en "Agregar Métrica" para comenzar.
                    </div>
                )}
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                    📊 Editor de Estadísticas Globales
                </h2>
                <p className="text-blue-700 text-sm">
                    Estas métricas se utilizan automáticamente en las páginas de Historia y Clientes. 
                    Al cambiarlas aquí, se actualizarán en todas las páginas donde aparezcan.
                </p>
            </div>

            <StatEditor
                title="📈 Estadísticas Globales (Historia - Números de Impacto)"
                section="global_stats"
                stats={editingContent.global_stats || []}
            />

            <StatEditor
                title="🎯 Métricas de Éxito (Clientes - Métricas de Éxito)"
                section="success_metrics"
                stats={editingContent.success_metrics || []}
            />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                    ⚠️ Importante
                </h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Las <strong>Estadísticas Globales</strong> aparecen en la sección "Números de Impacto" de Historia</li>
                    <li>• Las <strong>Métricas de Éxito</strong> aparecen en la sección "Métricas de Éxito" de Clientes</li>
                    <li>• También aparecen en el Hero de la página Clientes</li>
                    <li>• Los cambios se reflejan inmediatamente en todas las páginas</li>
                </ul>
            </div>
        </div>
    )
}
