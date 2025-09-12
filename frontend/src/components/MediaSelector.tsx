'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Link2, Image, Video, Search } from 'lucide-react'
import { api } from '@/lib/api'

interface MediaFile {
    id: number
    filename: string
    original_filename: string
    file_type: 'image' | 'video' | 'document'
    public_url: string
    file_size: number
    size_formatted: string
    alt_text: string
    description: string
    created_at: string
}

interface MediaSelectorProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (url: string, alt?: string) => void
    fileType?: 'image' | 'video' | 'all'
    title?: string
}

export default function MediaSelector({ 
    isOpen, 
    onClose, 
    onSelect, 
    fileType = 'all',
    title = 'Seleccionar Archivo'
}: MediaSelectorProps) {
    const [files, setFiles] = useState<MediaFile[]>([])
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'url'>('gallery')
    const [search, setSearch] = useState('')
    const [urlInput, setUrlInput] = useState('')
    const [urlDescription, setUrlDescription] = useState('')

    useEffect(() => {
        if (isOpen) {
            loadFiles()
        }
    }, [isOpen, fileType])

    const loadFiles = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (fileType !== 'all') params.append('file_type', fileType)
            if (search) params.append('search', search)
            
            const response = await api.get(`/api/media/?${params.toString()}`)
            setFiles(response.data.files || [])
        } catch (error) {
            console.error('Error loading files:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('storage_type', 'database')
            
            const response = await api.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            
            // Recargar archivos y seleccionar el nuevo
            await loadFiles()
            onSelect(response.data.public_url, file.name)
            onClose()
        } catch (error) {
            console.error('Error uploading file:', error)
            alert('Error al subir archivo')
        } finally {
            setUploading(false)
        }
    }

    const handleUrlSubmit = async () => {
        if (!urlInput.trim()) return

        setUploading(true)
        try {
            const response = await api.post('/api/media/url', {
                url: urlInput,
                filename: urlDescription || 'Archivo externo',
                file_type: fileType === 'all' ? 'image' : fileType,
                alt_text: urlDescription
            })
            
            onSelect(urlInput, urlDescription)
            onClose()
            setUrlInput('')
            setUrlDescription('')
        } catch (error) {
            console.error('Error adding URL:', error)
            alert('Error al agregar URL')
        } finally {
            setUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[600px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`px-4 py-2 font-medium ${activeTab === 'gallery' 
                            ? 'text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Image className="h-4 w-4 inline mr-2" />
                        Galería
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`px-4 py-2 font-medium ${activeTab === 'upload' 
                            ? 'text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Upload className="h-4 w-4 inline mr-2" />
                        Subir
                    </button>
                    <button
                        onClick={() => setActiveTab('url')}
                        className={`px-4 py-2 font-medium ${activeTab === 'url' 
                            ? 'text-primary-600 border-b-2 border-primary-600' 
                            : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        <Link2 className="h-4 w-4 inline mr-2" />
                        URL Externa
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-hidden">
                    {activeTab === 'gallery' && (
                        <div className="h-full flex flex-col">
                            {/* Search */}
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar archivos..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && loadFiles()}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            {/* Files Grid */}
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {files.map((file) => (
                                            <div
                                                key={file.id}
                                                onClick={() => {
                                                    onSelect(file.public_url, file.alt_text)
                                                    onClose()
                                                }}
                                                className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                                            >
                                                {file.file_type === 'image' ? (
                                                    <img
                                                        src={file.public_url}
                                                        alt={file.alt_text}
                                                        className="w-full h-24 object-cover rounded mb-2"
                                                    />
                                                ) : (
                                                    <div className="w-full h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                                                        <Video className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium truncate">{file.original_filename}</p>
                                                <p className="text-xs text-gray-500">{file.size_formatted}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'upload' && (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-lg font-medium mb-2">Subir archivo</p>
                                    <p className="text-gray-600 mb-4">Máximo 10MB</p>
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        accept={fileType === 'image' ? 'image/*' : fileType === 'video' ? 'video/*' : 'image/*,video/*'}
                                        disabled={uploading}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="bg-primary-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-primary-700 disabled:opacity-50"
                                    >
                                        {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'url' && (
                        <div className="h-full flex items-center justify-center">
                            <div className="w-full max-w-md">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL del archivo
                                        </label>
                                        <input
                                            type="url"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            placeholder="https://example.com/imagen.jpg"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={urlDescription}
                                            onChange={(e) => setUrlDescription(e.target.value)}
                                            placeholder="Descripción del archivo"
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleUrlSubmit}
                                        disabled={!urlInput.trim() || uploading}
                                        className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                                    >
                                        {uploading ? 'Agregando...' : 'Agregar URL'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
