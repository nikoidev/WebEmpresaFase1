'use client'

import { useState } from 'react'
import { Edit, Settings } from 'lucide-react'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'

interface SectionBasedPricesEditorProps {
    data: any
    onChange: (data: any) => void
}

export default function SectionBasedPricesEditor({ data, onChange }: SectionBasedPricesEditorProps) {
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
            description: 'Título principal y descripción',
            color: 'bg-blue-500'
        },
        {
            key: 'pricing',
            name: 'Planes y Precios',
            description: 'Planes de precios y características',
            color: 'bg-green-500'
        },
        {
            key: 'faq',
            name: 'Preguntas Frecuentes',
            description: 'FAQ sobre precios',
            color: 'bg-purple-500'
        }
    ]

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Editor por Secciones - Página Precios</h2>
                <p className="text-gray-600">Selecciona una sección para editarla individualmente.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <div
                        key={section.key}
                        className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            <div className={`${section.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                                <Settings className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.name}</h3>
                            <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                            
                            <button
                                onClick={() => handleSectionEdit(section.key, section.name)}
                                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Editar Sección
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de edición por sección */}
            {editingSection && (
                <UniversalSectionEditModal
                    isOpen={!!editingSection}
                    onClose={() => setEditingSection(null)}
                    sectionType={editingSection}
                    sectionName={editingSectionName}
                    pageKey="pricing"
                    initialContent={{ content_json: data }}
                    onSave={handleSectionSave}
                />
            )}
        </div>
    )
}
