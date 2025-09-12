'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'
import { Plus, Trash2, Building, Share2, Mail, Copyright, Link, Edit, Settings } from 'lucide-react'

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
    const [activeSection, setActiveSection] = useState<'company' | 'social' | 'support' | 'legal' | null>(null)
    const [content, setContent] = useState<FooterContent>({
        company: {
            name: 'SEVP',
            logo_letter: 'S',
            description: 'Sistema Educativo Virtual Profesional - La plataforma más completa para transformar la gestión educativa de tu institución.'
        },
        social_networks: [
            { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook', platform: 'Facebook' },
            { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter', platform: 'Twitter' },
            { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin', platform: 'LinkedIn' }
        ],
        support: {
            email: 'soporte@sevp.com',
            phone: '+51 1 234-5678',
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
        const networks = [...(content.social_networks || [])]
        networks.splice(index, 1)
        updateContent('social_networks', networks)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Enviar a la API como PageContent
            const pageData = {
                page_key: 'footer',
                title: 'Footer de la Página',
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
        {
            key: 'company',
            name: 'Información de la Empresa',
            description: 'Nombre, logo y descripción de la empresa',
            color: 'bg-blue-500',
            icon: Building
        },
        {
            key: 'social',
            name: 'Redes Sociales',
            description: 'Enlaces a redes sociales y plataformas',
            color: 'bg-green-500',
            icon: Share2
        },
        {
            key: 'support',
            name: 'Información de Soporte',
            description: 'Email, teléfono y horarios de atención',
            color: 'bg-purple-500',
            icon: Mail
        },
        {
            key: 'legal',
            name: 'Copyright y Enlaces Legales',
            description: 'Derechos de autor y enlaces legales',
            color: 'bg-orange-500',
            icon: Copyright
        }
    ]

    const handleSectionEdit = (sectionKey: string) => {
        setActiveSection(sectionKey as any)
    }

    const getPreviewContent = (sectionKey: string) => {
        switch (sectionKey) {
            case 'company':
                return [
                    `Empresa: ${content.company?.name || 'Sin configurar'}`,
                    `Logo: ${content.company?.logo_letter || 'Sin configurar'}`,
                    `Descripción: ${content.company?.description ? 'Configurada' : 'Sin configurar'}`
                ]
            case 'social':
                const socialCount = content.social_networks?.length || 0
                return [
                    `Redes sociales: ${socialCount}`,
                    ...(content.social_networks?.slice(0, 2).map(social => `• ${social.name}`) || [])
                ]
            case 'support':
                return [
                    `Email: ${content.support?.email || 'Sin configurar'}`,
                    `Teléfono: ${content.support?.phone || 'Sin configurar'}`,
                    `Horarios: ${content.support?.hours || 'Sin configurar'}`
                ]
            case 'legal':
                return [
                    `Copyright: ${content.copyright?.text || 'Sin configurar'}`,
                    `Año: ${content.copyright?.year || 'Sin configurar'}`,
                    `Enlaces: ${Object.keys(content.legal_links || {}).length} configurados`
                ]
            default:
                return ['Sin información disponible']
        }
    }

    if (isLoading && isStandalone) {
        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-center text-gray-600">Cargando contenido del footer...</p>
                </div>
            </div>
        )
    }

    const editorContent = (
        <div className="p-6">
            {/* Header del modal (solo en modo standalone) */}
            {isStandalone && (
                <div className="flex justify-between items-center pb-3 border-b flex-shrink-0 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Editor por Secciones - Footer</h2>
                        <p className="text-gray-600">Configura las diferentes secciones del pie de página.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            {!isStandalone && (
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Editor por Secciones - Footer</h2>
                    <p className="text-gray-600">Configura las diferentes secciones del pie de página.</p>
                </div>
            )}

            {/* Mensaje de éxito (solo en modo standalone) */}
            {showSuccessMessage && isStandalone && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex-shrink-0">
                    ¡Footer guardado exitosamente! Recargando página...
                </div>
            )}

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sections.map((section) => {
                    const IconComponent = section.icon
                    
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
                                        {getPreviewContent(section.key).map((item, index) => (
                                            <p key={index} className="text-xs text-gray-600 truncate">{item}</p>
                                        ))}
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => handleSectionEdit(section.key)}
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

            {/* Formularios de edición - Solo se muestra el activo */}
            {activeSection && (
                <div className="mt-8 bg-white border rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Editando: {sections.find(s => s.key === activeSection)?.name}
                        </h3>
                        <button
                            onClick={() => setActiveSection(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    
                    {/* Contenido del formulario según sección activa */}
                    {activeSection === 'company' && (
                        <div className="space-y-4">
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
                                        value={content.company?.logo_letter || ''}
                                        onChange={(e) => updateContent('company', {
                                            ...content.company,
                                            logo_letter: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="S"
                                        maxLength={1}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    rows={3}
                                    placeholder="Descripción breve de la empresa..."
                                />
                            </div>
                        </div>
                    )}

                    {activeSection === 'social' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium text-gray-900">Redes Sociales</h4>
                                <button
                                    onClick={addSocialNetwork}
                                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Red Social
                                </button>
                            </div>
                            <div className="space-y-4">
                                {(content.social_networks || []).map((network, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre
                                                </label>
                                                <input
                                                    type="text"
                                                    value={network.name}
                                                    onChange={(e) => updateSocialNetwork(index, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={network.url}
                                                    onChange={(e) => updateSocialNetwork(index, 'url', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Plataforma
                                                </label>
                                                <select
                                                    value={network.platform}
                                                    onChange={(e) => updateSocialNetwork(index, 'platform', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                >
                                                    {availablePlatforms.map((platform) => (
                                                        <option key={platform.name} value={platform.name}>
                                                            {platform.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeSocialNetwork(index)}
                                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSection === 'support' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        placeholder="soporte@sevp.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono de soporte
                                    </label>
                                    <input
                                        type="text"
                                        value={content.support?.phone || ''}
                                        onChange={(e) => updateContent('support', {
                                            ...content.support,
                                            phone: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="+51 1 234-5678"
                                    />
                                </div>
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
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        placeholder="SEVP. Todos los derechos reservados."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Año
                                    </label>
                                    <input
                                        type="number"
                                        value={content.copyright?.year || new Date().getFullYear()}
                                        onChange={(e) => updateContent('copyright', {
                                            ...content.copyright,
                                            year: parseInt(e.target.value)
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        min="2020"
                                        max="2030"
                                    />
                                </div>
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

                    {/* Botones de acción */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={() => setActiveSection(null)}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        {isStandalone && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        )}
                    </div>
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
