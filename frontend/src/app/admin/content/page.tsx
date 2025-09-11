'use client'

import { adminApi } from '@/lib/api'
import DevFileInfo from '@/components/DevFileInfo'
import AdminLayout from '@/components/layout/AdminLayout'
import HomepageEditor from '@/components/content-editors/HomepageEditor'
import AboutEditor from '@/components/content-editors/AboutEditor'
import {
    Edit,
    Eye,
    FileText,
    Globe,
    History,
    Home,
    Mail,
    Plus,
    Save,
    Users,
    DollarSign,
    HelpCircle as Help
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface PageContent {
    id: number
    page_key: string
    title: string
    content_json: any
    meta_title: string
    meta_description: string
    meta_keywords: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export default function ContentManagementPage() {
    const [pages, setPages] = useState<PageContent[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingPage, setEditingPage] = useState<PageContent | null>(null)
    const [formData, setFormData] = useState({
        page_key: '',
        title: '',
        content_json: {},
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_active: true
    })

    const pageTypes = [
        {
            key: 'homepage',
            name: 'Página de Inicio',
            description: 'Contenido principal de la homepage',
            icon: Home,
            color: 'bg-blue-500'
        },
        {
            key: 'about',
            name: 'Nosotros',
            description: 'Información sobre la empresa',
            icon: Users,
            color: 'bg-green-500'
        },
        {
            key: 'history',
            name: 'Historia',
            description: 'Historia de la empresa',
            icon: History,
            color: 'bg-purple-500'
        },
        {
            key: 'clients',
            name: 'Clientes',
            description: 'Información de clientes',
            icon: Globe,
            color: 'bg-orange-500'
        },
        {
            key: 'prices',
            name: 'Precios',
            description: 'Planes y precios de servicios',
            icon: DollarSign,
            color: 'bg-yellow-500'
        },
        {
            key: 'contact',
            name: 'Contacto',
            description: 'Información de contacto',
            icon: Mail,
            color: 'bg-red-500'
        },
        {
            key: 'news',
            name: 'Noticias',
            description: 'Artículos y noticias del blog',
            icon: FileText,
            color: 'bg-indigo-500'
        },
        {
            key: 'testimonials',
            name: 'Testimonios',
            description: 'Testimonios de clientes',
            icon: Users,
            color: 'bg-pink-500'
        },
        {
            key: 'faqs',
            name: 'FAQs',
            description: 'Preguntas frecuentes',
            icon: Help,
            color: 'bg-teal-500'
        }
    ]

    useEffect(() => {
        fetchPages()
    }, [])

    const fetchPages = async () => {
        try {
            const response = await adminApi.getPageContents()
            console.log('Pages response:', response.data)
            setPages(response.data || [])
        } catch (error) {
            console.error('Error fetching pages:', error)
            setPages([]) // Asegurar que hay una lista vacía en caso de error
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            if (editingPage) {
                await adminApi.updatePageContent(editingPage.page_key, formData)
            } else {
                await adminApi.createPageContent(formData)
            }

            setShowModal(false)
            setEditingPage(null)
            setFormData({
                page_key: '',
                title: '',
                content_json: {},
                meta_title: '',
                meta_description: '',
                meta_keywords: '',
                is_active: true
            })
            fetchPages()
        } catch (error) {
            console.error('Error saving page:', error)
        }
    }

    const handleEdit = (page: PageContent) => {
        setEditingPage(page)
        setFormData({
            page_key: page.page_key,
            title: page.title,
            content_json: page.content_json,
            meta_title: page.meta_title,
            meta_description: page.meta_description,
            meta_keywords: page.meta_keywords,
            is_active: page.is_active
        })
        setShowModal(true)
    }

    const handleCreateNew = (pageKey: string) => {
        const pageType = pageTypes.find(p => p.key === pageKey)
        setEditingPage(null)
        setFormData({
            page_key: pageKey,
            title: pageType?.name || '',
            content_json: getDefaultContentForPage(pageKey),
            meta_title: '',
            meta_description: '',
            meta_keywords: '',
            is_active: true
        })
        setShowModal(true)
    }

    const getDefaultContentForPage = (pageKey: string) => {
        switch (pageKey) {
            case 'homepage':
                return {
                    hero_title: 'Bienvenido a SEVP',
                    hero_subtitle: 'Sistema Educativo Virtual Profesional',
                    hero_description: 'Transformamos la educación con tecnología innovadora',
                    features: [],
                    testimonials: [],
                    stats: {}
                }
            case 'about':
                return {
                    mission: 'Nuestra misión...',
                    vision: 'Nuestra visión...',
                    values: [],
                    team: []
                }
            case 'history':
                return {
                    intro: 'Nuestra historia comenzó...',
                    milestones: [],
                    achievements: []
                }
            case 'clients':
                return {
                    intro: 'Nuestros clientes...',
                    client_types: [],
                    testimonials: [],
                    stats: {}
                }
            case 'prices':
                return {
                    hero_title: 'Nuestros Planes',
                    hero_description: 'Elige el plan que mejor se adapte a tus necesidades',
                    plans: [],
                    features_comparison: {},
                    contact_cta: {}
                }
            case 'contact':
                return {
                    office_info: {},
                    contact_info: {},
                    form_settings: {}
                }
            case 'news':
                return {
                    hero_title: 'Noticias y Blog',
                    hero_description: 'Mantente al día con nuestras últimas noticias y artículos',
                    articles: [],
                    categories: [],
                    featured_article: null
                }
            case 'testimonials':
                return {
                    hero_title: 'Lo que dicen nuestros clientes',
                    hero_description: 'Testimonios reales de clientes satisfechos',
                    testimonials: [],
                    stats: {
                        total_clients: 0,
                        satisfaction_rate: 0,
                        average_rating: 0
                    }
                }
            case 'faqs':
                return {
                    hero_title: 'Preguntas Frecuentes',
                    hero_description: 'Encuentra respuestas a las preguntas más comunes',
                    categories: [
                        {
                            name: 'General',
                            key: 'general',
                            faqs: []
                        },
                        {
                            name: 'Precios',
                            key: 'pricing',
                            faqs: []
                        },
                        {
                            name: 'Técnico',
                            key: 'technical',
                            faqs: []
                        }
                    ],
                    contact_cta: {
                        title: '¿No encuentras lo que buscas?',
                        description: 'Contáctanos y te ayudaremos',
                        button_text: 'Contactar Soporte'
                    }
                }
            default:
                return {}
        }
    }

    const getPageIcon = (pageKey: string) => {
        const pageType = pageTypes.find(p => p.key === pageKey)
        return pageType?.icon || FileText
    }

    const getPageColor = (pageKey: string) => {
        const pageType = pageTypes.find(p => p.key === pageKey)
        return pageType?.color || 'bg-gray-500'
    }

    const getPageName = (pageKey: string) => {
        const pageType = pageTypes.find(p => p.key === pageKey)
        return pageType?.name || pageKey
    }

    const renderEditor = () => {
        switch (formData.page_key) {
            case 'homepage':
                return (
                    <HomepageEditor
                        content={formData.content_json}
                        onChange={(content) => setFormData({ ...formData, content_json: content })}
                    />
                )
            case 'about':
                return (
                    <AboutEditor
                        content={formData.content_json}
                        onChange={(content) => setFormData({ ...formData, content_json: content })}
                    />
                )
            default:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contenido (JSON)
                            </label>
                            <textarea
                                value={JSON.stringify(formData.content_json, null, 2)}
                                onChange={(e) => {
                                    try {
                                        const parsed = JSON.parse(e.target.value)
                                        setFormData({ ...formData, content_json: parsed })
                                    } catch (error) {
                                        // Mantener el valor aunque no sea JSON válido para permitir edición
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                rows={10}
                                placeholder="Contenido en formato JSON..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                El contenido debe estar en formato JSON válido
                            </p>
                        </div>
                    </div>
                )
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="h-full space-y-8">
                <DevFileInfo filePath="frontend/src/app/admin/content/page.tsx" />
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
                    <p className="mt-2 text-gray-600">
                        Administra el contenido de todas las páginas públicas de tu sitio web
                    </p>
                </div>

                {/* Available Page Types */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Páginas Disponibles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pageTypes.map((pageType) => {
                            const existingPage = pages.find(p => p.page_key === pageType.key)
                            const IconComponent = pageType.icon
                            
                            return (
                                <div key={pageType.key} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`${pageType.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                                            <IconComponent className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex gap-2">
                                            {existingPage ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(existingPage)}
                                                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="Editar página"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <a
                                                        href={`/${pageType.key === 'homepage' ? '' : pageType.key}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                                                        title="Ver página"
                                                    >
                                                        <Eye size={16} />
                                                    </a>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleCreateNew(pageType.key)}
                                                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors"
                                                    title="Crear contenido"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-1">{pageType.name}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{pageType.description}</p>
                                    {existingPage ? (
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                existingPage.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {existingPage.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Actualizado: {new Date(existingPage.updated_at || existingPage.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Sin configurar
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-7xl h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="border-b border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {editingPage ? `Editar: ${getPageName(editingPage.page_key)}` : `Crear: ${getPageName(formData.page_key)}`}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false)
                                            setEditingPage(null)
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Configuración básica */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título de la Página
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meta Título (SEO)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.meta_title}
                                            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Título para SEO"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center mt-6">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meta Descripción
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.meta_description}
                                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Descripción para SEO"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Palabras Clave
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.meta_keywords}
                                            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="palabra1, palabra2, palabra3"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false)
                                            setEditingPage(null)
                                        }}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Save size={16} />
                                        {editingPage ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}
