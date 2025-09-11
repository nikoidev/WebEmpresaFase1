'use client'

import { useState } from 'react'
import { Plus, Trash2, User } from 'lucide-react'

interface AboutContent {
    hero_title?: string
    hero_description?: string
    mission: string
    vision: string
    values: Array<{
        title: string
        description: string
        icon?: string
    }>
    team: Array<{
        name: string
        position: string
        bio: string
        image?: string
        linkedin?: string
        email?: string
    }>
    company_info?: {
        founded: string
        headquarters: string
        employees: string
        industry: string
    }
    certifications?: Array<{
        name: string
        issuer: string
        year: string
        image?: string
    }>
}

interface AboutEditorProps {
    content: AboutContent
    onChange: (content: AboutContent) => void
}

export default function AboutEditor({ content, onChange }: AboutEditorProps) {
    const [activeSection, setActiveSection] = useState<'hero' | 'mission' | 'values' | 'team' | 'info' | 'certifications'>('hero')

    const updateContent = (section: keyof AboutContent, value: any) => {
        onChange({
            ...content,
            [section]: value
        })
    }

    const addValue = () => {
        const newValue = {
            title: 'Nuevo Valor',
            description: 'Descripción del valor',
            icon: 'heart'
        }
        updateContent('values', [...(content.values || []), newValue])
    }

    const updateValue = (index: number, field: string, value: string) => {
        const values = [...(content.values || [])]
        values[index] = { ...values[index], [field]: value }
        updateContent('values', values)
    }

    const removeValue = (index: number) => {
        const values = content.values?.filter((_, i) => i !== index) || []
        updateContent('values', values)
    }

    const addTeamMember = () => {
        const newMember = {
            name: 'Nombre del Miembro',
            position: 'Cargo',
            bio: 'Biografía breve...',
            image: '',
            linkedin: '',
            email: ''
        }
        updateContent('team', [...(content.team || []), newMember])
    }

    const updateTeamMember = (index: number, field: string, value: string) => {
        const team = [...(content.team || [])]
        team[index] = { ...team[index], [field]: value }
        updateContent('team', team)
    }

    const removeTeamMember = (index: number) => {
        const team = content.team?.filter((_, i) => i !== index) || []
        updateContent('team', team)
    }

    const addCertification = () => {
        const newCert = {
            name: 'Nombre de la Certificación',
            issuer: 'Organismo Emisor',
            year: new Date().getFullYear().toString(),
            image: ''
        }
        updateContent('certifications', [...(content.certifications || []), newCert])
    }

    const updateCertification = (index: number, field: string, value: string) => {
        const certifications = [...(content.certifications || [])]
        certifications[index] = { ...certifications[index], [field]: value }
        updateContent('certifications', certifications)
    }

    const removeCertification = (index: number) => {
        const certifications = content.certifications?.filter((_, i) => i !== index) || []
        updateContent('certifications', certifications)
    }

    const sections = [
        { id: 'hero', label: 'Sección Hero', icon: '🏢' },
        { id: 'mission', label: 'Misión y Visión', icon: '🎯' },
        { id: 'values', label: 'Valores', icon: '💎' },
        { id: 'team', label: 'Equipo', icon: '👥' },
        { id: 'info', label: 'Info de la Empresa', icon: '📊' },
        { id: 'certifications', label: 'Certificaciones', icon: '🏆' }
    ]

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones de Nosotros</h3>
                <nav className="space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                activeSection === section.id
                                    ? 'bg-green-100 text-green-700 border border-green-200'
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
                        <h3 className="text-xl font-semibold text-gray-900">Sección Hero de Nosotros</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título Principal
                            </label>
                            <input
                                type="text"
                                value={content.hero_title || ''}
                                onChange={(e) => updateContent('hero_title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Ej: Conoce a SEVP"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={content.hero_description || ''}
                                onChange={(e) => updateContent('hero_description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Una breve introducción sobre la empresa..."
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'mission' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Misión y Visión</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Misión
                            </label>
                            <textarea
                                value={content.mission || ''}
                                onChange={(e) => updateContent('mission', e.target.value)}
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Nuestra misión es..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Visión
                            </label>
                            <textarea
                                value={content.vision || ''}
                                onChange={(e) => updateContent('vision', e.target.value)}
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Nuestra visión es..."
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'values' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Valores de la Empresa</h3>
                            <button
                                onClick={addValue}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Agregar Valor
                            </button>
                        </div>

                        <div className="space-y-4">
                            {content.values?.map((value, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Valor {index + 1}</h4>
                                        <button
                                            onClick={() => removeValue(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Título
                                            </label>
                                            <input
                                                type="text"
                                                value={value.title}
                                                onChange={(e) => updateValue(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Icono
                                            </label>
                                            <input
                                                type="text"
                                                value={value.icon || ''}
                                                onChange={(e) => updateValue(index, 'icon', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="heart, shield, star..."
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            value={value.description}
                                            onChange={(e) => updateValue(index, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {(!content.values || content.values.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                No hay valores configurados. Haz clic en "Agregar Valor" para comenzar.
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'team' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Equipo</h3>
                            <button
                                onClick={addTeamMember}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <User size={16} />
                                Agregar Miembro
                            </button>
                        </div>

                        <div className="space-y-4">
                            {content.team?.map((member, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">{member.name || `Miembro ${index + 1}`}</h4>
                                        <button
                                            onClick={() => removeTeamMember(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre Completo
                                            </label>
                                            <input
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cargo/Posición
                                            </label>
                                            <input
                                                type="text"
                                                value={member.position}
                                                onChange={(e) => updateTeamMember(index, 'position', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Biografía
                                        </label>
                                        <textarea
                                            value={member.bio}
                                            onChange={(e) => updateTeamMember(index, 'bio', e.target.value)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="Breve biografía del miembro del equipo..."
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Foto (URL)
                                            </label>
                                            <input
                                                type="url"
                                                value={member.image || ''}
                                                onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                LinkedIn
                                            </label>
                                            <input
                                                type="url"
                                                value={member.linkedin || ''}
                                                onChange={(e) => updateTeamMember(index, 'linkedin', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="https://linkedin.com/in/..."
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={member.email || ''}
                                                onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="nombre@empresa.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {(!content.team || content.team.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                No hay miembros del equipo configurados. Haz clic en "Agregar Miembro" para comenzar.
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'info' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Información de la Empresa</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Año de Fundación
                                </label>
                                <input
                                    type="text"
                                    value={content.company_info?.founded || ''}
                                    onChange={(e) => updateContent('company_info', { 
                                        ...content.company_info, 
                                        founded: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="2020"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sede Central
                                </label>
                                <input
                                    type="text"
                                    value={content.company_info?.headquarters || ''}
                                    onChange={(e) => updateContent('company_info', { 
                                        ...content.company_info, 
                                        headquarters: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Ciudad, País"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de Empleados
                                </label>
                                <input
                                    type="text"
                                    value={content.company_info?.employees || ''}
                                    onChange={(e) => updateContent('company_info', { 
                                        ...content.company_info, 
                                        employees: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="50-100"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Industria
                                </label>
                                <input
                                    type="text"
                                    value={content.company_info?.industry || ''}
                                    onChange={(e) => updateContent('company_info', { 
                                        ...content.company_info, 
                                        industry: e.target.value 
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    placeholder="Tecnología Educativa"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'certifications' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Certificaciones y Reconocimientos</h3>
                            <button
                                onClick={addCertification}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Agregar Certificación
                            </button>
                        </div>

                        <div className="space-y-4">
                            {content.certifications?.map((cert, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">Certificación {index + 1}</h4>
                                        <button
                                            onClick={() => removeCertification(index)}
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
                                                value={cert.name}
                                                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Organismo Emisor
                                            </label>
                                            <input
                                                type="text"
                                                value={cert.issuer}
                                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Año
                                            </label>
                                            <input
                                                type="text"
                                                value={cert.year}
                                                onChange={(e) => updateCertification(index, 'year', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Imagen/Logo (URL)
                                        </label>
                                        <input
                                            type="url"
                                            value={cert.image || ''}
                                            onChange={(e) => updateCertification(index, 'image', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                            placeholder="https://ejemplo.com/certificacion.jpg"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {(!content.certifications || content.certifications.length === 0) && (
                            <div className="text-center py-8 text-gray-500">
                                No hay certificaciones configuradas. Haz clic en "Agregar Certificación" para comenzar.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
