'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface HomepageContent {
    hero_title: string
    hero_subtitle: string
    hero_description: string
    hero_button_text?: string
    hero_button_link?: string
    hero_image?: string
    hero_video?: string
    features?: Array<{
        title: string
        description: string
        icon?: string
        image?: string
        is_active?: boolean
    }>
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
    const [activeSection, setActiveSection] = useState<string>('hero')

    const updateContent = (section: keyof HomepageContent, value: any) => {
        onChange({
            ...content,
            [section]: value
        })
    }

    const addFeature = () => {
        const newFeature = {
            title: 'Nueva Característica',
            description: 'Descripción de la característica...',
            icon: 'Users',
            is_active: true
        }
        updateContent('features', [...(content.features || []), newFeature])
    }

    const updateFeature = (index: number, field: string, value: any) => {
        const features = [...(content.features || [])]
        features[index] = { ...features[index], [field]: value }
        updateContent('features', features)
    }

    const removeFeature = (index: number) => {
        const features = content.features?.filter((_, i) => i !== index) || []
        updateContent('features', features)
    }

    const sections = [
        { id: 'hero', label: 'Sección Hero', icon: '🏠' },
        { id: 'features', label: 'Características', icon: '⭐' },
        { id: 'cta', label: 'Llamada a la Acción', icon: '📢' }
    ]

    // Características predefinidas de la página actual
    const defaultFeatures = [
        {
            title: 'Gestión de Estudiantes',
            description: 'Administra perfiles, matrículas, asistencia y comunicación con estudiantes de manera centralizada.',
            icon: 'Users',
            is_active: true
        },
        {
            title: 'Cursos y Contenido',
            description: 'Crea, organiza y gestiona cursos con contenido multimedia, tareas y evaluaciones integradas.',
            icon: 'BookOpen',
            is_active: true
        },
        {
            title: 'Seguridad Avanzada',
            description: 'Protección de datos con encriptación, copias de seguridad automáticas y control de acceso granular.',
            icon: 'Shield',
            is_active: true
        },
        {
            title: 'Integración Fácil',
            description: 'API robusta para integrarse con sistemas existentes y herramientas de terceros.',
            icon: 'Zap',
            is_active: true
        },
        {
            title: 'Reportes Avanzados',
            description: 'Analíticas detalladas y reportes personalizables para tomar decisiones informadas.',
            icon: 'CheckCircle',
            is_active: true
        },
        {
            title: 'Soporte 24/7',
            description: 'Equipo de soporte técnico disponible las 24 horas para resolver cualquier incidencia.',
            icon: 'Star',
            is_active: true
        }
    ]

    const loadDefaultFeatures = () => {
        updateContent('features', defaultFeatures)
    }

    const iconOptions = ['Users', 'BookOpen', 'Shield', 'Zap', 'CheckCircle', 'Star']

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones</h3>
                <nav className="space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                activeSection === section.id
                                    ? 'bg-primary-100 text-primary-700'
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
                        <h3 className="text-xl font-semibold text-gray-900">Sección Hero - Parte Superior</h3>
                        
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título Principal
                                </label>
                                <input
                                    type="text"
                                    value={content.hero_title || ''}
                                    onChange={(e) => updateContent('hero_title', e.target.value)}
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
                                    value={content.hero_subtitle || ''}
                                    onChange={(e) => updateContent('hero_subtitle', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Transformamos la educación con tecnología"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={content.hero_description || ''}
                                    onChange={(e) => updateContent('hero_description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="La plataforma educativa más completa para transformar tu institución educativa"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Texto del Botón Principal
                                    </label>
                                    <input
                                        type="text"
                                        value={content.hero_button_text || ''}
                                        onChange={(e) => updateContent('hero_button_text', e.target.value)}
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
                                        value={content.hero_button_link || ''}
                                        onChange={(e) => updateContent('hero_button_link', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="/precios"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen Hero (URL)
                                </label>
                                <input
                                    type="url"
                                    value={content.hero_image || ''}
                                    onChange={(e) => updateContent('hero_image', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                <p className="text-sm text-gray-500 mt-1">Imagen que aparece a la derecha del texto principal</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'features' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-900">Sección "¿Por qué elegir SEVP?"</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={loadDefaultFeatures}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    Cargar Características Actuales
                                </button>
                                <button
                                    onClick={addFeature}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                <strong>Estas son las 6 características que aparecen en la página actual:</strong><br/>
                                1. Gestión de Estudiantes<br/>
                                2. Cursos y Contenido<br/>
                                3. Seguridad Avanzada<br/>
                                4. Integración Fácil<br/>
                                5. Reportes Avanzados<br/>
                                6. Soporte 24/7
                            </p>
                        </div>

                        {content.features && content.features.length > 0 ? (
                            <div className="space-y-4">
                                {content.features.map((feature, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-lg font-medium text-gray-900">
                                                Característica {index + 1}
                                            </h4>
                                            <button
                                                onClick={() => removeFeature(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Título
                                                </label>
                                                <input
                                                    type="text"
                                                    value={feature.title || ''}
                                                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Icono
                                                </label>
                                                <select
                                                    value={feature.icon || 'Users'}
                                                    onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                                >
                                                    {iconOptions.map((icon) => (
                                                        <option key={icon} value={icon}>{icon}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Descripción
                                            </label>
                                            <textarea
                                                value={feature.description || ''}
                                                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={feature.is_active !== false}
                                                    onChange={(e) => updateFeature(index, 'is_active', e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm text-gray-700">Activa</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No hay características configuradas. Haz clic en "Cargar Características Actuales" para usar las que aparecen en la página.
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'cta' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Sección Final "¿Listo para transformar tu institución educativa?"</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-blue-800 text-sm">
                                Esta es la sección azul al final de la página con los botones "Solicitar Demo Gratuita" y "Ver Precios"
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={content.call_to_action?.title || ''}
                                onChange={(e) => updateContent('call_to_action', { 
                                    ...content.call_to_action, 
                                    title: e.target.value 
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
                                onChange={(e) => updateContent('call_to_action', { 
                                    ...content.call_to_action, 
                                    description: e.target.value 
                                })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Únete a las instituciones que ya están revolucionando la educación con SEVP. Solicita una demo gratuita y descubre todo lo que podemos hacer por ti."
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
                                    onChange={(e) => updateContent('call_to_action', { 
                                        ...content.call_to_action, 
                                        button_text: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="Solicitar Demo Gratuita"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enlace del Botón Principal
                                </label>
                                <input
                                    type="text"
                                    value={content.call_to_action?.button_link || ''}
                                    onChange={(e) => updateContent('call_to_action', { 
                                        ...content.call_to_action, 
                                        button_link: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="/contacto"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}