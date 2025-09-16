'use client'

import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Building } from 'lucide-react'
import { adminApi } from '@/lib/api'
import ImageUploader from './ImageUploader'

interface ClientType {
    name: string
    description: string
    count: string
    image: string
}

interface ClientTypesModalProps {
    isOpen: boolean
    onClose: () => void
    pageKey: string
    initialContent: any
    onSave: () => Promise<void>
    isSaving?: boolean
}

export default function ClientTypesModal({
    isOpen,
    onClose,
    pageKey,
    initialContent,
    onSave,
    isSaving = false
}: ClientTypesModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [clientTypes, setClientTypes] = useState<ClientType[]>([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (isOpen && initialContent?.content_json) {
            const content = initialContent.content_json
            setTitle(content.client_types_title || 'Tipos de Instituciones')
            setDescription(content.client_types_description || 'Trabajamos con diferentes tipos de instituciones educativas')
            setClientTypes(content.client_types || [])
        }
    }, [isOpen, initialContent])

    const handleSave = async () => {
        setSaving(true)
        try {
            const updatedContentJson = {
                ...initialContent.content_json,
                client_types_title: title,
                client_types_description: description,
                client_types: clientTypes
            }

            const updatePayload = {
                title: initialContent.title,
                content_json: updatedContentJson,
                meta_title: initialContent.meta_title,
                meta_description: initialContent.meta_description,
                meta_keywords: initialContent.meta_keywords,
                is_active: initialContent.is_active
            }

            await adminApi.updatePageContent(pageKey, updatePayload)
            await onSave()
            onClose()
        } catch (error) {
            console.error('Error saving client types:', error)
            alert('❌ Error al guardar los tipos de clientes')
        } finally {
            setSaving(false)
        }
    }

    const addClientType = () => {
        setClientTypes([...clientTypes, { name: '', description: '', count: '', image: '' }])
    }

    const removeClientType = (index: number) => {
        setClientTypes(clientTypes.filter((_, i) => i !== index))
    }

    const updateClientType = (index: number, field: keyof ClientType, value: string) => {
        const newTypes = [...clientTypes]
        newTypes[index] = { ...newTypes[index], [field]: value }
        setClientTypes(newTypes)
    }

    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose()
                }
            }}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Editar Tipos de Clientes
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        type="button"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Título de la sección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Título de la Sección
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Tipos de Instituciones"
                        />
                    </div>

                    {/* Descripción de la sección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción de la Sección
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Trabajamos con diferentes tipos de instituciones educativas"
                        />
                    </div>

                    {/* Tipos de Clientes */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Tipos de Clientes
                            </h3>
                            <button
                                onClick={addClientType}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                                type="button"
                            >
                                <Plus className="h-5 w-5" />
                                Agregar Tipo de Cliente
                            </button>
                        </div>

                        <div className="space-y-4">
                            {clientTypes.map((type, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-gray-900">
                                            Tipo #{index + 1}
                                        </h4>
                                        <button
                                            onClick={() => removeClientType(index)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                            type="button"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Nombre */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={type.name}
                                                onChange={(e) => updateClientType(index, 'name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Universidades"
                                            />
                                        </div>

                                        {/* Cantidad */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cantidad
                                            </label>
                                            <input
                                                type="text"
                                                value={type.count}
                                                onChange={(e) => updateClientType(index, 'count', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="150"
                                            />
                                        </div>
                                    </div>

                                    {/* Descripción */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={type.description}
                                            onChange={(e) => updateClientType(index, 'description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Instituciones de educación superior que buscan modernizar sus procesos"
                                        />
                                    </div>

                                    {/* Imagen/Icono */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Icono/Logo del Tipo de Cliente
                                        </label>
                                        <div className="max-w-xs">
                                            <ImageUploader
                                                currentImageUrl={type.image}
                                                onImageChange={(imageUrl) => updateClientType(index, 'image', imageUrl)}
                                                maxWidth={80}
                                                maxHeight={80}
                                                quality={0.9}
                                                className="text-center"
                                            />
                                        </div>
                                        {type.image && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                <Building className="h-4 w-4" />
                                                Imagen guardada
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {clientTypes.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p>No hay tipos de clientes configurados</p>
                                    <p className="text-sm">Haz clic en "Agregar Tipo de Cliente" para comenzar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={saving || isSaving}
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || isSaving}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            type="button"
                        >
                            {saving || isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
