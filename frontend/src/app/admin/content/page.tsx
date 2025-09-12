'use client'

import { adminApi } from '@/lib/api'
import DevFileInfo from '@/components/DevFileInfo'
import AdminLayout from '@/components/layout/AdminLayout'
import SectionBasedHomepageEditor from '@/components/content-editors/SectionBasedHomepageEditor'
import FooterEditor from '@/components/content-editors/FooterEditor'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import SectionBasedAboutEditor from '@/components/content-editors/SectionBasedAboutEditor'
import SectionBasedHistoryEditor from '@/components/content-editors/SectionBasedHistoryEditor'
import SectionBasedClientsEditor from '@/components/content-editors/SectionBasedClientsEditor'
import SectionBasedPricesEditor from '@/components/content-editors/SectionBasedPricesEditor'
import SectionBasedContactEditor from '@/components/content-editors/SectionBasedContactEditor'
import CompanyEditor from '@/components/content-editors/CompanyEditor'
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
    HelpCircle as Help,
    Layout
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
            description: 'Contenido principal de la homepage - Sistema por secciones',
            icon: Home,
            color: 'bg-blue-500'
        },
        {
            key: 'about',
            name: 'Nosotros',
            description: 'Información sobre la empresa - Sistema por secciones',
            icon: Users,
            color: 'bg-green-500'
        },
        {
            key: 'history',
            name: 'Historia',
            description: 'Historia de la empresa - Sistema por secciones',
            icon: History,
            color: 'bg-purple-500'
        },
        {
            key: 'clients',
            name: 'Clientes',
            description: 'Información de clientes - Sistema por secciones',
            icon: Globe,
            color: 'bg-orange-500'
        },
        {
            key: 'pricing',
            name: 'Precios',
            description: 'Planes y precios de servicios - Sistema por secciones',
            icon: DollarSign,
            color: 'bg-yellow-500'
        },
        {
            key: 'contact',
            name: 'Contacto',
            description: 'Información de contacto - Sistema por secciones',
            icon: Mail,
            color: 'bg-red-500'
        },
        {
            key: 'company',
            name: 'Datos de la Empresa',
            description: 'Estadísticas y métricas globales compartidas',
            icon: Globe,
            color: 'bg-indigo-500'
        },
        {
            key: 'footer',
            name: 'Footer',
            description: 'Configuración del pie de página',
            icon: Layout,
            color: 'bg-gray-500'
        }
    ]

    useEffect(() => {
        fetchPages()
    }, [])

    const fetchPages = async () => {
        try {
            console.log('🔄 Cargando páginas...')
            const response = await adminApi.getPageContents()
            console.log('📥 Páginas recibidas:', response.data)
            setPages(response.data || [])
            console.log('✅ Páginas cargadas exitosamente')
        } catch (error) {
            console.error('❌ Error cargando páginas:', error)
            console.error('❌ Error response:', error.response)
            setPages([])
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        console.log('🔄 Iniciando guardado...')
        console.log('📝 FormData:', formData)
        console.log('✏️ EditingPage:', editingPage)
        
        try {
            if (editingPage) {
                console.log(`🔄 Actualizando página: ${editingPage.page_key}`)
                console.log('📤 Datos a enviar:', formData)
                
                const response = await adminApi.updatePageContent(editingPage.page_key, formData)
                console.log('✅ Respuesta del servidor:', response)
                alert('✅ Página actualizada exitosamente')
            } else {
                console.log('🔄 Creando nueva página')
                console.log('📤 Datos a enviar:', formData)
                
                const response = await adminApi.createPageContent(formData)
                console.log('✅ Respuesta del servidor:', response)
                alert('✅ Página creada exitosamente')
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
            
            console.log('🔄 Recargando páginas...')
            fetchPages()
        } catch (error) {
            console.error('❌ Error completo:', error)
            console.error('❌ Error response:', error.response)
            console.error('❌ Error data:', error.response?.data)
            alert('❌ Error al guardar la página. Revisa la consola para más detalles.')
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
                    hero: {
                        title: 'Sobre Nosotros',
                        subtitle: 'Quiénes somos y qué nos motiva'
                    },
                    mission: '',
                    values: [],
                    team: []
                }
            case 'pricing':
                return {
                    hero: {
                        title: 'Planes y Precios',
                        subtitle: 'Elige el plan perfecto para tu institución educativa'
                    },
                    enterprise: {},
                    faqs: []
                }
            case 'clients':
                return {
                    hero: {
                        title: 'Nuestros Clientes',
                        subtitle: 'Instituciones que confían en nosotros'
                    },
                    clients: [],
                    testimonials: [],
                    metrics: []
                }
            case 'history':
                return {
                    hero: {
                        title: 'Nuestra Historia',
                        subtitle: 'Un viaje de innovación y crecimiento'
                    },
                    intro: {},
                    timeline: [],
                    impact: [],
                    future: {}
                }
            case 'contact':
                return {
                    hero: {
                        title: 'Contáctanos',
                        subtitle: 'Estamos aquí para ayudarte'
                    },
                    contact_items: [
                        {
                            id: 'email',
                            icon: 'Mail',
                            title: 'Email',
                            value: 'contacto@sevp.com',
                            description: 'Respuesta en 24 horas'
                        },
                        {
                            id: 'phone',
                            icon: 'Phone',
                            title: 'Teléfono',
                            value: '+51 1 234-5678',
                            description: 'Lun - Vie, 9am - 6pm'
                        },
                        {
                            id: 'whatsapp',
                            icon: 'Smartphone',
                            title: 'WhatsApp',
                            value: '+51 999 888 777',
                            description: 'Respuesta inmediata'
                        },
                        {
                            id: 'address',
                            icon: 'MapPin',
                            title: 'Oficina',
                            value: 'Lima, Perú',
                            description: 'San Isidro, Lima 27'
                        }
                    ],
                    form: {}
                }
            case 'company':
                return {
                    global_stats: [
                        { number: '500+', label: 'Instituciones', description: 'Instituciones educativas que confían en nosotros' },
                        { number: '100K+', label: 'Estudiantes', description: 'Estudiantes activos en nuestra plataforma' },
                        { number: '15', label: 'Países', description: 'Países donde operamos' },
                        { number: '99.9%', label: 'Satisfacción', description: 'Índice de satisfacción de clientes' }
                    ],
                    success_metrics: [
                        { number: '98%', label: 'Satisfacción del Cliente', description: 'Clientes satisfechos con nuestro servicio' },
                        { number: '45%', label: 'Reducción en Costos', description: 'Reducción promedio en costos operativos' },
                        { number: '300%', label: 'Aumento en Engagement', description: 'Incremento en engagement estudiantil' },
                        { number: '24/7', label: 'Soporte Técnico', description: 'Disponibilidad de soporte' }
                    ]
                }
            case 'footer':
                return {
                    company_info: {
                        name: 'SEVP',
                        description: 'Sistema Educativo Virtual Profesional',
                        logo: ''
                    },
                    contact_info: {
                        address: 'Lima, Perú',
                        phone: '+51 1 234-5678',
                        email: 'contacto@sevp.com'
                    },
                    social_networks: [],
                    links: {
                        quick_links: [],
                        legal_links: []
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

    const getPageUrl = (pageKey: string) => {
        const urlMap: { [key: string]: string } = {
            'homepage': '/',
            'about': '/nosotros',
            'history': '/historia',
            'clients': '/clientes',
            'pricing': '/precios',
            'contact': '/contacto',
            // Páginas especiales
            'company': '/admin/content', // Solo disponible en admin
            'footer': '/' // Footer aparece en todas las páginas
        }
        return urlMap[pageKey] || `/${pageKey}`
    }

    const renderEditor = () => {
        switch (formData.page_key) {
            case 'homepage':
                return (
                    <SectionBasedHomepageEditor
                        content={formData.content_json}
                        onChange={(content) => setFormData({ ...formData, content_json: content })}
                    />
                )
            case 'about':
                return (
                    <SectionBasedAboutEditor
                        content={formData.content_json}
                        onChange={(content) => setFormData({ ...formData, content_json: content })}
                    />
                )
            case 'pricing':
                return (
                    <SectionBasedPricesEditor
                        data={formData.content_json}
                        onChange={(data) => setFormData({ ...formData, content_json: data })}
                    />
                )
            case 'clients':
                return (
                    <SectionBasedClientsEditor
                        data={formData.content_json}
                        onChange={(data) => setFormData({ ...formData, content_json: data })}
                    />
                )
            case 'history':
                return (
                    <SectionBasedHistoryEditor
                        data={formData.content_json}
                        onChange={(data) => setFormData({ ...formData, content_json: data })}
                        metaData={{
                            meta_title: formData.meta_title,
                            meta_description: formData.meta_description,
                            meta_keywords: formData.meta_keywords
                        }}
                        onMetaChange={(meta) => setFormData({ ...formData, ...meta })}
                    />
                )
            case 'contact':
                return (
                    <SectionBasedContactEditor
                        data={formData.content_json}
                        onChange={(data) => setFormData({ ...formData, content_json: data })}
                    />
                )
            case 'company':
                return (
                    <CompanyEditor
                        content={formData.content_json}
                        onChange={(content) => setFormData({ ...formData, content_json: content })}
                    />
                )
            case 'footer':
                return (
                    <FooterEditor
                        data={formData.content_json}
                        onChange={(data) => setFormData({ ...formData, content_json: data })}
                        isStandalone={false}
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
                                        <div className="flex gap-1">
                                            {existingPage ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(existingPage)}
                                                        className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                                                        title="Editar página"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <a
                                                        href={getPageUrl(pageType.key)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-gray-600 text-white hover:bg-gray-700 rounded-md transition-colors shadow-sm"
                                                        title="Ver página"
                                                    >
                                                        <Eye size={18} />
                                                    </a>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleCreateNew(pageType.key)}
                                                    className="p-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors shadow-sm"
                                                    title="Crear contenido"
                                                >
                                                    <Plus size={18} />
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

                            {/* Footer - Solo botones de acción */}
                            <div className="border-t border-gray-200 p-6">
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
