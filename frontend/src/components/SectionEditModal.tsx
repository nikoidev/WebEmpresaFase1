'use client'

import { useState, useEffect } from 'react'
import { X, Save, ImageIcon, Video } from 'lucide-react'
import { adminApi } from '@/lib/api'
import MediaSelector from './MediaSelector'

interface SectionEditModalProps {
    isOpen: boolean
    onClose: () => void
    sectionType: 'hero' | 'features' | 'cta'
    pageKey: string
    initialContent: any
    onSave: () => Promise<void>
}

export default function SectionEditModal({
    isOpen,
    onClose,
    sectionType,
    pageKey,
    initialContent,
    onSave
}: SectionEditModalProps) {
    const [content, setContent] = useState(initialContent?.content_json || {})
    const [isSaving, setIsSaving] = useState(false)
    const [mediaSelector, setMediaSelector] = useState<{
        isOpen: boolean
        type: 'image' | 'video'
        field: string
    }>({ isOpen: false, type: 'image', field: '' })

    // Manejar selección de medios
    const handleMediaSelect = (url: string, alt?: string) => {
        const field = mediaSelector.field
        if (field === 'hero.image_url') {
            setContent({
                ...content,
                hero: {
                    ...content.hero,
                    image_url: url,
                    video_url: '' // Limpiar video si se selecciona imagen
                }
            })
        } else if (field === 'hero.video_url') {
            setContent({
                ...content,
                hero: {
                    ...content.hero,
                    video_url: url,
                    image_url: '' // Limpiar imagen si se selecciona video
                }
            })
        } else if (field.startsWith('slideshow.')) {
            // Manejar selección de archivos para slideshow
            const index = parseInt(field.split('.')[1])
            const newSlideshow = [...(content.hero?.slideshow || [])]
            if (newSlideshow[index]) {
                newSlideshow[index] = { ...newSlideshow[index], url }
                setContent({
                    ...content,
                    hero: {
                        ...content.hero,
                        slideshow: newSlideshow
                    }
                })
            }
        }
        setMediaSelector({ isOpen: false, type: 'image', field: '' })
    }

    // Actualizar contenido cuando cambie initialContent
    useEffect(() => {
        console.log('🔄 SectionEditModal useEffect - sectionType:', sectionType)
        console.log('🔄 SectionEditModal useEffect - initialContent:', initialContent)
        
        if (initialContent?.content_json) {
            let contentData = { ...initialContent.content_json }
            console.log('📋 SectionEditModal - contentData inicial:', contentData)
            
            // Asegurar que existe la estructura para cada sección
            if (sectionType === 'hero' && !contentData.hero) {
                console.log('⚠️ No existe contentData.hero, creando desde estructura plana...')
                contentData.hero = {
                    title: contentData.hero_title || '',
                    subtitle: contentData.hero_subtitle || '',
                    description: contentData.hero_description || '',
                    button_text: contentData.hero_button_text || '',
                    button_link: contentData.hero_button_link || '',
                    image_url: contentData.hero_image || '',
                    video_url: contentData.hero_video || ''
                }
                console.log('✅ contentData.hero creado:', contentData.hero)
            } else if (sectionType === 'hero') {
                console.log('✅ contentData.hero ya existe:', contentData.hero)
            }
            
            if (sectionType === 'features' && !contentData.features) {
                contentData.features = []
            }
            
            if (sectionType === 'cta' && !contentData.call_to_action) {
                contentData.call_to_action = {
                    title: '',
                    description: '',
                    button_text: '',
                    button_link: ''
                }
            }
            
            setContent(contentData)
            console.log('📋 SectionEditModal - contentData final set:', contentData)
        }
    }, [initialContent, sectionType])

    if (!isOpen) return null

    const handleSave = async () => {
        setIsSaving(true)
        try {
            console.log('🔄 SectionEditModal - Iniciando guardado')
            console.log('📄 Page Key:', pageKey)
            console.log('🎯 Section Type:', sectionType)
            console.log('📋 Initial Content:', initialContent)
            console.log('✏️ Content to save:', content)
            
            // Crear el contenido actualizado manteniendo la estructura completa
            let updatedContentJson = { ...initialContent.content_json }
            
            // Mapear el sectionType al nombre correcto en la estructura
            if (sectionType === 'cta') {
                updatedContentJson.call_to_action = content.call_to_action
            } else if (sectionType === 'hero') {
                updatedContentJson.hero = content.hero
                // También actualizar estructura plana para compatibilidad
                if (content.hero) {
                    updatedContentJson.hero_title = content.hero.title
                    updatedContentJson.hero_subtitle = content.hero.subtitle
                    updatedContentJson.hero_description = content.hero.description
                    updatedContentJson.hero_button_text = content.hero.button_text
                    updatedContentJson.hero_button_link = content.hero.button_link
                    updatedContentJson.hero_image = content.hero.image_url
                    updatedContentJson.hero_video = content.hero.video_url
                }
            } else if (sectionType === 'features') {
                updatedContentJson.features = content.features
                // También actualizar metadatos de features si existen
                if (content.features_title) updatedContentJson.features_title = content.features_title
                if (content.features_description) updatedContentJson.features_description = content.features_description
            } else {
                updatedContentJson[sectionType] = content[sectionType]
            }
            
            // Actualizar el contenido completo
            console.log('📤 Enviando actualización con:', updatedContentJson)
            console.log('🔍 Datos ANTES de guardar - Hero:', updatedContentJson.hero)
            console.log('🔍 Datos ANTES de guardar - Hero title:', updatedContentJson.hero?.title)
            
            const updatePayload = {
                title: initialContent.title,
                content_json: updatedContentJson,
                meta_title: initialContent.meta_title,
                meta_description: initialContent.meta_description,
                meta_keywords: initialContent.meta_keywords,
                is_active: initialContent.is_active
            }
            console.log('📋 Payload completo a enviar:', updatePayload)
            
            const updateResponse = await adminApi.updatePageContent(pageKey, updatePayload)
            console.log('✅ Respuesta de actualización:', updateResponse)
            console.log('✅ Respuesta de actualización - data:', updateResponse.data)
            
            // Llamar onSave ANTES de cerrar el modal para recargar contenido
            console.log('🔄 Llamando onSave...')
            await onSave()
            console.log('✅ onSave completado')
            onClose()
            
            // Mostrar notificación temporal en lugar de alert
            const notification = document.createElement('div')
            notification.innerHTML = '✅ Sección actualizada exitosamente'
            notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg z-50 shadow-lg'
            document.body.appendChild(notification)
            
            // Remover notificación después de 3 segundos
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

    const renderSectionEditor = () => {
        switch (sectionType) {
            case 'hero':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Sección Hero</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={content.hero?.title || ''}
                                onChange={(e) => setContent({ 
                                    ...content, 
                                    hero: { 
                                        ...content.hero, 
                                        title: e.target.value 
                                    }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Sistema Educativo Virtual Profesional"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={content.hero?.subtitle || ''}
                                onChange={(e) => setContent({ 
                                    ...content, 
                                    hero: { 
                                        ...content.hero, 
                                        subtitle: e.target.value 
                                    }
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Transformamos la educación con tecnología"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={content.hero?.description || ''}
                                onChange={(e) => setContent({ 
                                    ...content, 
                                    hero: { 
                                        ...content.hero, 
                                        description: e.target.value 
                                    }
                                })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="La plataforma educativa más completa..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.hero?.button_text || ''}
                                    onChange={(e) => setContent({ 
                                        ...content, 
                                        hero: { 
                                            ...content.hero, 
                                            button_text: e.target.value 
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Ver Planes"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.hero?.button_link || ''}
                                    onChange={(e) => setContent({ 
                                        ...content, 
                                        hero: { 
                                            ...content.hero, 
                                            button_link: e.target.value 
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="/precios"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen (opcional)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={content.hero?.image_url || ''}
                                        onChange={(e) => setContent({ 
                                            ...content, 
                                            hero: { 
                                                ...content.hero, 
                                                image_url: e.target.value,
                                                video_url: e.target.value ? '' : content.hero?.video_url // Limpiar video si se añade imagen
                                            }
                                        })}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="URL de imagen o selecciona de la galería"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMediaSelector({ isOpen: true, type: 'image', field: 'hero.image_url' })}
                                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Video (opcional)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={content.hero?.video_url || ''}
                                        onChange={(e) => setContent({ 
                                            ...content, 
                                            hero: { 
                                                ...content.hero, 
                                                video_url: e.target.value,
                                                image_url: e.target.value ? '' : content.hero?.image_url // Limpiar imagen si se añade video
                                            }
                                        })}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="URL de video (YouTube, MP4, WebM) o selecciona de la galería"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMediaSelector({ isOpen: true, type: 'video', field: 'hero.video_url' })}
                                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Video className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Configuración del Slideshow */}
                        <div className="border-t pt-6">
                            <h4 className="text-md font-semibold text-gray-900 mb-4">Slideshow (Opcional)</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Configura múltiples imágenes/videos que se reproducirán automáticamente. 
                                Esto reemplazará la imagen/video individual de arriba.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Intervalo de cambio (segundos)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={content.hero?.slideshow_interval || 5}
                                        onChange={(e) => setContent({ 
                                            ...content, 
                                            hero: { 
                                                ...content.hero, 
                                                slideshow_interval: parseInt(e.target.value) || 5
                                            }
                                        })}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Archivos del Slideshow
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newSlide = { type: 'image' as 'image' | 'video', url: '', alt: '' }
                                                setContent({
                                                    ...content,
                                                    hero: {
                                                        ...content.hero,
                                                        slideshow: [...(content.hero?.slideshow || []), newSlide]
                                                    }
                                                })
                                            }}
                                            className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                                        >
                                            + Agregar Archivo
                                        </button>
                                    </div>

                                    {content.hero?.slideshow && content.hero.slideshow.length > 0 ? (
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {content.hero.slideshow.map((slide: any, index: number) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Tipo
                                                            </label>
                                                            <select
                                                                value={slide.type || 'image'}
                                                                onChange={(e) => {
                                                                    const newSlideshow = [...content.hero.slideshow]
                                                                    newSlideshow[index] = { ...newSlideshow[index], type: e.target.value as 'image' | 'video' }
                                                                    setContent({ 
                                                                        ...content, 
                                                                        hero: { 
                                                                            ...content.hero, 
                                                                            slideshow: newSlideshow 
                                                                        }
                                                                    })
                                                                }}
                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                                            >
                                                                <option value="image">Imagen</option>
                                                                <option value="video">Video</option>
                                                            </select>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                URL
                                                            </label>
                                                            <div className="flex gap-1">
                                                                <input
                                                                    type="text"
                                                                    value={slide.url || ''}
                                                                    onChange={(e) => {
                                                                        const newSlideshow = [...content.hero.slideshow]
                                                                        newSlideshow[index] = { ...newSlideshow[index], url: e.target.value }
                                                                        setContent({ 
                                                                            ...content, 
                                                                            hero: { 
                                                                                ...content.hero, 
                                                                                slideshow: newSlideshow 
                                                                            }
                                                                        })
                                                                    }}
                                                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                                                    placeholder={slide.type === 'video' ? 'URL de video (YouTube, MP4...)' : 'URL de imagen'}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setMediaSelector({ 
                                                                        isOpen: true, 
                                                                        type: slide.type, 
                                                                        field: `slideshow.${index}.url` 
                                                                    })}
                                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                                                >
                                                                    {slide.type === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newSlideshow = content.hero.slideshow.filter((_, i) => i !== index)
                                                                        setContent({ 
                                                                            ...content, 
                                                                            hero: { 
                                                                                ...content.hero, 
                                                                                slideshow: newSlideshow 
                                                                            }
                                                                        })
                                                                    }}
                                                                    className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">
                                            No hay archivos en el slideshow. Usa la imagen/video individual arriba o agrega archivos aquí.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 'features':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Características</h3>
                        <p className="text-sm text-gray-600">
                            Estas son las características que aparecen en la sección "¿Por qué elegir SEVP?"
                        </p>
                        
                        {content.features && content.features.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {content.features.map((feature: any, index: number) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Título {index + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={feature.title || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...content.features]
                                                        newFeatures[index] = { ...newFeatures[index], title: e.target.value }
                                                        setContent({ ...content, features: newFeatures })
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción {index + 1}
                                                </label>
                                                <textarea
                                                    value={feature.description || ''}
                                                    onChange={(e) => {
                                                        const newFeatures = [...content.features]
                                                        newFeatures[index] = { ...newFeatures[index], description: e.target.value }
                                                        setContent({ ...content, features: newFeatures })
                                                    }}
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Ícono {index + 1}
                                                </label>
                                                <select
                                                    value={feature.icon || 'Users'}
                                                    onChange={(e) => {
                                                        const newFeatures = [...content.features]
                                                        newFeatures[index] = { ...newFeatures[index], icon: e.target.value }
                                                        setContent({ ...content, features: newFeatures })
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                >
                                                    <option value="Users">👥 Usuarios (Users)</option>
                                                    <option value="BookOpen">📚 Libro (BookOpen)</option>
                                                    <option value="Shield">🛡️ Escudo (Shield)</option>
                                                    <option value="Zap">⚡ Rayo (Zap)</option>
                                                    <option value="CheckCircle">✅ Check (CheckCircle)</option>
                                                    <option value="Star">⭐ Estrella (Star)</option>
                                                    <option value="Award">🏆 Premio (Award)</option>
                                                    <option value="Heart">❤️ Corazón (Heart)</option>
                                                    <option value="Target">🎯 Objetivo (Target)</option>
                                                    <option value="Lightbulb">💡 Bombilla (Lightbulb)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No hay características configuradas
                            </div>
                        )}
                    </div>
                )

            case 'cta':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Editar Llamada a la Acción</h3>
                        <p className="text-sm text-gray-600">
                            Esta es la sección azul al final de la página
                        </p>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={content.call_to_action?.title || ''}
                                onChange={(e) => setContent({ 
                                    ...content, 
                                    call_to_action: { 
                                        ...content.call_to_action, 
                                        title: e.target.value 
                                    } 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="¿Listo para transformar tu institución educativa?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={content.call_to_action?.description || ''}
                                onChange={(e) => setContent({ 
                                    ...content, 
                                    call_to_action: { 
                                        ...content.call_to_action, 
                                        description: e.target.value 
                                    } 
                                })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Únete a las instituciones que ya están revolucionando la educación..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del Botón Principal
                                </label>
                                <input
                                    type="text"
                                    value={content.call_to_action?.button_text || ''}
                                    onChange={(e) => setContent({ 
                                        ...content, 
                                        call_to_action: { 
                                            ...content.call_to_action, 
                                            button_text: e.target.value 
                                        } 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Solicitar Demo Gratuita"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.call_to_action?.button_link || ''}
                                    onChange={(e) => setContent({ 
                                        ...content, 
                                        call_to_action: { 
                                            ...content.call_to_action, 
                                            button_link: e.target.value 
                                        } 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                    </div>
                )

            default:
                return <div>Sección no encontrada</div>
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                            Editar Sección
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-2"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderSectionEditor()}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
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
                            {isSaving ? 'Guardando y recargando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Media Selector */}
            <MediaSelector
                isOpen={mediaSelector.isOpen}
                onClose={() => setMediaSelector({ isOpen: false, type: 'image', field: '' })}
                onSelect={handleMediaSelect}
                fileType={mediaSelector.type}
                title={`Seleccionar ${mediaSelector.type === 'image' ? 'Imagen' : 'Video'}`}
            />
        </div>
    )
}
