'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, User } from 'lucide-react'
import { adminApi } from '@/lib/api'

interface UniversalSectionEditModalProps {
    isOpen: boolean
    onClose: () => void
    sectionType: string
    sectionName: string
    pageKey: string
    initialContent: any
    onSave: () => Promise<void>
}

export default function UniversalSectionEditModal({
    isOpen,
    onClose,
    sectionType,
    sectionName,
    pageKey,
    initialContent,
    onSave
}: UniversalSectionEditModalProps) {
    
    const [isSaving, setIsSaving] = useState(false)
    const [content, setContent] = useState<any>({})

    // Actualizar contenido cuando cambie initialContent
    useEffect(() => {
        if (initialContent?.content_json) {
            setContent(initialContent.content_json)
        }
    }, [initialContent])

    if (!isOpen) return null

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Actualizar el contenido completo
            await adminApi.updatePageContent(pageKey, {
                title: initialContent.title,
                content_json: content,
                meta_title: initialContent.meta_title,
                meta_description: initialContent.meta_description,
                meta_keywords: initialContent.meta_keywords,
                is_active: initialContent.is_active
            })
            
            // Llamar onSave ANTES de cerrar el modal para recargar contenido
            await onSave()
            onClose()
            
            // Mostrar notificación temporal
            const notification = document.createElement('div')
            notification.innerHTML = '✅ Sección actualizada exitosamente'
            notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg'
            document.body.appendChild(notification)
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification)
                }
            }, 3000)
        } catch (error) {
            console.error('Error saving section:', error)
            alert('❌ Error al guardar la sección')
        } finally {
            setIsSaving(false)
        }
    }

    const updateContent = (field: string, value: any) => {
        setContent((prev: any) => {
            const newContent = { ...prev }
            
            // Manejar campos anidados como "hero.title"
            if (field.includes('.')) {
                const [section, subField] = field.split('.')
                if (!newContent[section]) newContent[section] = {}
                newContent[section][subField] = value
            } else {
                newContent[field] = value
            }
            
            return newContent
        })
    }

    const renderSectionEditor = () => {
        const sectionData = content[sectionType] || {}

        switch (sectionType) {
            case 'hero':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={sectionData.title || content.hero_title || ''}
                                onChange={(e) => {
                                    if (content.hero) {
                                        updateContent('hero.title', e.target.value)
                                    } else {
                                        updateContent('hero_title', e.target.value)
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Título del hero"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={sectionData.subtitle || content.hero_subtitle || ''}
                                onChange={(e) => {
                                    if (content.hero) {
                                        updateContent('hero.subtitle', e.target.value)
                                    } else {
                                        updateContent('hero_subtitle', e.target.value)
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Subtítulo del hero"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                rows={4}
                                value={sectionData.description || content.hero_description || ''}
                                onChange={(e) => {
                                    if (content.hero) {
                                        updateContent('hero.description', e.target.value)
                                    } else {
                                        updateContent('hero_description', e.target.value)
                                    }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción del hero"
                            />
                        </div>
                    </div>
                )

            case 'mission':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Misión
                            </label>
                            <textarea
                                rows={4}
                                value={content.mission || ''}
                                onChange={(e) => updateContent('mission', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Texto de la misión"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de la Misión
                            </label>
                            <textarea
                                rows={3}
                                value={content.mission_description || ''}
                                onChange={(e) => updateContent('mission_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción adicional de la misión"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visión
                            </label>
                            <textarea
                                rows={4}
                                value={content.vision || ''}
                                onChange={(e) => updateContent('vision', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Texto de la visión"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción de la Visión
                            </label>
                            <textarea
                                rows={3}
                                value={content.vision_description || ''}
                                onChange={(e) => updateContent('vision_description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Descripción adicional de la visión"
                            />
                        </div>
                    </div>
                )

            case 'contact_info':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={content.contact_info?.email || ''}
                                    onChange={(e) => updateContent('contact_info.email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="contacto@empresa.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={content.contact_info?.phone || ''}
                                    onChange={(e) => updateContent('contact_info.phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="+51 999 999 999"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    value={content.contact_info?.address || ''}
                                    onChange={(e) => updateContent('contact_info.address', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Lima, Perú"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Horario
                                </label>
                                <input
                                    type="text"
                                    value={content.contact_info?.hours || ''}
                                    onChange={(e) => updateContent('contact_info.hours', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="9:00 AM - 6:00 PM"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 'values':
                const values = content.values || []
                const availableIcons = [
                    { emoji: '💎', name: 'Diamante' },
                    { emoji: '🎆', name: 'Fuegos artificiales' },
                    { emoji: '⭐', name: 'Estrella' },
                    { emoji: '🚀', name: 'Cohete' },
                    { emoji: '💪', name: 'Músculo' },
                    { emoji: '❤️', name: 'Corazón' },
                    { emoji: '🤝', name: 'Apretón de manos' },
                    { emoji: '🏆', name: 'Trofeo' },
                    { emoji: '💡', name: 'Bombilla' },
                    { emoji: '🌱', name: 'Brote' },
                    { emoji: '🔥', name: 'Fuego' },
                    { emoji: '⚡', name: 'Rayo' },
                    { emoji: '🎯', name: 'Diana' },
                    { emoji: '🥰', name: 'Cara enamorada' },
                    { emoji: '🦜', name: 'Genio' },
                    { emoji: '🙏', name: 'Manos juntas' },
                    { emoji: '🌍', name: 'Mundo' },
                    { emoji: '🔍', name: 'Lupa' },
                    { emoji: '⚙️', name: 'Engranaje' },
                    { emoji: '🌈', name: 'Arcoiris' }
                ]
                
                return (
                    <div className="space-y-6">
                        {/* Títulos de la sección */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de la Sección</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.values_title || ''}
                                        onChange={(e) => updateContent('values_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Nuestros Valores"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtítulo de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.values_description || ''}
                                        onChange={(e) => updateContent('values_description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Los principios que guían cada decisión que tomamos"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Lista de valores */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Valores de la Empresa</h3>
                            <button
                                onClick={() => {
                                    const newValues = [...values, {
                                        title: 'Nuevo Valor',
                                        description: 'Descripción del valor',
                                        icon: '💎'
                                    }]
                                    updateContent('values', newValues)
                                }}
                                className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar Valor
                            </button>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {values.map((value: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-sm font-medium text-gray-500">Valor #{index + 1}</span>
                                        <button
                                            onClick={() => {
                                                const newValues = values.filter((_: any, i: number) => i !== index)
                                                updateContent('values', newValues)
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-2">
                                            Seleccionar Icono
                                        </label>
                                        <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                                            {availableIcons.map((iconOption, iconIndex) => (
                                                <button
                                                    key={iconIndex}
                                                    type="button"
                                                    onClick={() => {
                                                        const newValues = [...values]
                                                        newValues[index] = { ...newValues[index], icon: iconOption.emoji }
                                                        updateContent('values', newValues)
                                                    }}
                                                    className={`p-2 text-xl rounded hover:bg-gray-200 transition-colors ${
                                                        value.icon === iconOption.emoji ? 'bg-primary-100 ring-2 ring-primary-500' : ''
                                                    }`}
                                                    title={iconOption.name}
                                                >
                                                    {iconOption.emoji}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={value.icon || ''}
                                                onChange={(e) => {
                                                    const newValues = [...values]
                                                    newValues[index] = { ...newValues[index], icon: e.target.value }
                                                    updateContent('values', newValues)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="O escribe tu propio emoji: 💎"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Título
                                            </label>
                                            <input
                                                type="text"
                                                value={value.title || ''}
                                                onChange={(e) => {
                                                    const newValues = [...values]
                                                    newValues[index] = { ...newValues[index], title: e.target.value }
                                                    updateContent('values', newValues)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Título del valor"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={value.description || ''}
                                            onChange={(e) => {
                                                const newValues = [...values]
                                                newValues[index] = { ...newValues[index], description: e.target.value }
                                                updateContent('values', newValues)
                                            }}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            placeholder="Descripción del valor"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {values.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No hay valores agregados</p>
                                <p className="text-sm">Haz clic en "Agregar Valor" para comenzar</p>
                            </div>
                        )}
                    </div>
                )

            case 'team':
                const team = content.team || []
                return (
                    <div className="space-y-6">
                        {/* Títulos de la sección */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de la Sección</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.team_title || ''}
                                        onChange={(e) => updateContent('team_title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Nuestro Equipo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtítulo de la Sección
                                    </label>
                                    <input
                                        type="text"
                                        value={content.team_description || ''}
                                        onChange={(e) => updateContent('team_description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Profesionales apasionados por la educación y la tecnología"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Lista de miembros */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">Miembros del Equipo</h3>
                            <button
                                onClick={() => {
                                    const newTeam = [...team, {
                                        name: 'Nuevo Miembro',
                                        position: 'Cargo',
                                        bio: 'Biografía breve...',
                                        image: '',
                                        linkedin: '',
                                        email: ''
                                    }]
                                    updateContent('team', newTeam)
                                }}
                                className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm hover:bg-primary-700 flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar Miembro
                            </button>
                        </div>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {team.map((member: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-sm font-medium text-gray-500">Miembro #{index + 1}</span>
                                        <button
                                            onClick={() => {
                                                const newTeam = team.filter((_: any, i: number) => i !== index)
                                                updateContent('team', newTeam)
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={member.name || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], name: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="Nombre completo"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Cargo
                                            </label>
                                            <input
                                                type="text"
                                                value={member.position || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], position: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="CEO, CTO, etc."
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Biografía
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={member.bio || ''}
                                            onChange={(e) => {
                                                const newTeam = [...team]
                                                newTeam[index] = { ...newTeam[index], bio: e.target.value }
                                                updateContent('team', newTeam)
                                            }}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            placeholder="Biografía breve del miembro del equipo"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                LinkedIn (opcional)
                                            </label>
                                            <input
                                                type="url"
                                                value={member.linkedin || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], linkedin: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Email (opcional)
                                            </label>
                                            <input
                                                type="email"
                                                value={member.email || ''}
                                                onChange={(e) => {
                                                    const newTeam = [...team]
                                                    newTeam[index] = { ...newTeam[index], email: e.target.value }
                                                    updateContent('team', newTeam)
                                                }}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                placeholder="email@empresa.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {team.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No hay miembros del equipo agregados</p>
                                <p className="text-sm">Haz clic en "Agregar Miembro" para comenzar</p>
                            </div>
                        )}
                    </div>
                )

            case 'cta':
                const cta = content.call_to_action || {}
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-gray-900">Llamada a la Acción</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={cta.title || ''}
                                onChange={(e) => updateContent('call_to_action.title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="¿Quieres formar parte de nuestra misión?"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                rows={3}
                                value={cta.description || ''}
                                onChange={(e) => updateContent('call_to_action.description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Estamos siempre buscando personas talentosas..."
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto Botón Principal
                                </label>
                                <input
                                    type="text"
                                    value={cta.primary_button_text || ''}
                                    onChange={(e) => updateContent('call_to_action.primary_button_text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Únete al Equipo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace Botón Principal
                                </label>
                                <input
                                    type="url"
                                    value={cta.primary_button_link || ''}
                                    onChange={(e) => updateContent('call_to_action.primary_button_link', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto Botón Secundario
                                </label>
                                <input
                                    type="text"
                                    value={cta.secondary_button_text || ''}
                                    onChange={(e) => updateContent('call_to_action.secondary_button_text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Contáctanos"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace Botón Secundario
                                </label>
                                <input
                                    type="url"
                                    value={cta.secondary_button_link || ''}
                                    onChange={(e) => updateContent('call_to_action.secondary_button_link', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="p-8 text-center text-gray-500">
                        <h3 className="text-lg font-medium mb-2">Sección: {sectionName}</h3>
                        <p>Editor específico en desarrollo para esta sección.</p>
                        <p className="text-sm mt-2">Tipo: {sectionType}</p>
                    </div>
                )
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[90vh] shadow-lg rounded-md bg-white flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-900">
                        Editar {sectionName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderSectionEditor()}
                </div>
                
                {/* Footer */}
                <div className="flex justify-end space-x-4 p-6 border-t flex-shrink-0">
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
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    )
}
