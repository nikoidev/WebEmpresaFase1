'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, Move, Image, Video, Link, Eye, EyeOff } from 'lucide-react'

interface HomepageContent {
    hero_title: string
    hero_subtitle: string
    hero_description: string
    hero_button_text?: string
    hero_button_link?: string
    hero_image?: string
    hero_video?: string
    hero_background_type?: 'image' | 'video' | 'color'
    hero_background_color?: string
    features: Array<{
        id?: string
        title: string
        description: string
        icon?: string
        icon_type?: 'lucide' | 'url' | 'emoji'
        image?: string
        video?: string
        button_text?: string
        button_link?: string
        is_active?: boolean
    }>
    testimonials: Array<{
        id?: string
        name: string
        position: string
        company: string
        content: string
        image?: string
        rating?: number
        date?: string
        is_featured?: boolean
    }>
    stats: {
        clients?: number
        projects?: number
        experience?: number
        satisfaction?: number
    }
    call_to_action?: {
        title: string
        description: string
        button_text: string
        button_link: string
        background_image?: string
        background_video?: string
    }
    gallery?: Array<{
        id?: string
        title: string
        description?: string
        url: string
        type: 'image' | 'video'
        thumbnail?: string
    }>
}

interface HomepageEditorProps {
    content: HomepageContent
    onChange: (content: HomepageContent) => void
}

export default function HomepageEditor({ content, onChange }: HomepageEditorProps) {
    const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'testimonials' | 'stats' | 'cta' | 'gallery'>('hero')

    const updateContent = (section: keyof HomepageContent, value: any) => {
        onChange({
            ...content,
            [section]: value
        })
    }

    // Componente para gestión de medios
    const MediaInput = ({ 
        label, 
        value, 
        onChange, 
        type = 'both',
        placeholder 
    }: {
        label: string
        value?: string
        onChange: (value: string) => void
        type?: 'image' | 'video' | 'both'
        placeholder?: string
    }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="flex gap-2">
                <input
                    type="url"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder={placeholder || `URL ${type === 'image' ? 'de imagen' : type === 'video' ? 'de video' : 'de imagen o video'}`}
                />
                {type === 'image' || type === 'both' ? (
                    <button
                        type="button"
                        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
                        title="Seleccionar imagen"
                    >
                        <Image className="h-4 w-4" />
                    </button>
                ) : null}
                {type === 'video' || type === 'both' ? (
                    <button
                        type="button"
                        className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                        title="Seleccionar video"
                    >
                        <Video className="h-4 w-4" />
                    </button>
                ) : null}
            </div>
            {value && (
                <div className="mt-2">
                    {value.includes('youtube.com') || value.includes('youtu.be') || value.includes('vimeo.com') || value.endsWith('.mp4') || value.endsWith('.webm') ? (
                        <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                            <Video className="h-8 w-8 text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">Video cargado</span>
                        </div>
                    ) : (
                        <img 
                            src={value} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded border"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    )

    // Selector de iconos
    const IconSelector = ({ 
        value, 
        onChange, 
        iconType, 
        onTypeChange 
    }: {
        value?: string
        onChange: (value: string) => void
        iconType?: 'lucide' | 'url' | 'emoji'
        onTypeChange: (type: 'lucide' | 'url' | 'emoji') => void
    }) => {
        const lucideIcons = [
            'Check', 'Star', 'Heart', 'Zap', 'Shield', 'Award', 'Target', 'Trending-up',
            'Users', 'Clock', 'Globe', 'Smartphone', 'Monitor', 'Mail', 'Phone', 'Settings'
        ]

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Icono</label>
                <div className="flex gap-2 mb-2">
                    <button
                        type="button"
                        onClick={() => onTypeChange('emoji')}
                        className={`px-3 py-1 rounded text-sm ${iconType === 'emoji' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        🎨 Emoji
                    </button>
                    <button
                        type="button"
                        onClick={() => onTypeChange('lucide')}
                        className={`px-3 py-1 rounded text-sm ${iconType === 'lucide' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        📐 Icono
                    </button>
                    <button
                        type="button"
                        onClick={() => onTypeChange('url')}
                        className={`px-3 py-1 rounded text-sm ${iconType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        🔗 URL
                    </button>
                </div>
                {iconType === 'emoji' && (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="😊 Escribe o pega un emoji"
                    />
                )}
                {iconType === 'lucide' && (
                    <div className="grid grid-cols-4 gap-2">
                        {lucideIcons.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                onClick={() => onChange(icon)}
                                className={`p-2 border rounded text-sm ${value === icon ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                )}
                {iconType === 'url' && (
                    <input
                        type="url"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://ejemplo.com/icono.svg"
                    />
                )}
            </div>
        )
    }

    const addFeature = () => {
        const newFeature = {
            title: 'Nueva Característica',
            description: 'Descripción de la característica',
            icon: 'star',
            image: ''
        }
        updateContent('features', [...(content.features || []), newFeature])
    }

    const updateFeature = (index: number, field: string, value: string) => {
        const features = [...(content.features || [])]
        features[index] = { ...features[index], [field]: value }
        updateContent('features', features)
    }

    const removeFeature = (index: number) => {
        const features = content.features?.filter((_, i) => i !== index) || []
        updateContent('features', features)
    }

    const addTestimonial = () => {
        const newTestimonial = {
            name: 'Nombre del Cliente',
            position: 'Cargo',
            company: 'Empresa',
            content: 'Testimonial del cliente...',
            image: ''
        }
        updateContent('testimonials', [...(content.testimonials || []), newTestimonial])
    }

    const updateTestimonial = (index: number, field: string, value: string) => {
        const testimonials = [...(content.testimonials || [])]
        testimonials[index] = { ...testimonials[index], [field]: value }
        updateContent('testimonials', testimonials)
    }

    const removeTestimonial = (index: number) => {
        const testimonials = content.testimonials?.filter((_, i) => i !== index) || []
        updateContent('testimonials', testimonials)
    }

    const sections = [
        { id: 'hero', label: 'Sección Hero', icon: '🏠' },
        { id: 'features', label: 'Características', icon: '⭐' },
        { id: 'testimonials', label: 'Testimonios', icon: '💬' },
        { id: 'stats', label: 'Estadísticas', icon: '📊' },
        { id: 'gallery', label: 'Galería de Medios', icon: '🖼️' },
        { id: 'cta', label: 'Llamada a la Acción', icon: '📢' }
    ]

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones de Inicio</h3>
                <nav className="space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                activeSection === section.id
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Editor */}
            <div className="flex-1 p-6 overflow-y-auto">
                {activeSection === 'hero' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Sección Hero Principal</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título Principal
                                </label>
                                <input
                                    type="text"
                                    value={content.hero_title || ''}
                                    onChange={(e) => updateContent('hero_title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Bienvenido a SEVP"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subtítulo
                                </label>
                                <input
                                    type="text"
                                    value={content.hero_subtitle || ''}
                                    onChange={(e) => updateContent('hero_subtitle', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Sistema Educativo Virtual Profesional"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={content.hero_description || ''}
                                onChange={(e) => updateContent('hero_description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Descripción que aparece en la sección principal"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.hero_button_text || ''}
                                    onChange={(e) => updateContent('hero_button_text', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: Comenzar Ahora"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.hero_button_link || ''}
                                    onChange={(e) => updateContent('hero_button_link', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>

                        {/* Tipo de fondo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Fondo
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => updateContent('hero_background_type', 'image')}
                                    className={`px-4 py-2 rounded-md ${content.hero_background_type === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                >
                                    🖼️ Imagen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateContent('hero_background_type', 'video')}
                                    className={`px-4 py-2 rounded-md ${content.hero_background_type === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                >
                                    🎥 Video
                                </button>
                                <button
                                    type="button"
                                    onClick={() => updateContent('hero_background_type', 'color')}
                                    className={`px-4 py-2 rounded-md ${content.hero_background_type === 'color' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                >
                                    🎨 Color
                                </button>
                            </div>
                        </div>

                        {/* Fondo según tipo seleccionado */}
                        {content.hero_background_type === 'image' && (
                            <MediaInput
                                label="Imagen de Fondo Hero"
                                value={content.hero_image}
                                onChange={(value) => updateContent('hero_image', value)}
                                type="image"
                                placeholder="URL de imagen de fondo"
                            />
                        )}

                        {content.hero_background_type === 'video' && (
                            <MediaInput
                                label="Video de Fondo Hero"
                                value={content.hero_video}
                                onChange={(value) => updateContent('hero_video', value)}
                                type="video"
                                placeholder="URL de video de fondo (YouTube, Vimeo, MP4)"
                            />
                        )}

                        {content.hero_background_type === 'color' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Color de Fondo
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={content.hero_background_color || '#f3f4f6'}
                                        onChange={(e) => updateContent('hero_background_color', e.target.value)}
                                        className="w-16 h-10 border border-gray-300 rounded"
                                    />
                                    <input
                                        type="text"
                                        value={content.hero_background_color || '#f3f4f6'}
                                        onChange={(e) => updateContent('hero_background_color', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="#f3f4f6"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'features' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Características del Servicio</h3>
                            <button
                                onClick={addFeature}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Agregar Característica
                            </button>
                        </div>

                        <div className="space-y-4">
                            {content.features?.map((feature, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Característica {index + 1}</h4>
                                        <button
                                            onClick={() => removeFeature(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Título
                                            </label>
                                            <input
                                                type="text"
                                                value={feature.title}
                                                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <IconSelector
                                                value={feature.icon}
                                                onChange={(value) => updateFeature(index, 'icon', value)}
                                                iconType={feature.icon_type || 'emoji'}
                                                onTypeChange={(type) => updateFeature(index, 'icon_type', type)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={feature.description}
                                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <MediaInput
                                            label="Imagen de la Característica (opcional)"
                                            value={feature.image}
                                            onChange={(value) => updateFeature(index, 'image', value)}
                                            type="image"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Texto del Botón (opcional)
                                            </label>
                                            <input
                                                type="text"
                                                value={feature.button_text || ''}
                                                onChange={(e) => updateFeature(index, 'button_text', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Saber más"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Enlace del Botón (opcional)
                                            </label>
                                            <input
                                                type="text"
                                                value={feature.button_link || ''}
                                                onChange={(e) => updateFeature(index, 'button_link', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="/servicios"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={feature.is_active !== false}
                                                onChange={(e) => updateFeature(index, 'is_active', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Característica activa</span>
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {(!content.features || content.features.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                No hay características configuradas. Haz clic en "Agregar Característica" para comenzar.
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'testimonials' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Testimonios de Clientes</h3>
                            <button
                                onClick={addTestimonial}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Agregar Testimonio
                            </button>
                        </div>

                        <div className="space-y-4">
                            {content.testimonials?.map((testimonial, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Testimonio {index + 1}</h4>
                                        <button
                                            onClick={() => removeTestimonial(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.name}
                                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cargo
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.position}
                                                onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Empresa
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.company}
                                                onChange={(e) => updateTestimonial(index, 'company', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Testimonio
                                        </label>
                                        <textarea
                                            value={testimonial.content}
                                            onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="El testimonio del cliente..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {(!content.testimonials || content.testimonials.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                No hay testimonios configurados. Haz clic en "Agregar Testimonio" para comenzar.
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'stats' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Estadísticas de la Empresa</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Clientes
                                </label>
                                <input
                                    type="number"
                                    value={content.stats?.clients || ''}
                                    onChange={(e) => updateContent('stats', { ...content.stats, clients: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="100"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Proyectos
                                </label>
                                <input
                                    type="number"
                                    value={content.stats?.projects || ''}
                                    onChange={(e) => updateContent('stats', { ...content.stats, projects: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="250"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Años de Experiencia
                                </label>
                                <input
                                    type="number"
                                    value={content.stats?.experience || ''}
                                    onChange={(e) => updateContent('stats', { ...content.stats, experience: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="10"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Satisfacción (%)
                                </label>
                                <input
                                    type="number"
                                    value={content.stats?.satisfaction || ''}
                                    onChange={(e) => updateContent('stats', { ...content.stats, satisfaction: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="98"
                                    max="100"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'cta' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Llamada a la Acción Final</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título de CTA
                                </label>
                                <input
                                    type="text"
                                    value={content.call_to_action?.title || ''}
                                    onChange={(e) => updateContent('call_to_action', { 
                                        ...content.call_to_action, 
                                        title: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="¿Listo para comenzar?"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Texto del Botón
                                </label>
                                <input
                                    type="text"
                                    value={content.call_to_action?.button_text || ''}
                                    onChange={(e) => updateContent('call_to_action', { 
                                        ...content.call_to_action, 
                                        button_text: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Contáctanos"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={content.call_to_action?.description || ''}
                                onChange={(e) => updateContent('call_to_action', { 
                                    ...content.call_to_action, 
                                    description: e.target.value 
                                })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Únete a nosotros y transforma tu educación..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enlace del Botón
                            </label>
                            <input
                                type="text"
                                value={content.call_to_action?.button_link || ''}
                                onChange={(e) => updateContent('call_to_action', { 
                                    ...content.call_to_action, 
                                    button_link: e.target.value 
                                })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="/contacto"
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'gallery' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Galería de Medios</h3>
                            <button
                                onClick={() => {
                                    const newGalleryItem = {
                                        id: Date.now().toString(),
                                        title: 'Nuevo elemento',
                                        url: '',
                                        type: 'image' as const
                                    }
                                    updateContent('gallery', [...(content.gallery || []), newGalleryItem])
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Media
                            </button>
                        </div>

                        {content.gallery && content.gallery.length > 0 ? (
                            <div className="space-y-4">
                                {content.gallery.map((item, index) => (
                                    <div key={item.id || index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-lg font-medium text-gray-900">
                                                {item.title || `Elemento ${index + 1}`}
                                            </h4>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const gallery = [...(content.gallery || [])]
                                                        gallery[index] = { 
                                                            ...gallery[index], 
                                                            type: gallery[index].type === 'image' ? 'video' : 'image' 
                                                        }
                                                        updateContent('gallery', gallery)
                                                    }}
                                                    className={`px-3 py-1 rounded text-sm ${
                                                        item.type === 'image' 
                                                            ? 'bg-blue-600 text-white' 
                                                            : 'bg-red-600 text-white'
                                                    }`}
                                                >
                                                    {item.type === 'image' ? '🖼️ Imagen' : '🎥 Video'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const gallery = content.gallery?.filter((_, i) => i !== index) || []
                                                        updateContent('gallery', gallery)
                                                    }}
                                                    className="text-red-600 hover:text-red-700 px-2"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        const gallery = [...(content.gallery || [])]
                                                        gallery[index] = { ...gallery[index], title: e.target.value }
                                                        updateContent('gallery', gallery)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción (opcional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.description || ''}
                                                    onChange={(e) => {
                                                        const gallery = [...(content.gallery || [])]
                                                        gallery[index] = { ...gallery[index], description: e.target.value }
                                                        updateContent('gallery', gallery)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <MediaInput
                                                label={`URL del ${item.type === 'image' ? 'Imagen' : 'Video'}`}
                                                value={item.url}
                                                onChange={(value) => {
                                                    const gallery = [...(content.gallery || [])]
                                                    gallery[index] = { ...gallery[index], url: value }
                                                    updateContent('gallery', gallery)
                                                }}
                                                type={item.type}
                                            />
                                        </div>

                                        {item.type === 'video' && (
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Thumbnail (opcional)
                                                </label>
                                                <input
                                                    type="url"
                                                    value={item.thumbnail || ''}
                                                    onChange={(e) => {
                                                        const gallery = [...(content.gallery || [])]
                                                        gallery[index] = { ...gallery[index], thumbnail: e.target.value }
                                                        updateContent('gallery', gallery)
                                                    }}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    placeholder="URL de imagen para usar como thumbnail"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No hay elementos en la galería</p>
                                <p className="text-sm text-gray-400">Haz clic en "Agregar Media" para empezar</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
