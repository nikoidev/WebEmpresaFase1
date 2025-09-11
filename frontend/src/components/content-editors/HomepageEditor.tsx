'use client'

import { useState } from 'react'
import { Plus, Trash2, Edit, Move } from 'lucide-react'

interface HomepageContent {
    hero_title: string
    hero_subtitle: string
    hero_description: string
    hero_button_text?: string
    hero_button_link?: string
    hero_image?: string
    features: Array<{
        title: string
        description: string
        icon?: string
        image?: string
    }>
    testimonials: Array<{
        name: string
        position: string
        company: string
        content: string
        image?: string
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
    }
}

interface HomepageEditorProps {
    content: HomepageContent
    onChange: (content: HomepageContent) => void
}

export default function HomepageEditor({ content, onChange }: HomepageEditorProps) {
    const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'testimonials' | 'stats' | 'cta'>('hero')

    const updateContent = (section: keyof HomepageContent, value: any) => {
        onChange({
            ...content,
            [section]: value
        })
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
            <div className="flex-1 p-6">
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL de Imagen Hero
                            </label>
                            <input
                                type="url"
                                value={content.hero_image || ''}
                                onChange={(e) => updateContent('hero_image', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Icono
                                            </label>
                                            <input
                                                type="text"
                                                value={feature.icon || ''}
                                                onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="star, heart, shield..."
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
            </div>
        </div>
    )
}
