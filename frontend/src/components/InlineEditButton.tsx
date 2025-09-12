'use client'

import { useState } from 'react'
import { Edit, Save, X } from 'lucide-react'
import { useInlineEdit } from '@/contexts/InlineEditContext'
import { adminApi } from '@/lib/api'

// Importar editores
import HomepageEditor from './content-editors/HomepageEditor'
import AboutEditor from './content-editors/AboutEditor'
import HistoryEditor from './content-editors/HistoryEditor'
import ClientsEditor from './content-editors/ClientsEditor'
import PricesEditor from './content-editors/PricesEditor'
import ContactEditor from './content-editors/ContactEditor'
import NewsEditor from './content-editors/NewsEditor'
import TestimonialsEditor from './content-editors/TestimonialsEditor'
import FAQsEditor from './content-editors/FAQsEditor'

interface InlineEditButtonProps {
    pageKey: string
    className?: string
    tooltip?: string
    onContentUpdate?: () => void
}

export default function InlineEditButton({ 
    pageKey, 
    className = '', 
    tooltip = 'Editar contenido',
    onContentUpdate
}: InlineEditButtonProps) {
    const { canEdit } = useInlineEdit()
    const [showModal, setShowModal] = useState(false)
    const [content, setContent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Debug logs
    console.log(`🔍 InlineEditButton Debug - pageKey: ${pageKey}, canEdit: ${canEdit}`)

    if (!canEdit) {
        console.log(`❌ InlineEditButton - Usuario no puede editar, ocultando botón`)
        return null
    }

    const handleEdit = async () => {
        setIsLoading(true)
        try {
            const response = await adminApi.getPageContent(pageKey)
            setContent({
                page_key: pageKey,
                title: response.data.title,
                content_json: response.data.content_json,
                meta_title: response.data.meta_title,
                meta_description: response.data.meta_description,
                meta_keywords: response.data.meta_keywords,
                is_active: response.data.is_active
            })
            setShowModal(true)
        } catch (error) {
            console.error('Error loading content:', error)
            alert('Error al cargar el contenido')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        if (!content) return
        
        setIsSaving(true)
        try {
            await adminApi.updatePageContent(pageKey, content)
            setShowModal(false)
            onContentUpdate?.()
            alert('✅ Contenido actualizado exitosamente')
        } catch (error) {
            console.error('Error saving content:', error)
            alert('❌ Error al guardar el contenido')
        } finally {
            setIsSaving(false)
        }
    }

    const renderEditor = () => {
        if (!content) return null

        const commonProps = {
            onChange: (data: any) => setContent({ ...content, content_json: data })
        }

        switch (pageKey) {
            case 'homepage':
                return (
                    <HomepageEditor
                        content={content.content_json}
                        {...commonProps}
                    />
                )
            case 'about':
                return (
                    <AboutEditor
                        content={content.content_json}
                        {...commonProps}
                    />
                )
            case 'history':
                return (
                    <HistoryEditor
                        data={content.content_json}
                        metaData={{
                            meta_title: content.meta_title,
                            meta_description: content.meta_description,
                            meta_keywords: content.meta_keywords
                        }}
                        onMetaChange={(meta) => setContent({ ...content, ...meta })}
                        {...commonProps}
                    />
                )
            case 'clients':
                return (
                    <ClientsEditor
                        data={content.content_json}
                        {...commonProps}
                    />
                )
            case 'prices':
                return (
                    <PricesEditor
                        data={content.content_json}
                        {...commonProps}
                    />
                )
            case 'contact':
                return (
                    <ContactEditor
                        data={content.content_json}
                        {...commonProps}
                    />
                )
            case 'news':
                return (
                    <NewsEditor
                        data={content.content_json}
                        {...commonProps}
                    />
                )
            case 'testimonials':
                return (
                    <TestimonialsEditor
                        data={content.content_json}
                        {...commonProps}
                    />
                )
            case 'faqs':
                return (
                    <FAQsEditor
                        data={content.content_json}
                        {...commonProps}
                    />
                )
            default:
                return (
                    <div className="p-4 text-center text-gray-500">
                        Editor no disponible para este tipo de página
                    </div>
                )
        }
    }

    const getPageName = (pageKey: string) => {
        const names: { [key: string]: string } = {
            homepage: 'Página de Inicio',
            about: 'Nosotros',
            history: 'Historia',
            clients: 'Clientes',
            prices: 'Precios',
            contact: 'Contacto',
            news: 'Noticias',
            testimonials: 'Testimonios',
            faqs: 'FAQs'
        }
        return names[pageKey] || pageKey
    }

    return (
        <>
            {/* Botón de edición flotante */}
            <button
                onClick={handleEdit}
                disabled={isLoading}
                className={`
                    fixed bottom-6 right-6 z-50
                    bg-primary-600 hover:bg-primary-700 
                    text-white p-4 rounded-full shadow-lg 
                    transition-all duration-300 hover:scale-110
                    focus:outline-none focus:ring-4 focus:ring-primary-300
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    ${className}
                `}
                title={tooltip}
            >
                <Edit className="h-5 w-5" />
            </button>

            {/* Modal de edición */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Editar: {getPageName(pageKey)}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Meta información básica */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Título de la Página
                                    </label>
                                    <input
                                        type="text"
                                        value={content?.title || ''}
                                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={content?.is_active || false}
                                            onChange={(e) => setContent({ ...content, is_active: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Página Activa</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div className="flex-1 overflow-hidden">
                            {renderEditor()}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 p-6">
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
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
            )}
        </>
    )
}
