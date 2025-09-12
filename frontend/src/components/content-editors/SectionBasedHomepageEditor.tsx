'use client'

import { useState } from 'react'
import { Edit, Settings, Home, Star, Phone, BarChart3, MessageSquare } from 'lucide-react'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'

interface SectionBasedHomepageEditorProps {
    content: any
    onChange: (content: any) => void
}

export default function SectionBasedHomepageEditor({ 
    content, 
    onChange 
}: SectionBasedHomepageEditorProps) {
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')

    const handleSectionEdit = (sectionType: string, sectionName: string) => {
        setEditingSection(sectionType)
        setEditingSectionName(sectionName)
    }

    const handleSectionSave = async (updatedContent: any) => {
        // Propagar los cambios al padre
        onChange(updatedContent.content_json)
        setEditingSection(null)
        setEditingSectionName('')
    }

    const sections = [
        {
            key: 'hero',
            name: 'Sección Hero',
            description: 'Título principal, subtítulo y slideshow multimedia',
            color: 'bg-blue-500',
            icon: Home
        },
        {
            key: 'features',
            name: 'Características',
            description: 'Funcionalidades principales del sistema',
            color: 'bg-green-500',
            icon: Star
        },
        {
            key: 'cta',
            name: 'Call to Action',
            description: 'Llamada a la acción principal',
            color: 'bg-purple-500',
            icon: Phone
        },
        {
            key: 'stats',
            name: 'Estadísticas',
            description: 'Números de impacto y métricas destacadas',
            color: 'bg-orange-500',
            icon: BarChart3
        },
        {
            key: 'testimonials',
            name: 'Testimonios',
            description: 'Testimonios de clientes destacados',
            color: 'bg-red-500',
            icon: MessageSquare
        }
    ]

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Editor por Secciones - Página de Inicio</h2>
                <p className="text-gray-600">Selecciona una sección para editarla individualmente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => {
                    const IconComponent = section.icon
                    
                    // Obtener preview del contenido según la sección
                    const getPreviewContent = () => {
                        switch (section.key) {
                            case 'hero':
                                return [
                                    `Título: ${content.hero_title || 'Sin configurar'}`,
                                    `Subtítulo: ${content.hero_subtitle || 'Sin configurar'}`,
                                    `Multimedia: ${content.hero?.slideshow?.length > 0 
                                        ? `${content.hero.slideshow.length} elementos`
                                        : 'Sin configurar'}`
                                ]
                            case 'features':
                                return [
                                    `Características: ${content.features?.length || 0}`,
                                    ...(content.features?.slice(0, 2).map((f: any) => `• ${f.title || 'Sin título'}`) || [])
                                ]
                            case 'cta':
                                return [
                                    `Título: ${content.call_to_action?.title || 'Sin configurar'}`,
                                    `Botón: ${content.call_to_action?.button_text || 'Sin configurar'}`
                                ]
                            case 'stats':
                                const statsCount = content.stats && typeof content.stats === 'object' 
                                    ? Object.keys(content.stats).length 
                                    : 0
                                return [
                                    `Estadísticas: ${statsCount}`,
                                    ...(statsCount > 0 ? Object.keys(content.stats).slice(0, 2).map(key => `• ${key}: ${content.stats[key]}`) : [])
                                ]
                            case 'testimonials':
                                return [
                                    `Testimonios: ${content.testimonials?.length || 0}`,
                                    ...(content.testimonials?.slice(0, 2).map((t: any) => `• ${t.author || 'Sin autor'}`) || [])
                                ]
                            default:
                                return ['Sin información disponible']
                        }
                    }

                    return (
                        <div
                            key={section.key}
                            className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6">
                                <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                    <IconComponent className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                                
                                {/* Preview del contenido */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="space-y-1">
                                        {getPreviewContent().map((item, index) => (
                                            <p key={index} className="text-xs text-gray-600 truncate">{item}</p>
                                        ))}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handleSectionEdit(section.key, section.name)}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar Sección
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal de edición */}
            {editingSection && (
                <UniversalSectionEditModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    sectionType={editingSection}
                    sectionName={editingSectionName}
                    pageKey="homepage"
                    initialContent={{ content_json: content }}
                    onSave={handleSectionSave}
                />
            )}
        </div>
    )
}
