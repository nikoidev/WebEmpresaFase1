'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Globe, MessageSquare } from 'lucide-react'

interface ContactInfo {
    address: string
    city: string
    country: string
    postal_code?: string
    phone: string
    email: string
    website?: string
    business_hours: {
        monday_friday: string
        saturday: string
        sunday: string
    }
}

interface SocialMedia {
    platform: string
    url: string
    username?: string
}

interface ContactData {
    page_content: {
        title: string
        subtitle: string
        description: string
    }
    contact_info: ContactInfo
    social_media: SocialMedia[]
    map_settings: {
        show_map: boolean
        map_embed_url?: string
        latitude?: number
        longitude?: number
    }
    contact_form_settings: {
        show_form: boolean
        form_title: string
        success_message: string
        fields: {
            name_required: boolean
            email_required: boolean
            phone_required: boolean
            subject_required: boolean
            message_required: boolean
        }
    }
}

interface ContactEditorProps {
    data: ContactData
    onChange: (data: ContactData) => void
}

export default function ContactEditor({ data, onChange }: ContactEditorProps) {
    const [pageContent, setPageContent] = useState(data.page_content || {
        title: 'Contáctanos',
        subtitle: 'Estamos aquí para ayudarte',
        description: 'Ponte en contacto con nosotros para cualquier consulta o solicitud de información.'
    })
    
    const [contactInfo, setContactInfo] = useState<ContactInfo>(data.contact_info || {
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        business_hours: {
            monday_friday: '9:00 AM - 6:00 PM',
            saturday: '9:00 AM - 12:00 PM',
            sunday: 'Cerrado'
        }
    })

    const [socialMedia, setSocialMedia] = useState<SocialMedia[]>(data.social_media || [])
    
    const [mapSettings, setMapSettings] = useState(data.map_settings || {
        show_map: false
    })
    
    const [contactFormSettings, setContactFormSettings] = useState(data.contact_form_settings || {
        show_form: true,
        form_title: 'Envíanos un mensaje',
        success_message: 'Gracias por tu mensaje. Te responderemos pronto.',
        fields: {
            name_required: true,
            email_required: true,
            phone_required: false,
            subject_required: true,
            message_required: true
        }
    })

    useEffect(() => {
        onChange({
            page_content: pageContent,
            contact_info: contactInfo,
            social_media: socialMedia,
            map_settings: mapSettings,
            contact_form_settings: contactFormSettings
        })
    }, [pageContent, contactInfo, socialMedia, mapSettings, contactFormSettings, onChange])

    const addSocialMedia = () => {
        setSocialMedia([...socialMedia, { platform: '', url: '' }])
    }

    const updateSocialMedia = (index: number, field: keyof SocialMedia, value: string) => {
        const updated = [...socialMedia]
        updated[index] = { ...updated[index], [field]: value }
        setSocialMedia(updated)
    }

    const deleteSocialMedia = (index: number) => {
        setSocialMedia(socialMedia.filter((_, i) => i !== index))
    }

    const socialPlatforms = [
        'Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube', 'WhatsApp', 'Telegram', 'Otro'
    ]

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Gestión de Página de Contacto</h3>

            {/* Contenido de la Página */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Contenido de la Página</h4>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título Principal
                        </label>
                        <input
                            type="text"
                            value={pageContent.title}
                            onChange={(e) => setPageContent({ ...pageContent, title: e.target.value })}
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
                            value={pageContent.subtitle}
                            onChange={(e) => setPageContent({ ...pageContent, subtitle: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Estamos aquí para ayudarte"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={pageContent.description}
                            onChange={(e) => setPageContent({ ...pageContent, description: e.target.value })}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Descripción de la página de contacto..."
                        />
                    </div>
                </div>
            </div>

            {/* Información de Contacto */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Información de Contacto</h4>
                <div className="space-y-4">
                    {/* Dirección */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <MapPin className="inline h-4 w-4 mr-1" />
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={contactInfo.address}
                                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Calle y número"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ciudad
                            </label>
                            <input
                                type="text"
                                value={contactInfo.city}
                                onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Ciudad"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                País
                            </label>
                            <input
                                type="text"
                                value={contactInfo.country}
                                onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="País"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                value={contactInfo.postal_code || ''}
                                onChange={(e) => setContactInfo({ ...contactInfo, postal_code: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="Código postal"
                            />
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Phone className="inline h-4 w-4 mr-1" />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Mail className="inline h-4 w-4 mr-1" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="contacto@empresa.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Globe className="inline h-4 w-4 mr-1" />
                                Sitio Web
                            </label>
                            <input
                                type="url"
                                value={contactInfo.website || ''}
                                onChange={(e) => setContactInfo({ ...contactInfo, website: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                placeholder="https://empresa.com"
                            />
                        </div>
                    </div>

                    {/* Horarios */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="inline h-4 w-4 mr-1" />
                            Horarios de Atención
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Lunes a Viernes</label>
                                <input
                                    type="text"
                                    value={contactInfo.business_hours.monday_friday}
                                    onChange={(e) => setContactInfo({
                                        ...contactInfo,
                                        business_hours: { ...contactInfo.business_hours, monday_friday: e.target.value }
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="9:00 AM - 6:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Sábado</label>
                                <input
                                    type="text"
                                    value={contactInfo.business_hours.saturday}
                                    onChange={(e) => setContactInfo({
                                        ...contactInfo,
                                        business_hours: { ...contactInfo.business_hours, saturday: e.target.value }
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="9:00 AM - 12:00 PM"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Domingo</label>
                                <input
                                    type="text"
                                    value={contactInfo.business_hours.sunday}
                                    onChange={(e) => setContactInfo({
                                        ...contactInfo,
                                        business_hours: { ...contactInfo.business_hours, sunday: e.target.value }
                                    })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Cerrado"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redes Sociales */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Redes Sociales</h4>
                    <button
                        onClick={addSocialMedia}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                        Agregar Red Social
                    </button>
                </div>
                <div className="space-y-2">
                    {socialMedia.map((social, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <select
                                value={social.platform}
                                onChange={(e) => updateSocialMedia(index, 'platform', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2"
                            >
                                <option value="">Seleccionar plataforma</option>
                                {socialPlatforms.map(platform => (
                                    <option key={platform} value={platform}>{platform}</option>
                                ))}
                            </select>
                            <input
                                type="url"
                                value={social.url}
                                onChange={(e) => updateSocialMedia(index, 'url', e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                placeholder="URL de la red social"
                            />
                            <input
                                type="text"
                                value={social.username || ''}
                                onChange={(e) => updateSocialMedia(index, 'username', e.target.value)}
                                className="w-32 border border-gray-300 rounded-md px-3 py-2"
                                placeholder="@usuario"
                            />
                            <button
                                onClick={() => deleteSocialMedia(index)}
                                className="text-red-600 hover:text-red-700 px-2"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Configuración del Mapa */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Configuración del Mapa</h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={mapSettings.show_map}
                            onChange={(e) => setMapSettings({ ...mapSettings, show_map: e.target.checked })}
                            className="rounded"
                        />
                        <span className="text-sm text-gray-700">Mostrar mapa en la página</span>
                    </label>
                    
                    {mapSettings.show_map && (
                        <div className="space-y-3 ml-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL de Google Maps Embed
                                </label>
                                <input
                                    type="url"
                                    value={mapSettings.map_embed_url || ''}
                                    onChange={(e) => setMapSettings({ ...mapSettings, map_embed_url: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={mapSettings.latitude || ''}
                                        onChange={(e) => setMapSettings({ ...mapSettings, latitude: parseFloat(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="9.9281"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitud
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={mapSettings.longitude || ''}
                                        onChange={(e) => setMapSettings({ ...mapSettings, longitude: parseFloat(e.target.value) })}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        placeholder="-84.0907"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Configuración del Formulario */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                    <MessageSquare className="inline h-4 w-4 mr-1" />
                    Configuración del Formulario de Contacto
                </h4>
                <div className="space-y-3">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={contactFormSettings.show_form}
                            onChange={(e) => setContactFormSettings({ ...contactFormSettings, show_form: e.target.checked })}
                            className="rounded"
                        />
                        <span className="text-sm text-gray-700">Mostrar formulario de contacto</span>
                    </label>
                    
                    {contactFormSettings.show_form && (
                        <div className="space-y-3 ml-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título del Formulario
                                </label>
                                <input
                                    type="text"
                                    value={contactFormSettings.form_title}
                                    onChange={(e) => setContactFormSettings({ ...contactFormSettings, form_title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Envíanos un mensaje"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mensaje de Éxito
                                </label>
                                <input
                                    type="text"
                                    value={contactFormSettings.success_message}
                                    onChange={(e) => setContactFormSettings({ ...contactFormSettings, success_message: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    placeholder="Gracias por tu mensaje. Te responderemos pronto."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Campos Requeridos
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {Object.entries(contactFormSettings.fields).map(([field, required]) => (
                                        <label key={field} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={required}
                                                onChange={(e) => setContactFormSettings({
                                                    ...contactFormSettings,
                                                    fields: { ...contactFormSettings.fields, [field]: e.target.checked }
                                                })}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700 capitalize">
                                                {field.replace('_required', '').replace('_', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
