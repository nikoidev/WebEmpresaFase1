'use client'

import { useState } from 'react'
import { X, Save } from 'lucide-react'
import { adminApi } from '@/lib/api'

interface SectionEditModalProps {
    isOpen: boolean
    onClose: () => void
    sectionType: 'hero' | 'features' | 'cta'
    pageKey: string
    initialContent: any
    onSave: () => void
}

export default function SectionEditModal({
    isOpen,
    onClose,
    sectionType,
    pageKey,
    initialContent,
    onSave
}: SectionEditModalProps) {
    const [content, setContent] = useState(initialContent)
    const [isSaving, setIsSaving] = useState(false)

    if (!isOpen) return null

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Actualizar solo el contenido de esta sección
            await adminApi.updatePageContent(pageKey, {
                ...initialContent,
                content_json: {
                    ...initialContent.content_json,
                    ...content
                }
            })
            onSave()
            onClose()
            alert('✅ Sección actualizada exitosamente')
        } catch (error) {
            console.error('Error saving section:', error)
            alert('❌ Error al guardar la sección')
        } finally {
            setIsSaving(false)
        }
    }

    const renderSectionEditor = () => {
        switch (sectionType) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Sección Hero</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={content.hero_title || ''}
                                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Sistema Educativo Virtual Profesional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={content.hero_subtitle || ''}
                                onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Transformamos la educación con tecnología"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={content.hero_description || ''}
                                onChange={(e) => setContent({ ...content, hero_description: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="La plataforma educativa más completa..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.hero_button_text || ''}
                                    onChange={(e) => setContent({ ...content, hero_button_text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ver Planes"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.hero_button_link || ''}
                                    onChange={(e) => setContent({ ...content, hero_button_link: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="/precios"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 'features':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Características</h3>
                        <p className="text-sm text-gray-600">
                            Estas son las características que aparecen en la sección "¿Por qué elegir SEVP?"
                        </p>
                        
                        {content.features && content.features.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {content.features.map((feature: any, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Título {index + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={feature.title || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...content.features]
                                                        newFeatures[index] = { ...newFeatures[index], title: e.target.value }
                                                        setContent({ ...content, features: newFeatures })
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción {index + 1}
                                                </label>
                                                <textarea
                                                    value={feature.description || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...content.features]
                                                        newFeatures[index] = { ...newFeatures[index], description: e.target.value }
                                                        setContent({ ...content, features: newFeatures })
                                                    }}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No hay características configuradas
                            </div>
                        )}
                    </div>
                )

            case 'cta':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Llamada a la Acción</h3>
                        <p className="text-sm text-gray-600">
                            Esta es la sección azul al final de la página
                        </p>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={content.call_to_action?.title || ''}
                                onChange={(e) => setContent({ 
                                    ...content, 
                                    call_to_action: { 
                                        ...content.call_to_action, 
                                        title: e.target.value 
                                    } 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="¿Listo para transformar tu institución educativa?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={content.call_to_action?.description || ''}
                                onChange={(e) => setContent({ 
                                    ...content, 
                                    call_to_action: { 
                                        ...content.call_to_action, 
                                        description: e.target.value 
                                    } 
                                })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Únete a las instituciones que ya están revolucionando la educación..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del Botón Principal
                                </label>
                                <input
                                    type="text"
                                    value={content.call_to_action?.button_text || ''}
                                    onChange={(e) => setContent({ 
                                        ...content, 
                                        call_to_action: { 
                                            ...content.call_to_action, 
                                            button_text: e.target.value 
                                        } 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Solicitar Demo Gratuita"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.call_to_action?.button_link || ''}
                                    onChange={(e) => setContent({ 
                                        ...content, 
                                        call_to_action: { 
                                            ...content.call_to_action, 
                                            button_link: e.target.value 
                                        } 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                    </div>
                )

            default:
                return <div>Sección no encontrada</div>
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            Editar Sección
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-2"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderSectionEditor()}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
