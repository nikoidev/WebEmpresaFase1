'use client'

import { adminApi } from '@/lib/api'
import DevFileInfo from '@/components/DevFileInfo'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'
import SectionEditModal from '@/components/SectionEditModal'
import HomepageHeroModal from '@/components/HomepageHeroModal'
import ClientTypesModal from '@/components/ClientTypesModal'
import NavigationEditModal from '@/components/NavigationEditModal'
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
    Layout,
    Settings,
    Star,
    Heart,
    BookOpen,
    Building,
    Phone,
    Map,
    Calendar,
    Award,
    Target,
    Menu,
    RefreshCw,
    Zap
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
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [editingSectionName, setEditingSectionName] = useState<string>('')
    const [isSaving, setIsSaving] = useState(false)
    const [isSeeding, setIsSeeding] = useState(false)
    const [formData, setFormData] = useState({
        page_key: '',
        title: '',
        content_json: {},
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        is_active: true
    })
    const [pageDisplayName, setPageDisplayName] = useState('')
    const [selectedIcon, setSelectedIcon] = useState('Home')
    const [showNavigationModal, setShowNavigationModal] = useState(false)

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
            key: 'footer',
            name: 'Footer',
            description: 'Configuración del pie de página',
            icon: Layout,
            color: 'bg-gray-500'
        },
        {
            key: 'navigation',
            name: 'Menú de Navegación',
            description: 'Configuración del menú principal de navegación',
            icon: Menu,
            color: 'bg-indigo-500'
        }
    ]

    // Lista de iconos disponibles
    const availableIcons = [
        { name: 'Home', icon: Home, label: 'Casa' },
        { name: 'Users', icon: Users, label: 'Usuarios' },
        { name: 'History', icon: History, label: 'Historia' },
        { name: 'Globe', icon: Globe, label: 'Globo' },
        { name: 'DollarSign', icon: DollarSign, label: 'Dinero' },
        { name: 'Mail', icon: Mail, label: 'Correo' },
        { name: 'Layout', icon: Layout, label: 'Layout' },
        { name: 'Settings', icon: Settings, label: 'Configuración' },
        { name: 'Star', icon: Star, label: 'Estrella' },
        { name: 'Heart', icon: Heart, label: 'Corazón' },
        { name: 'BookOpen', icon: BookOpen, label: 'Libro' },
        { name: 'Building', icon: Building, label: 'Edificio' },
        { name: 'Phone', icon: Phone, label: 'Teléfono' },
        { name: 'Map', icon: Map, label: 'Mapa' },
        { name: 'Calendar', icon: Calendar, label: 'Calendario' },
        { name: 'Award', icon: Award, label: 'Premio' },
        { name: 'Target', icon: Target, label: 'Objetivo' },
        { name: 'FileText', icon: FileText, label: 'Documento' },
        { name: 'Menu', icon: Menu, label: 'Menú' }
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
            console.error('❌ Error response:', (error as any).response)
            setPages([])
        } finally {
            setLoading(false)
        }
    }

    const handleSeedMissingPages = async () => {
        if (!confirm('¿Deseas crear automáticamente todas las páginas faltantes del CMS?\n\nEsto creará las páginas que aún no existen con contenido inicial predefinido.')) {
            return
        }

        setIsSeeding(true)
        try {
            console.log('🌱 Iniciando proceso de seeding...')
            const response = await adminApi.seedMissingPages()
            console.log('✅ Respuesta del servidor:', response.data)
            
            const { message, created_pages, missing_count, total_pages } = response.data
            
            if (created_pages && created_pages.length > 0) {
                const createdList = created_pages.map((p: any) => `  • ${p.title} (${p.page_key})`).join('\n')
                alert(`✅ ${message}\n\n📄 Páginas creadas:\n${createdList}\n\n📊 Total: ${created_pages.length} de ${total_pages} páginas`)
            } else {
                alert(`ℹ️ ${message}\n\nTodas las páginas necesarias ya están configuradas.`)
            }
            
            // Recargar la lista de páginas
            await fetchPages()
        } catch (error: any) {
            console.error('❌ Error al crear páginas:', error)
            const errorMessage = error.response?.data?.detail || error.message || 'Error desconocido'
            alert(`❌ Error al crear las páginas faltantes:\n\n${errorMessage}`)
        } finally {
            setIsSeeding(false)
        }
    }

    // Función para guardar solo metadatos básicos (título, meta, activa, etc.)
    const handleSaveBasicData = async () => {
        if (!editingPage) return
        
        setIsSaving(true)
        try {
            const updatePayload = {
                title: formData.title,
                meta_title: formData.meta_title,
                meta_description: formData.meta_description,
                meta_keywords: formData.meta_keywords,
                is_active: formData.is_active,
                content_json: editingPage.content_json // Preservar contenido existente
            }

            await adminApi.updatePageContent(editingPage.page_key, updatePayload)
            
            await fetchPages() // Recargar lista
            
            console.log('📝 Configuración actualizada:')
            console.log('- Nombre visualización:', pageDisplayName)
            console.log('- Icono seleccionado:', selectedIcon)
            console.log('- Título página:', formData.title)
            console.log('- Meta título:', formData.meta_title)
            console.log('- Página activa:', formData.is_active)
            
            alert(`✅ Datos básicos guardados exitosamente
            
📄 Título: "${formData.title}"
🏷️ Nombre: "${pageDisplayName}"
🎯 Icono: ${availableIcons.find(i => i.name === selectedIcon)?.label || selectedIcon}
${formData.is_active ? '✅ Página activa' : '❌ Página inactiva'}`)
        } catch (error) {
            console.error('❌ Error guardando datos básicos:', error)
            alert('❌ Error al guardar los datos básicos')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSectionEdit = (sectionType: string, sectionName: string) => {
        setEditingSection(sectionType)
        setEditingSectionName(sectionName)
    }

    const handleHomepageSectionEdit = async (section: 'hero' | 'features' | 'cta') => {
        try {
            // Asegurar que editingPage tiene los datos más actualizados antes de abrir el modal de sección
            if (editingPage) {
                const response = await adminApi.getPageContent(editingPage.page_key)
                setEditingPage(response.data)
            }
            
            setEditingSection(section)
            setEditingSectionName(`Sección ${section}`)
        } catch (error) {
            console.error('Error loading fresh page data:', error)
            // Continuar con los datos existentes si hay error
            setEditingSection(section)
            setEditingSectionName(`Sección ${section}`)
        }
    }

    const handleUniversalSectionEdit = (sectionType: string, sectionName: string) => {
        setEditingSection(sectionType)
        setEditingSectionName(sectionName)
    }

    const handleSectionSave = async () => {
        setIsSaving(true)
        try {
            // Recargar contenido después de guardar
            await fetchPages()
            
            // También actualizar editingPage con los datos más recientes
            if (editingPage) {
                const response = await adminApi.getPageContent(editingPage.page_key)
                setEditingPage(response.data)
            }
            
            setEditingSection(null)
            setEditingSectionName('')
            
            // Mostrar notificación de éxito
            const notification = document.createElement('div')
            notification.innerHTML = '✅ Sección actualizada exitosamente'
            notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg'
            document.body.appendChild(notification)
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 3000)
        } finally {
            setIsSaving(false)
        }
    }

    const handleEdit = async (page: PageContent) => {
        try {
            // Obtener datos frescos de la base de datos antes de editar
            console.log('🔄 Obteniendo datos frescos para:', page.page_key)
            const response = await adminApi.getPageContent(page.page_key)
            const freshPage = response.data
            
            setEditingPage(freshPage)
            setFormData({
                page_key: freshPage.page_key,
                title: freshPage.title,
                content_json: freshPage.content_json,
                meta_title: freshPage.meta_title,
                meta_description: freshPage.meta_description,
                meta_keywords: freshPage.meta_keywords,
                is_active: freshPage.is_active
            })
            
            // Inicializar campos adicionales
            const pageType = pageTypes.find(p => p.key === freshPage.page_key)
            setPageDisplayName(pageType?.name || '')
            setSelectedIcon(pageType?.icon.name || 'Home')
            console.log('✅ Datos frescos cargados:', freshPage)
        } catch (error) {
            console.error('❌ Error obteniendo datos frescos:', error)
            // Usar datos existentes si hay error
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
            
            // Inicializar campos adicionales
            const pageType = pageTypes.find(p => p.key === page.page_key)
            setPageDisplayName(pageType?.name || '')
            setSelectedIcon(pageType?.icon.name || 'Home')
        }
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
        
        // Inicializar campos adicionales
        setPageDisplayName(pageType?.name || '')
        setSelectedIcon(pageType?.icon.name || 'Home')
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
            case 'navigation':
                return {
                    navigation_items: [
                        { name: 'Inicio', href: '/', icon: 'Home' },
                        { name: 'Nosotros', href: '/nosotros', icon: 'Users' },
                        { name: 'Historia', href: '/historia', icon: 'History' },
                        { name: 'Clientes', href: '/clientes', icon: 'Globe' },
                        { name: 'Precios', href: '/precios', icon: 'DollarSign' },
                        { name: 'Contacto', href: '/contacto', icon: 'Mail' }
                    ]
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
            'footer': '/' // Footer aparece en todas las páginas
        }
        return urlMap[pageKey] || `/${pageKey}`
    }

    const getSectionsForPage = (pageKey: string) => {
        switch (pageKey) {
            case 'homepage':
                return [
                    { key: 'hero', name: 'Sección Hero' },
                    { key: 'features', name: 'Características' },
                    { key: 'cta', name: 'Llamada a la Acción' }
                ]
            case 'about':
                return [
                    { key: 'hero', name: 'Sección Hero' },
                    { key: 'mission', name: 'Misión y Visión' },
                    { key: 'values', name: 'Valores' },
                    { key: 'team', name: 'Equipo' },
                    { key: 'cta', name: 'Llamada a la Acción' }
                ]
            case 'history':
                return [
                    { key: 'hero', name: 'Sección Hero' },
                    { key: 'intro', name: 'Introducción' },
                    { key: 'timeline', name: 'Línea de Tiempo' },
                    { key: 'impact', name: 'Números de Impacto' },
                    { key: 'future', name: 'Visión de Futuro' }
                ]
            case 'clients':
                return [
                    { key: 'hero', name: 'Sección Hero' },
                    { key: 'client_types', name: 'Tipos de Clientes' },
                    { key: 'testimonials', name: 'Testimonios' },
                    { key: 'metrics', name: 'Métricas de Éxito' },
                    { key: 'cta', name: 'Llamada a la Acción' }
                ]
            case 'pricing':
                return [
                    { key: 'hero', name: 'Sección Hero' },
                    { key: 'pricing', name: 'Planes y Precios' },
                    { key: 'enterprise', name: 'Sección Empresarial' },
                    { key: 'faq', name: 'Preguntas Frecuentes' }
                ]
            case 'contact':
                return [
                    { key: 'hero', name: 'Sección Hero' },
                    { key: 'contact_info', name: 'Información de Contacto' },
                    { key: 'form', name: 'Formulario de Contacto' },
                    { key: 'faq', name: 'Preguntas Frecuentes' }
                ]
            case 'footer':
                return [
                    { key: 'company_info', name: 'Información de la Empresa' },
                    { key: 'contact_info', name: 'Información de Contacto' },
                    { key: 'social_networks', name: 'Redes Sociales' },
                    { key: 'links', name: 'Enlaces' }
                ]
            default:
                return []
        }
    }

    const renderEditor = () => {
        // Caso especial para navegación
        if (formData.page_key === 'navigation') {
            return (
                <div className="p-6 text-center">
                    <div className="max-w-md mx-auto">
                        <Menu className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Configuración del Menú de Navegación
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Configura los enlaces y iconos del menú principal de navegación de tu sitio web.
                        </p>
                        <button
                            onClick={() => setShowNavigationModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <Menu className="h-4 w-4 mr-2" />
                            Editar Menú de Navegación
                        </button>
                    </div>
                </div>
            )
        }

        const sections = getSectionsForPage(formData.page_key)
        
        if (sections.length === 0) {
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

        return (
            <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                {/* Header más compacto */}
                <div className="mb-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-3">
                        <Edit className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Secciones Editables
                    </h3>
                    <p className="text-base font-medium text-blue-600 mb-2">
                        {getPageName(formData.page_key)}
                    </p>
                    <p className="text-sm text-gray-600 max-w-xl mx-auto">
                        Cada sección utiliza el mismo editor avanzado que las páginas públicas.
                    </p>
                </div>
                
                {/* Grid de secciones más compacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {sections.map((section, index) => {
                        // Colores dinámicos para cada sección
                        const colors = [
                            { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-300' },
                            { bg: 'bg-gradient-to-br from-green-500 to-green-600', border: 'border-green-200', hover: 'hover:border-green-300' },
                            { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-300' },
                            { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', border: 'border-orange-200', hover: 'hover:border-orange-300' },
                            { bg: 'bg-gradient-to-br from-red-500 to-red-600', border: 'border-red-200', hover: 'hover:border-red-300' }
                        ]
                        const colorScheme = colors[index % colors.length]
                        
                        return (
                            <div 
                                key={section.key} 
                                className={`bg-white border-2 ${colorScheme.border} ${colorScheme.hover} rounded-lg p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                            >
                                <div className="text-center">
                                    {/* Icono más pequeño */}
                                    <div className={`${colorScheme.bg} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md`}>
                                        <Edit className="h-5 w-5 text-white" />
                                    </div>
                                    
                                    {/* Información más compacta */}
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                                        {section.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 mb-3 font-medium">
                                        {section.key}
                                    </p>
                                    
                                    {/* Botón más compacto */}
                                    <button
                                        onClick={() => {
                                            if (formData.page_key === 'homepage') {
                                                handleHomepageSectionEdit(section.key as 'hero' | 'features' | 'cta')
                                            } else {
                                                handleUniversalSectionEdit(section.key, section.name)
                                            }
                                        }}
                                        className={`w-full ${colorScheme.bg} text-white font-semibold py-2 px-3 rounded-md hover:shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-sm`}
                                    >
                                        <Edit className="h-4 w-4" />
                                        Editar
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Panel de información más compacto */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-base font-bold text-blue-900 mb-1">
                                💡 Editor Avanzado por Secciones
                            </h4>
                            <p className="text-blue-800 text-sm leading-relaxed mb-2">
                                Cada sección cuenta con un editor especializado con campos específicos y sincronización automática.
                            </p>
                            <div className="flex flex-wrap gap-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    ✨ WYSIWYG
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    🔄 Auto-sync
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    📱 Responsive
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="h-full space-y-8">
            <DevFileInfo filePath="frontend/src/app/admin/content/page.tsx" />
            
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenido</h1>
                    <p className="mt-2 text-gray-600">
                        Administra el contenido de todas las páginas públicas de tu sitio web
                    </p>
                </div>
                
                {/* Botón para crear páginas faltantes */}
                <button
                    onClick={handleSeedMissingPages}
                    disabled={isSeeding}
                    className={`inline-flex items-center px-5 py-3 rounded-lg font-semibold text-white shadow-lg transition-all transform hover:scale-105 ${
                        isSeeding 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl'
                    }`}
                    title="Detectar y crear automáticamente las páginas que faltan"
                >
                    {isSeeding ? (
                        <>
                            <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                            Creando...
                        </>
                    ) : (
                        <>
                            <Zap className="h-5 w-5 mr-2" />
                            Crear Páginas Faltantes
                        </>
                    )}
                </button>
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
                                        {pageType.key === 'navigation' ? (
                                            // Caso especial para navegación - siempre abrir modal CRUD
                                            <button
                                                onClick={() => setShowNavigationModal(true)}
                                                className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors shadow-sm"
                                                title="Configurar navegación"
                                            >
                                                <Menu size={18} />
                                            </button>
                                        ) : existingPage ? (
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
                                {pageType.key === 'navigation' ? (
                                    // Estado especial para navegación
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            📋 CRUD Disponible
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Clic para configurar
                                        </span>
                                    </div>
                                ) : existingPage ? (
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
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[85vh] flex flex-col">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {/* Columna izquierda - Información básica */}
                                <div className="space-y-4">
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
                                </div>

                                {/* Columna derecha - Configuración avanzada */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre de Visualización
                                        </label>
                                        <input
                                            type="text"
                                            value={pageDisplayName}
                                            onChange={(e) => setPageDisplayName(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                            placeholder="Nombre que aparece en menús"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Icono de la Página
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-1">
                                                <select
                                                    value={selectedIcon}
                                                    onChange={(e) => setSelectedIcon(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                                >
                                                    {availableIcons.map((iconOption) => (
                                                        <option key={iconOption.name} value={iconOption.name}>
                                                            {iconOption.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                {(() => {
                                                    const IconComponent = availableIcons.find(i => i.name === selectedIcon)?.icon || Home
                                                    return <IconComponent className="h-5 w-5 text-gray-600" />
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fila inferior - Controles */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Página Activa</span>
                                    </label>
                                </div>
                                
                                {editingPage && (
                                    <button
                                        onClick={handleSaveBasicData}
                                        disabled={isSaving}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {isSaving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content Editor */}
                        <div className="flex-1 overflow-y-auto">
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
                                    Cerrar
                                </button>
                                {/* 
                                ❌ BOTÓN "ACTUALIZAR" ELIMINADO 
                                Las páginas con sistema de secciones se editan mediante los modales individuales
                                de cada sección, no desde este modal principal.
                                */}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de edición por sección - igual que en las páginas públicas */}
            {editingSection && editingPage && (
                <>
                    {editingPage.page_key === 'homepage' && editingSection === 'hero' ? (
                        // Usar el mismo modal que HomePage para Hero
                        <HomepageHeroModal
                            isOpen={!!editingSection}
                            onClose={() => setEditingSection(null)}
                            onSave={handleSectionSave}
                        />
                    ) : editingPage.page_key === 'homepage' ? (
                        // Otras secciones de homepage (features, cta)
                        <SectionEditModal
                            isOpen={!!editingSection}
                            onClose={() => setEditingSection(null)}
                            sectionType={(editingSection || 'hero') as 'hero' | 'features' | 'cta'}
                            pageKey={editingPage.page_key}
                            initialContent={editingPage}
                            onSave={handleSectionSave}
                        />
                    ) : editingPage.page_key === 'clients' && editingSection === 'client_types' ? (
                        // Modal dedicado para tipos de clientes
                        <ClientTypesModal
                            isOpen={!!editingSection}
                            onClose={() => setEditingSection(null)}
                            pageKey={editingPage.page_key}
                            initialContent={editingPage}
                            onSave={handleSectionSave}
                            isSaving={isSaving}
                        />
                    ) : (
                        <UniversalSectionEditModal
                            isOpen={!!editingSection}
                            onClose={() => setEditingSection(null)}
                            sectionType={editingSection}
                            sectionName={editingSectionName}
                            pageKey={editingPage.page_key}
                            initialContent={editingPage}
                            onSave={handleSectionSave}
                            isSaving={isSaving}
                        />
                    )}
                </>
            )}

            {/* Modal de Navegación */}
            <NavigationEditModal
                isOpen={showNavigationModal}
                onClose={() => setShowNavigationModal(false)}
                onSave={async () => {
                    await fetchPages()
                    setShowNavigationModal(false)
                }}
            />
        </div>
    )
}