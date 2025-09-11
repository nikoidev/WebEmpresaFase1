'use client'

import React, { useState } from 'react'
import { Plus, MapPin, Phone, Mail, Clock, Building } from 'lucide-react'

interface Office {
    city: string
    country: string
    address: string
    phone: string
    email: string
    is_headquarters: boolean
}

interface ContactReason {
    title: string
    description: string
    icon: string
    email: string
}

interface ContactContent {
    hero: {
        title: string
        subtitle: string
        description: string
    }
    contact_info: {
        address: {
            street: string
            city: string
            country: string
            postal_code: string
        }
        phone: string
        email: string
        business_hours: {
            weekdays: string
            timezone: string
        }
    }
    offices: Office[]
    contact_reasons: ContactReason[]
}

interface ContactEditorProps {
    data: ContactContent
    onChange: (data: ContactContent) => void
}

export default function ContactEditor({ data, onChange }: ContactEditorProps) {
    const [formData, setFormData] = useState<ContactContent>(data)
    const [editingOffice, setEditingOffice] = useState<number | null>(null)
    const [editingReason, setEditingReason] = useState<number | null>(null)

    const handleChange = (newData: ContactContent) => {
        setFormData(newData)
        onChange(newData)
    }

    const updateHero = (field: keyof typeof formData.hero, value: string) => {
        const updatedData = {
            ...formData,
            hero: { ...formData.hero, [field]: value }
        }
        handleChange(updatedData)
    }

    const updateContactInfo = (section: string, field: string, value: string) => {
        const updatedData = { ...formData }
        if (section === 'address') {
            updatedData.contact_info.address = { ...updatedData.contact_info.address, [field]: value }
        } else if (section === 'business_hours') {
            updatedData.contact_info.business_hours = { ...updatedData.contact_info.business_hours, [field]: value }
        } else {
            (updatedData.contact_info as any)[field] = value
        }
        handleChange(updatedData)
    }

    const addOffice = () => {
        const newOffice: Office = {
            city: 'Nueva Ciudad',
            country: 'País',
            address: 'Dirección',
            phone: '+1 234 567 8900',
            email: 'contacto@sevp.com',
            is_headquarters: false
        }
        const updatedData = {
            ...formData,
            offices: [...formData.offices, newOffice]
        }
        handleChange(updatedData)
        setEditingOffice(formData.offices.length)
    }

    const updateOffice = (index: number, field: keyof Office, value: string | boolean) => {
        const updatedOffices = [...formData.offices]
        updatedOffices[index] = { ...updatedOffices[index], [field]: value }
        const updatedData = { ...formData, offices: updatedOffices }
        handleChange(updatedData)
    }

    const deleteOffice = (index: number) => {
        const updatedOffices = formData.offices.filter((_, i) => i !== index)
        const updatedData = { ...formData, offices: updatedOffices }
        handleChange(updatedData)
        setEditingOffice(null)
    }

    const addContactReason = () => {
        const newReason: ContactReason = {
            title: 'Nuevo Motivo',
            description: 'Descripción del motivo de contacto',
            icon: '📧',
            email: 'contacto@sevp.com'
        }
        const updatedData = {
            ...formData,
            contact_reasons: [...formData.contact_reasons, newReason]
        }
        handleChange(updatedData)
        setEditingReason(formData.contact_reasons.length)
    }

    const updateContactReason = (index: number, field: keyof ContactReason, value: string) => {
        const updatedReasons = [...formData.contact_reasons]
        updatedReasons[index] = { ...updatedReasons[index], [field]: value }
        const updatedData = { ...formData, contact_reasons: updatedReasons }
        handleChange(updatedData)
    }

    const deleteContactReason = (index: number) => {
        const updatedReasons = formData.contact_reasons.filter((_, i) => i !== index)
        const updatedData = { ...formData, contact_reasons: updatedReasons }
        handleChange(updatedData)
        setEditingReason(null)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Editor de Contacto</h3>
                <div className="flex gap-2">
                    <button
                        onClick={addOffice}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Building className="h-4 w-4" />
                        Oficina
                    </button>
                    <button
                        onClick={addContactReason}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Motivo
                    </button>
                </div>
            </div>

            {/* Sección Hero */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Contenido Principal</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título
                        </label>
                        <input
                            type="text"
                            value={formData.hero.title}
                            onChange={(e) => updateHero('title', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Contáctanos"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtítulo
                        </label>
                        <input
                            type="text"
                            value={formData.hero.subtitle}
                            onChange={(e) => updateHero('subtitle', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Estamos aquí para ayudarte"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={formData.hero.description}
                            onChange={(e) => updateHero('description', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Ponte en contacto con nuestro equipo..."
                        />
                    </div>
                </div>
            </div>

            {/* Información de Contacto Principal */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información de Contacto Principal</h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Phone className="inline h-4 w-4 mr-1" />
                                Teléfono Principal
                            </label>
                            <input
                                type="text"
                                value={formData.contact_info.phone}
                                onChange={(e) => updateContactInfo('', 'phone', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="+52 55 1234 5678"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Mail className="inline h-4 w-4 mr-1" />
                                Email Principal
                            </label>
                            <input
                                type="email"
                                value={formData.contact_info.email}
                                onChange={(e) => updateContactInfo('', 'email', e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="contacto@sevp.com"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <h5 className="font-medium text-gray-800 mb-2">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            Dirección Principal
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Calle</label>
                                <input
                                    type="text"
                                    value={formData.contact_info.address.street}
                                    onChange={(e) => updateContactInfo('address', 'street', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Av. Revolución 1234, Piso 15"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad</label>
                                <input
                                    type="text"
                                    value={formData.contact_info.address.city}
                                    onChange={(e) => updateContactInfo('address', 'city', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Ciudad de México"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">País</label>
                                <input
                                    type="text"
                                    value={formData.contact_info.address.country}
                                    onChange={(e) => updateContactInfo('address', 'country', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="México"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Código Postal</label>
                                <input
                                    type="text"
                                    value={formData.contact_info.address.postal_code}
                                    onChange={(e) => updateContactInfo('address', 'postal_code', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="06030"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h5 className="font-medium text-gray-800 mb-2">
                            <Clock className="inline h-4 w-4 mr-1" />
                            Horarios de Atención
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Días de Semana</label>
                                <input
                                    type="text"
                                    value={formData.contact_info.business_hours.weekdays}
                                    onChange={(e) => updateContactInfo('business_hours', 'weekdays', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Lunes a Viernes: 9:00 AM - 6:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Zona Horaria</label>
                                <input
                                    type="text"
                                    value={formData.contact_info.business_hours.timezone}
                                    onChange={(e) => updateContactInfo('business_hours', 'timezone', e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="GMT-6 (Hora de México)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Oficinas */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Oficinas</h4>
                {formData.offices.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay oficinas. Haz clic en "Oficina" para empezar.</p>
                    </div>
                ) : (
                    formData.offices.map((office, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Oficina #{index + 1}
                                    </span>
                                    {office.is_headquarters && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            Sede Principal
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingOffice(editingOffice === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingOffice === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteOffice(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingOffice === index ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ciudad
                                            </label>
                                            <input
                                                type="text"
                                                value={office.city}
                                                onChange={(e) => updateOffice(index, 'city', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Ciudad de México"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                País
                                            </label>
                                            <input
                                                type="text"
                                                value={office.country}
                                                onChange={(e) => updateOffice(index, 'country', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="México"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Teléfono
                                            </label>
                                            <input
                                                type="text"
                                                value={office.phone}
                                                onChange={(e) => updateOffice(index, 'phone', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="+52 55 1234 5678"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={office.email}
                                                onChange={(e) => updateOffice(index, 'email', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="mexico@sevp.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            value={office.address}
                                            onChange={(e) => updateOffice(index, 'address', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Av. Revolución 1234"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={office.is_headquarters}
                                                onChange={(e) => updateOffice(index, 'is_headquarters', e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Sede Principal</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h5 className="font-medium text-gray-900">{office.city}, {office.country}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{office.address}</p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                        <span>📞 {office.phone}</span>
                                        <span>✉️ {office.email}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Motivos de Contacto */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Motivos de Contacto</h4>
                {formData.contact_reasons.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay motivos. Haz clic en "Motivo" para empezar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.contact_reasons.map((reason, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-sm font-medium text-gray-500">Motivo #{index + 1}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingReason(editingReason === index ? null : index)}
                                            className="text-blue-600 hover:text-blue-700 text-xs"
                                        >
                                            {editingReason === index ? 'Cerrar' : 'Editar'}
                                        </button>
                                        <button
                                            onClick={() => deleteContactReason(index)}
                                            className="text-red-600 hover:text-red-700 text-xs"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                {editingReason === index ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                                            <input
                                                type="text"
                                                value={reason.title}
                                                onChange={(e) => updateContactReason(index, 'title', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="Ventas"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Icono (emoji)</label>
                                            <input
                                                type="text"
                                                value={reason.icon}
                                                onChange={(e) => updateContactReason(index, 'icon', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="💼"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={reason.email}
                                                onChange={(e) => updateContactReason(index, 'email', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="ventas@sevp.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
                                            <textarea
                                                value={reason.description}
                                                onChange={(e) => updateContactReason(index, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="Solicita una demostración..."
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">{reason.icon}</div>
                                        <h5 className="font-medium text-gray-900">{reason.title}</h5>
                                        <p className="text-xs text-gray-600 mb-2">{reason.description}</p>
                                        <span className="text-xs text-blue-600">{reason.email}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}