'use client'

import { adminApi } from '@/lib/api'
import type { CompanyInfo } from '@/types'
import {
    Edit,
    Globe,
    Mail,
    MapPin,
    Phone,
    Save
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function CompanyManagementPage() {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        mission: '',
        vision: '',
        values: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        social_media: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        },
        founded_year: '',
        team_size: '',
        logo_url: ''
    })

    useEffect(() => {
        fetchCompanyInfo()
    }, [])

    const fetchCompanyInfo = async () => {
        try {
            const response = await adminApi.company.get()
            const data = response.data.results?.[0] || response.data[0] || response.data
            if (data) {
                setCompanyInfo(data)
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    mission: data.mission || '',
                    vision: data.vision || '',
                    values: data.values || '',
                    address: data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    website: data.website || '',
                    social_media: data.social_media || {
                        facebook: '',
                        twitter: '',
                        linkedin: '',
                        instagram: ''
                    },
                    founded_year: data.founded_year ? data.founded_year.toString() : '',
                    team_size: data.team_size ? data.team_size.toString() : '',
                    logo_url: data.logo_url || ''
                })
            }
        } catch (error) {
            console.error('Error fetching company info:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const updateData = {
                ...formData,
                founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
                team_size: formData.team_size ? parseInt(formData.team_size) : null
            }

            if (companyInfo) {
                await adminApi.company.update(updateData)
            }

            setEditing(false)
            fetchCompanyInfo()
        } catch (error) {
            console.error('Error saving company info:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setEditing(false)
        if (companyInfo) {
            setFormData({
                name: companyInfo.name || '',
                description: companyInfo.description || '',
                mission: companyInfo.mission || '',
                vision: companyInfo.vision || '',
                values: companyInfo.values || '',
                address: companyInfo.address || '',
                phone: companyInfo.phone || '',
                email: companyInfo.email || '',
                website: companyInfo.website || '',
                social_media: companyInfo.social_media || {
                    facebook: '',
                    twitter: '',
                    linkedin: '',
                    instagram: ''
                },
                founded_year: companyInfo.founded_year ? companyInfo.founded_year.toString() : '',
                team_size: companyInfo.team_size ? companyInfo.team_size.toString() : '',
                logo_url: companyInfo.logo_url || ''
            })
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Información de la Empresa</h1>
                    <p className="mt-2 text-gray-600">
                        Gestiona la información general de tu empresa
                    </p>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Edit size={20} />
                        Editar
                    </button>
                )}
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la Empresa
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL del Logo
                                </label>
                                <input
                                    type="url"
                                    value={formData.logo_url}
                                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Año de Fundación
                                </label>
                                <input
                                    type="number"
                                    value={formData.founded_year}
                                    onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tamaño del Equipo
                                </label>
                                <input
                                    type="number"
                                    value={formData.team_size}
                                    onChange={(e) => setFormData({ ...formData, team_size: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mission, Vision, Values */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Misión, Visión y Valores</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Misión
                                </label>
                                <textarea
                                    value={formData.mission}
                                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Visión
                                </label>
                                <textarea
                                    value={formData.vision}
                                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Valores
                                </label>
                                <textarea
                                    value={formData.values}
                                    onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={4}
                                    disabled={!editing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail size={16} className="inline mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone size={16} className="inline mr-1" />
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Globe size={16} className="inline mr-1" />
                                    Sitio Web
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin size={16} className="inline mr-1" />
                                    Dirección
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Facebook
                                </label>
                                <input
                                    type="url"
                                    value={formData.social_media.facebook}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        social_media: {
                                            ...formData.social_media,
                                            facebook: e.target.value
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Twitter
                                </label>
                                <input
                                    type="url"
                                    value={formData.social_media.twitter}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        social_media: {
                                            ...formData.social_media,
                                            twitter: e.target.value
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    value={formData.social_media.linkedin}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        social_media: {
                                            ...formData.social_media,
                                            linkedin: e.target.value
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instagram
                                </label>
                                <input
                                    type="url"
                                    value={formData.social_media.instagram}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        social_media: {
                                            ...formData.social_media,
                                            instagram: e.target.value
                                        }
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={!editing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {editing && (
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                disabled={saving}
                            >
                                <Save size={16} />
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
