'use client'

import { useState, useEffect } from 'react'
import { 
    X, 
    Plus, 
    Trash2, 
    Save, 
    Menu,
    Home,
    Users,
    History,
    Globe,
    DollarSign,
    Mail,
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
    FileText,
    Eye,
    MoveUp,
    MoveDown,
    ExternalLink,
    Loader2
} from 'lucide-react'
import { adminApi } from '@/lib/api'

interface NavigationItem {
    name: string
    href: string
    icon?: string
    id?: string
}

interface NavigationEditModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
}

export default function NavigationEditModal({ 
    isOpen, 
    onClose, 
    onSave 
}: NavigationEditModalProps) {
    const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

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
        { name: 'Menu', icon: Menu, label: 'Menú' },
        { name: 'Eye', icon: Eye, label: 'Ver' }
    ]

    useEffect(() => {
        if (isOpen) {
            loadNavigationData()
        }
    }, [isOpen])

    const loadNavigationData = async () => {
        setIsLoading(true)
        try {
            console.log('🔄 Cargando datos de navegación...')
            const response = await adminApi.getPageContent('navigation')
            console.log('📥 Respuesta del servidor:', response.data)
            
            if (response.data?.content_json?.navigation_items) {
                const items = response.data.content_json.navigation_items.map((item: any, index: number) => ({
                    ...item,
                    id: item.id || `nav-${index}`
                }))
                setNavigationItems(items)
                setHasChanges(false)
                console.log('✅ Elementos de navegación cargados:', items)
            } else {
                console.log('⚠️ No se encontraron elementos, usando valores por defecto')
                // Valores por defecto si no existe contenido
                const defaultItems = [
                    { id: 'nav-0', name: 'Inicio', href: '/', icon: 'Home' },
                    { id: 'nav-1', name: 'Nosotros', href: '/nosotros', icon: 'Users' },
                    { id: 'nav-2', name: 'Historia', href: '/historia', icon: 'History' },
                    { id: 'nav-3', name: 'Clientes', href: '/clientes', icon: 'Globe' },
                    { id: 'nav-4', name: 'Precios', href: '/precios', icon: 'DollarSign' },
                    { id: 'nav-5', name: 'Contacto', href: '/contacto', icon: 'Mail' }
                ]
                setNavigationItems(defaultItems)
                setHasChanges(true) // Marcar como cambios para que se pueda guardar
            }
        } catch (error) {
            console.error('❌ Error cargando navegación:', error)
            console.log('🔄 Usando valores por defecto debido al error de conexión')
            // Valores por defecto en caso de error
            const defaultItems = [
                { id: 'nav-0', name: 'Inicio', href: '/', icon: 'Home' },
                { id: 'nav-1', name: 'Nosotros', href: '/nosotros', icon: 'Users' },
                { id: 'nav-2', name: 'Historia', href: '/historia', icon: 'History' },
                { id: 'nav-3', name: 'Clientes', href: '/clientes', icon: 'Globe' },
                { id: 'nav-4', name: 'Precios', href: '/precios', icon: 'DollarSign' },
                { id: 'nav-5', name: 'Contacto', href: '/contacto', icon: 'Mail' }
            ]
            setNavigationItems(defaultItems)
            setHasChanges(true) // Marcar como cambios para permitir guardar
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            console.log('💾 Guardando navegación:', navigationItems)
            
            // Validar que todos los elementos tengan nombre y href
            const validItems = navigationItems.filter(item => item.name.trim() && item.href.trim())
            
            if (validItems.length === 0) {
                alert('❌ Debes tener al menos un enlace válido con nombre y URL')
                setIsSaving(false)
                return
            }

            const payload = {
                title: 'Menú de Navegación',
                content_json: {
                    navigation_items: validItems.map(item => ({
                        name: item.name.trim(),
                        href: item.href.trim(),
                        icon: item.icon || 'Home'
                    }))
                },
                meta_title: 'Menú de Navegación',
                meta_description: 'Configuración del menú principal de navegación',
                meta_keywords: 'navegación, menú, enlaces',
                is_active: true
            }

            await adminApi.updatePageContent('navigation', payload)
            
            console.log('✅ Navegación guardada exitosamente')
            setHasChanges(false)
            await onSave()
            onClose()
            
            // Mostrar notificación de éxito
            alert(`✅ Menú de navegación guardado exitosamente
            
📊 ${validItems.length} enlaces configurados
🔄 Los cambios se aplicarán inmediatamente en el sitio web`)
        } catch (error) {
            console.error('❌ Error guardando navegación:', error)
            alert('❌ Error al guardar el menú de navegación. Revisa la consola para más detalles.')
        } finally {
            setIsSaving(false)
        }
    }

    const addNavigationItem = () => {
        const newId = `nav-${Date.now()}`
        const newItem = { 
            id: newId,
            name: 'Nuevo Enlace', 
            href: '/nueva-pagina', 
            icon: 'Home' 
        }
        setNavigationItems([...navigationItems, newItem])
        setHasChanges(true)
        console.log('➕ Nuevo enlace agregado:', newItem)
    }

    const removeNavigationItem = (index: number) => {
        const itemToRemove = navigationItems[index]
        setNavigationItems(navigationItems.filter((_, i) => i !== index))
        setHasChanges(true)
        console.log('🗑️ Enlace eliminado:', itemToRemove)
    }

    const updateNavigationItem = (index: number, field: keyof NavigationItem, value: string) => {
        const updatedItems = [...navigationItems]
        updatedItems[index] = { ...updatedItems[index], [field]: value }
        setNavigationItems(updatedItems)
        setHasChanges(true)
        console.log(`📝 Campo ${field} actualizado en índice ${index}:`, value)
    }

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= navigationItems.length) return

        const updatedItems = [...navigationItems]
        const temp = updatedItems[index]
        updatedItems[index] = updatedItems[newIndex]
        updatedItems[newIndex] = temp
        
        setNavigationItems(updatedItems)
        setHasChanges(true)
        console.log(`🔄 Elemento movido ${direction}:`, temp)
    }

    const duplicateItem = (index: number) => {
        const itemToDuplicate = navigationItems[index]
        const newItem = { 
            ...itemToDuplicate, 
            id: `nav-${Date.now()}`,
            name: `${itemToDuplicate.name} (Copia)` 
        }
        const updatedItems = [...navigationItems]
        updatedItems.splice(index + 1, 0, newItem)
        setNavigationItems(updatedItems)
        setHasChanges(true)
        console.log('📋 Elemento duplicado:', newItem)
    }

    const getIconComponent = (iconName: string) => {
        const iconData = availableIcons.find(i => i.name === iconName)
        return iconData?.icon || Home
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[85vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Menu className="h-6 w-6 text-indigo-600 mr-3" />
                            <h2 className="text-xl font-bold text-gray-900">
                                Editar Menú de Navegación
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Configura los enlaces y iconos del menú principal de navegación
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mr-3" />
                            <span className="text-gray-600">Cargando menú de navegación...</span>
                        </div>
                    ) : (
                        <>
                            {/* Header con estadísticas */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-indigo-900">
                                            📊 Estado del Menú
                                        </h3>
                                        <p className="text-indigo-700 text-sm">
                                            {navigationItems.length} enlaces configurados
                                            {hasChanges && (
                                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                    ⚠️ Cambios sin guardar
                                                </span>
                                            )}
                                            {navigationItems.length > 0 && navigationItems.every(item => item.id?.startsWith('nav-')) && (
                                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    🔄 Datos de ejemplo
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        onClick={addNavigationItem}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Enlace
                                    </button>
                                </div>
                            </div>

                            {/* Lista de enlaces */}
                            <div className="space-y-4">
                                {navigationItems.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <Menu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay enlaces configurados</h3>
                                        <p className="text-gray-600 mb-4">Agrega tu primer enlace de navegación</p>
                                        <button
                                            onClick={addNavigationItem}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Crear Primer Enlace
                                        </button>
                                    </div>
                                ) : (
                                    navigationItems.map((item, index) => (
                                        <div key={item.id || index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                                            {/* Header del item */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <span className="text-indigo-600 font-bold text-sm">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Enlace #{index + 1}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            ID: {item.id || `temp-${index}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {/* Controles del item */}
                                                <div className="flex items-center space-x-1">
                                                    {/* Mover arriba */}
                                                    <button
                                                        onClick={() => moveItem(index, 'up')}
                                                        disabled={index === 0}
                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Mover arriba"
                                                    >
                                                        <MoveUp className="h-4 w-4" />
                                                    </button>
                                                    
                                                    {/* Mover abajo */}
                                                    <button
                                                        onClick={() => moveItem(index, 'down')}
                                                        disabled={index === navigationItems.length - 1}
                                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Mover abajo"
                                                    >
                                                        <MoveDown className="h-4 w-4" />
                                                    </button>
                                                    
                                                    {/* Duplicar */}
                                                    <button
                                                        onClick={() => duplicateItem(index)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                                                        title="Duplicar enlace"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                    
                                                    {/* Vista previa */}
                                                    {item.href && (
                                                        <a
                                                            href={item.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors"
                                                            title="Abrir enlace"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                    
                                                    {/* Eliminar */}
                                                    <button
                                                        onClick={() => removeNavigationItem(index)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                                                        title="Eliminar enlace"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Campos del formulario */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Nombre del enlace */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        📝 Nombre del Enlace
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => updateNavigationItem(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                        placeholder="Ej: Inicio, Contacto..."
                                                    />
                                                    {!item.name.trim() && (
                                                        <p className="text-xs text-red-600 mt-1">⚠️ Nombre requerido</p>
                                                    )}
                                                </div>

                                                {/* URL del enlace */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        🔗 URL/Ruta
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.href}
                                                        onChange={(e) => updateNavigationItem(index, 'href', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                        placeholder="/ruta, https://ejemplo.com"
                                                    />
                                                    {!item.href.trim() && (
                                                        <p className="text-xs text-red-600 mt-1">⚠️ URL requerida</p>
                                                    )}
                                                </div>

                                                {/* Icono */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        🎨 Icono
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <select
                                                            value={item.icon || 'Home'}
                                                            onChange={(e) => updateNavigationItem(index, 'icon', e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                                        >
                                                            {availableIcons.map((iconOption) => (
                                                                <option key={iconOption.name} value={iconOption.name}>
                                                                    {iconOption.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="w-10 h-10 bg-gray-100 border border-gray-300 rounded-md flex items-center justify-center">
                                                            {(() => {
                                                                const IconComponent = getIconComponent(item.icon || 'Home')
                                                                return <IconComponent className="h-5 w-5 text-gray-600" />
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Vista previa mejorada */}
                            {navigationItems.length > 0 && (
                                <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Eye className="h-5 w-5 mr-2 text-gray-600" />
                                        Vista Previa del Menú
                                    </h3>
                                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                                        <div className="flex flex-wrap gap-3">
                                            {navigationItems.map((item, index) => (
                                                <div 
                                                    key={item.id || index} 
                                                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md border transition-colors"
                                                >
                                                    {(() => {
                                                        const IconComponent = getIconComponent(item.icon || 'Home')
                                                        return <IconComponent className="h-4 w-4 text-gray-600" />
                                                    })()}
                                                    <span className="text-sm text-gray-700 font-medium">{item.name || 'Sin nombre'}</span>
                                                    {!item.name.trim() || !item.href.trim() ? (
                                                        <span className="text-xs text-red-500">⚠️</span>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-3">
                                            💡 Así se verá el menú en tu sitio web
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        {/* Información del estado */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                                <Menu className="h-4 w-4 mr-1 text-indigo-600" />
                                {navigationItems.length} enlaces
                            </span>
                            {hasChanges && (
                                <span className="flex items-center text-amber-600">
                                    ⚠️ Cambios sin guardar
                                </span>
                            )}
                            {navigationItems.filter(item => !item.name.trim() || !item.href.trim()).length > 0 && (
                                <span className="flex items-center text-red-600">
                                    🚫 {navigationItems.filter(item => !item.name.trim() || !item.href.trim()).length} enlaces inválidos
                                </span>
                            )}
                        </div>
                        
                        {/* Botones de acción */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    if (hasChanges) {
                                        const confirmClose = confirm('¿Estás seguro? Se perderán los cambios no guardados.')
                                        if (confirmClose) onClose()
                                    } else {
                                        onClose()
                                    }
                                }}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={isSaving}
                            >
                                {hasChanges ? 'Descartar' : 'Cancelar'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || navigationItems.filter(item => item.name.trim() && item.href.trim()).length === 0}
                                className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Menú
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Ayuda contextual */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800">
                            💡 <strong>Consejos:</strong> Usa rutas internas como "/contacto" o URLs completas como "https://ejemplo.com". 
                            Los iconos son opcionales pero mejoran la experiencia visual.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
