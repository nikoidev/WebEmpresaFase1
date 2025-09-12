'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'
import { Plus, Trash2, Building, Share2, Mail, Copyright, Link } from 'lucide-react'

interface SocialNetwork {
    name: string
    url: string
    icon: string
    platform: string
}

interface FooterContent {
    company?: {
        name?: string
        logo_letter?: string
        description?: string
    }
    social_networks?: SocialNetwork[]
    support?: {
        email?: string
        phone?: string
        hours?: string
    }
    copyright?: {
        text?: string
        year?: number
    }
    legal_links?: {
        privacy_policy?: string
        terms_of_service?: string
    }
}

interface FooterEditorProps {
    onClose?: () => void
    onSave?: () => void
    data?: FooterContent
    onChange?: (data: FooterContent) => void
    isStandalone?: boolean  // Para determinar si debe mostrar su propio modal
}

export default function FooterEditor({ onClose, onSave, data, onChange, isStandalone = true }: FooterEditorProps) {
    const [activeSection, setActiveSection] = useState<'company' | 'social' | 'support' | 'legal'>('company')
    const [content, setContent] = useState<FooterContent>({
        company: {
            name: 'SEVP',
            logo_letter: 'S',
            description: 'Sistema Educativo Virtual Profesional - La plataforma más completa para transformar la gestión educativa de tu institución.'
        },
        social_networks: [
            { name: 'Facebook', url: 'https://facebook.com/sevp', icon: 'facebook', platform: 'Facebook' },
            { name: 'LinkedIn', url: 'https://linkedin.com/company/sevp', icon: 'linkedin', platform: 'LinkedIn' },
            { name: 'Twitter', url: 'https://twitter.com/sevp', icon: 'twitter', platform: 'Twitter' }
        ],
        support: {
            email: 'soporte@sevp.com',
            phone: '+51 999 999 999',
            hours: 'Lun - Vie: 9:00 - 18:00'
        },
        copyright: {
            text: 'SEVP. Todos los derechos reservados.',
            year: new Date().getFullYear()
        },
        legal_links: {
            privacy_policy: '/privacidad',
            terms_of_service: '/terminos'
        }
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    // Lista de iconos/plataformas disponibles
    const availablePlatforms = [
        { name: 'Facebook', icon: 'facebook' },
        { name: 'Twitter', icon: 'twitter' },
        { name: 'LinkedIn', icon: 'linkedin' },
        { name: 'Instagram', icon: 'instagram' },
        { name: 'YouTube', icon: 'youtube' },
        { name: 'TikTok', icon: 'tiktok' },
        { name: 'WhatsApp', icon: 'whatsapp' },
        { name: 'Telegram', icon: 'telegram' },
        { name: 'Discord', icon: 'discord' },
        { name: 'GitHub', icon: 'github' }
    ]

    useEffect(() => {
        if (isStandalone) {
            loadContent()
        } else if (data) {
            setContent(data)
        }
    }, [isStandalone, data])

    const loadContent = async () => {
        setIsLoading(true)
        try {
            const response = await adminApi.getPageContent('footer')
            if (response.data?.content_json) {
                setContent(response.data.content_json)
            }
        } catch (error) {
            console.error('Error loading footer content:', error)
            // Usar contenido por defecto si no existe
        } finally {
            setIsLoading(false)
        }
    }

    const updateContent = (section: keyof FooterContent, value: any) => {
        const newContent = {
            ...content,
            [section]: value
        }
        setContent(newContent)
        if (!isStandalone && onChange) {
            onChange(newContent)
        }
    }

    // Funciones para manejar redes sociales
    const addSocialNetwork = () => {
        const newNetwork: SocialNetwork = {
            name: 'Nueva Red Social',
            url: 'https://example.com',
            icon: 'link',
            platform: 'Personalizada'
        }
        const currentNetworks = content.social_networks || []
        updateContent('social_networks', [...currentNetworks, newNetwork])
    }

    const updateSocialNetwork = (index: number, field: keyof SocialNetwork, value: string) => {
        const networks = [...(content.social_networks || [])]
        networks[index] = { ...networks[index], [field]: value }
        updateContent('social_networks', networks)
    }

    const removeSocialNetwork = (index: number) => {
        const networks = content.social_networks?.filter((_, i) => i !== index) || []
        updateContent('social_networks', networks)
    }

    const handleSave = async () => {
        if (!isStandalone && onChange) {
            // Modo integrado: solo actualizar el contenido sin guardar en DB
            onChange(content)
            return
        }

        // Modo standalone: guardar en DB
        setIsSaving(true)
        try {
            const pageData = {
                page_key: 'footer',
                title: 'Footer - SEVP',
                content_json: content,
                meta_title: 'Footer',
                meta_description: 'Configuración del footer de la página',
                is_active: true
            }

            await adminApi.updatePageContent('footer', pageData)
            
            // Mostrar mensaje de éxito temporal
            setShowSuccessMessage(true)
            setTimeout(() => {
                setShowSuccessMessage(false)
                onSave?.()
                onClose?.()
            }, 1500)
        } catch (error) {
            console.error('Error saving footer:', error)
            alert('Error al guardar el footer. Por favor, inténtalo de nuevo.')
        } finally {
            setIsSaving(false)
        }
    }

    const sections = [
        { id: 'company', label: 'Información de la Empresa', icon: Building },
        { id: 'social', label: 'Redes Sociales', icon: Share2 },
        { id: 'support', label: 'Información de Soporte', icon: Mail },
        { id: 'legal', label: 'Copyright y Enlaces Legales', icon: Copyright }
    ]

    if (isLoading && isStandalone) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Cargando contenido del footer...</p>
                    </div>
                </div>
            </div>
        )
    }

    const editorContent = (
        <div className={isStandalone ? "h-full flex flex-col p-5" : "flex h-full"}>
            {/* Header del modal (solo en modo standalone) */}
            {isStandalone && (
                <div className="flex justify-between items-center pb-3 border-b flex-shrink-0 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Editar Footer</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Mensaje de éxito (solo en modo standalone) */}
            {showSuccessMessage && isStandalone && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex-shrink-0">
                    ¡Footer guardado exitosamente! Recargando página...
                </div>
            )}

            {/* Contenido principal con sidebar */}
            <div className={`${isStandalone ? "flex-1 flex min-h-0" : "flex h-full"}`}>
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones del Footer</h3>
                    <nav className="space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id as any)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    activeSection === section.id
                                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <section.icon size={16} />
                                {section.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Editor */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {activeSection === 'company' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900">Información de la Empresa</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de la empresa
                                    </label>
                                    <input
                                        type="text"
                                        value={content.company?.name || ''}
                                        onChange={(e) => updateContent('company', {
                                            ...content.company,
                                            name: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="SEVP"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Letra del logo
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={1}
                                        value={content.company?.logo_letter || ''}
                                        onChange={(e) => updateContent('company', {
                                            ...content.company,
                                            logo_letter: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="S"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción de la empresa
                                </label>
                                <textarea
                                    value={content.company?.description || ''}
                                    onChange={(e) => updateContent('company', {
                                        ...content.company,
                                        description: e.target.value
                                    })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Descripción de la empresa..."
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'social' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-gray-900">Redes Sociales</h3>
                                <button
                                    onClick={addSocialNetwork}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Agregar Red Social
                                </button>
                            </div>

                            <div className="space-y-4">
                                {content.social_networks?.map((network, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium text-gray-900">{network.name || `Red Social ${index + 1}`}</h4>
                                            <button
                                                onClick={() => removeSocialNetwork(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre de la Red
                                                </label>
                                                <input
                                                    type="text"
                                                    value={network.name}
                                                    onChange={(e) => updateSocialNetwork(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                    placeholder="Facebook"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Plataforma/Icono
                                                </label>
                                                <select
                                                    value={network.icon}
                                                    onChange={(e) => {
                                                        updateSocialNetwork(index, 'icon', e.target.value)
                                                        updateSocialNetwork(index, 'platform', e.target.value)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                >
                                                    {availablePlatforms.map((platform) => (
                                                        <option key={platform.icon} value={platform.icon}>
                                                            {platform.name}
                                                        </option>
                                                    ))}
                                                    <option value="link">Personalizada</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                URL de la Red Social
                                            </label>
                                            <input
                                                type="url"
                                                value={network.url}
                                                onChange={(e) => updateSocialNetwork(index, 'url', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                placeholder="https://facebook.com/mi-empresa"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {(!content.social_networks || content.social_networks.length === 0) && (
                                <div className="text-center py-8 text-gray-500">
                                    No hay redes sociales configuradas. Haz clic en "Agregar Red Social" para comenzar.
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'support' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900">Información de Soporte</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email de soporte
                                </label>
                                <input
                                    type="email"
                                    value={content.support?.email || ''}
                                    onChange={(e) => updateContent('support', {
                                        ...content.support,
                                        email: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="soporte@empresa.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono de soporte
                                </label>
                                <input
                                    type="tel"
                                    value={content.support?.phone || ''}
                                    onChange={(e) => updateContent('support', {
                                        ...content.support,
                                        phone: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="+51 999 999 999"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Horarios de atención
                                </label>
                                <input
                                    type="text"
                                    value={content.support?.hours || ''}
                                    onChange={(e) => updateContent('support', {
                                        ...content.support,
                                        hours: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Lun - Vie: 9:00 - 18:00"
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'legal' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900">Copyright y Enlaces Legales</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto de copyright
                                </label>
                                <input
                                    type="text"
                                    value={content.copyright?.text || ''}
                                    onChange={(e) => updateContent('copyright', {
                                        ...content.copyright,
                                        text: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Mi Empresa. Todos los derechos reservados."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enlace de Política de Privacidad
                                    </label>
                                    <input
                                        type="text"
                                        value={content.legal_links?.privacy_policy || ''}
                                        onChange={(e) => updateContent('legal_links', {
                                            ...content.legal_links,
                                            privacy_policy: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="/privacidad"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enlace de Términos de Uso
                                    </label>
                                    <input
                                        type="text"
                                        value={content.legal_links?.terms_of_service || ''}
                                        onChange={(e) => updateContent('legal_links', {
                                            ...content.legal_links,
                                            terms_of_service: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="/terminos"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Botones de acción (solo en modo standalone) */}
            {isStandalone && (
                <div className="flex justify-end space-x-4 mt-auto pt-4 border-t flex-shrink-0">
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
                        {isSaving ? 'Guardando y recargando...' : 'Guardar Cambios'}
                    </button>
                </div>
            )}
        </div>
    )

    // Wrapper condicional del modal
    if (isStandalone) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl h-[60vh] shadow-lg rounded-md bg-white flex flex-col">
                    {editorContent}
                </div>
            </div>
        )
    }

    // Modo integrado: solo retornar el contenido del editor
    return editorContent
}