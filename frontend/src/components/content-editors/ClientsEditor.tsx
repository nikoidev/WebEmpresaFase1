'use client'

import React, { useState, useEffect } from 'react'
import { Plus, X, Building, Globe, Users } from 'lucide-react'

interface Client {
    id?: number
    name: string
    logo_url?: string
    website_url?: string
    description?: string
    industry?: string
    is_featured: boolean
    order: number
}

interface ClientsData {
    clients: Client[]
    page_content: {
        title: string
        subtitle: string
        description: string
    }
    stats?: {
        total_clients: number
        years_experience: number
        success_rate: number
    }
}

interface ClientsEditorProps {
    data: ClientsData
    onChange: (data: ClientsData) => void
}

export default function ClientsEditor({ data, onChange }: ClientsEditorProps) {
    const [clients, setClients] = useState<Client[]>(data.clients || [])
    const [pageContent, setPageContent] = useState(data.page_content || {
        title: 'Nuestros Clientes',
        subtitle: 'Empresas que confían en nosotros',
        description: 'Trabajamos con empresas de diferentes sectores, brindando soluciones tecnológicas de calidad.'
    })
    const [stats, setStats] = useState(data.stats || {
        total_clients: 0,
        years_experience: 0,
        success_rate: 0
    })
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    useEffect(() => {
        onChange({ clients, page_content: pageContent, stats })
    }, [clients, pageContent, stats, onChange])

    const addClient = () => {
        const newClient: Client = {
            name: '',
            is_featured: false,
            order: clients.length + 1
        }
        setClients([...clients, newClient])
        setEditingIndex(clients.length)
    }

    const updateClient = (index: number, field: keyof Client, value: any) => {
        const updatedClients = [...clients]
        updatedClients[index] = { ...updatedClients[index], [field]: value }
        setClients(updatedClients)
    }

    const deleteClient = (index: number) => {
        const updatedClients = clients.filter((_, i) => i !== index)
        setClients(updatedClients)
        setEditingIndex(null)
    }

    const moveClient = (index: number, direction: 'up' | 'down') => {
        const newClients = [...clients]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        
        if (targetIndex < 0 || targetIndex >= clients.length) return
        
        // Intercambiar elementos
        [newClients[index], newClients[targetIndex]] = [newClients[targetIndex], newClients[index]]
        
        // Actualizar órdenes
        newClients[index].order = index + 1
        newClients[targetIndex].order = targetIndex + 1
        
        setClients(newClients)
        setEditingIndex(targetIndex)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Clientes</h3>
                <button
                    onClick={addClient}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Cliente
                </button>
            </div>

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
                            placeholder="Nuestros Clientes"
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
                            placeholder="Empresas que confían en nosotros"
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
                            placeholder="Descripción de la sección de clientes..."
                        />
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Estadísticas (Opcional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Users className="inline h-4 w-4 mr-1" />
                            Total de Clientes
                        </label>
                        <input
                            type="number"
                            value={stats.total_clients}
                            onChange={(e) => setStats({ ...stats, total_clients: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Años de Experiencia
                        </label>
                        <input
                            type="number"
                            value={stats.years_experience}
                            onChange={(e) => setStats({ ...stats, years_experience: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tasa de Éxito (%)
                        </label>
                        <input
                            type="number"
                            value={stats.success_rate}
                            onChange={(e) => setStats({ ...stats, success_rate: parseInt(e.target.value) || 0 })}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min="0"
                            max="100"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de Clientes */}
            {clients.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay clientes. Haz clic en "Agregar Cliente" para empezar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {clients.map((client, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Cliente #{index + 1}
                                    </span>
                                    {client.is_featured && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                            Destacado
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {index > 0 && (
                                        <button
                                            onClick={() => moveClient(index, 'up')}
                                            className="text-gray-600 hover:text-gray-700 text-sm"
                                        >
                                            ↑
                                        </button>
                                    )}
                                    {index < clients.length - 1 && (
                                        <button
                                            onClick={() => moveClient(index, 'down')}
                                            className="text-gray-600 hover:text-gray-700 text-sm"
                                        >
                                            ↓
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingIndex === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteClient(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingIndex === index ? (
                                <div className="space-y-4">
                                    {/* Información Básica */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Building className="inline h-4 w-4 mr-1" />
                                                Nombre de la Empresa *
                                            </label>
                                            <input
                                                type="text"
                                                value={client.name}
                                                onChange={(e) => updateClient(index, 'name', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nombre de la empresa"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Sector/Industria
                                            </label>
                                            <input
                                                type="text"
                                                value={client.industry || ''}
                                                onChange={(e) => updateClient(index, 'industry', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Tecnología, Salud, Educación, etc."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                URL del Logo
                                            </label>
                                            <input
                                                type="url"
                                                value={client.logo_url || ''}
                                                onChange={(e) => updateClient(index, 'logo_url', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://ejemplo.com/logo.png"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Globe className="inline h-4 w-4 mr-1" />
                                                Sitio Web
                                            </label>
                                            <input
                                                type="url"
                                                value={client.website_url || ''}
                                                onChange={(e) => updateClient(index, 'website_url', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://ejemplo.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción del Cliente
                                        </label>
                                        <textarea
                                            value={client.description || ''}
                                            onChange={(e) => updateClient(index, 'description', e.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Breve descripción del cliente y el trabajo realizado..."
                                        />
                                    </div>

                                    {/* Opciones */}
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={client.is_featured}
                                                onChange={(e) => updateClient(index, 'is_featured', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Cliente destacado</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start gap-4">
                                        {client.logo_url && (
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={client.logo_url}
                                                    alt={client.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {client.name || 'Sin nombre'}
                                            </h4>
                                            {client.industry && (
                                                <p className="text-sm text-gray-600">{client.industry}</p>
                                            )}
                                            {client.description && (
                                                <p className="text-sm text-gray-700 mt-1">{client.description}</p>
                                            )}
                                            {client.website_url && (
                                                <p className="text-sm text-blue-600 mt-1">
                                                    <Globe className="inline h-3 w-3 mr-1" />
                                                    {client.website_url}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
