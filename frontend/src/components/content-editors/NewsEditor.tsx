'use client'

import React, { useState, useEffect } from 'react'
import { Plus, X, Image, Calendar, Eye, EyeOff } from 'lucide-react'

interface NewsArticle {
    id?: number
    title: string
    summary: string
    content: string
    image_url?: string
    author: string
    publication_date: string
    is_featured: boolean
    is_active: boolean
    tags: string[]
}

interface NewsData {
    articles: NewsArticle[]
}

interface NewsEditorProps {
    data: NewsData
    onChange: (data: NewsData) => void
}

export default function NewsEditor({ data, onChange }: NewsEditorProps) {
    const [articles, setArticles] = useState<NewsArticle[]>(data.articles || [])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [newTag, setNewTag] = useState('')

    useEffect(() => {
        onChange({ articles })
    }, [articles, onChange])

    const addArticle = () => {
        const newArticle: NewsArticle = {
            title: '',
            summary: '',
            content: '',
            author: 'Admin',
            publication_date: new Date().toISOString().split('T')[0],
            is_featured: false,
            is_active: true,
            tags: []
        }
        setArticles([...articles, newArticle])
        setEditingIndex(articles.length)
    }

    const updateArticle = (index: number, field: keyof NewsArticle, value: any) => {
        const updatedArticles = [...articles]
        updatedArticles[index] = { ...updatedArticles[index], [field]: value }
        setArticles(updatedArticles)
    }

    const deleteArticle = (index: number) => {
        const updatedArticles = articles.filter((_, i) => i !== index)
        setArticles(updatedArticles)
        setEditingIndex(null)
    }

    const addTag = (index: number) => {
        if (!newTag.trim()) return
        const updatedArticles = [...articles]
        updatedArticles[index].tags = [...updatedArticles[index].tags, newTag.trim()]
        setArticles(updatedArticles)
        setNewTag('')
    }

    const removeTag = (articleIndex: number, tagIndex: number) => {
        const updatedArticles = [...articles]
        updatedArticles[articleIndex].tags = updatedArticles[articleIndex].tags.filter((_, i) => i !== tagIndex)
        setArticles(updatedArticles)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Noticias</h3>
                <button
                    onClick={addArticle}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Artículo
                </button>
            </div>

            {articles.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No hay artículos. Haz clic en "Agregar Artículo" para empezar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {articles.map((article, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Artículo #{index + 1}
                                    </span>
                                    {article.is_featured && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                            Destacado
                                        </span>
                                    )}
                                    {!article.is_active && (
                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                            Inactivo
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingIndex === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteArticle(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingIndex === index ? (
                                <div className="space-y-4">
                                    {/* Título */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            value={article.title}
                                            onChange={(e) => updateArticle(index, 'title', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Título del artículo"
                                        />
                                    </div>

                                    {/* Resumen */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Resumen *
                                        </label>
                                        <textarea
                                            value={article.summary}
                                            onChange={(e) => updateArticle(index, 'summary', e.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Resumen del artículo"
                                        />
                                    </div>

                                    {/* Contenido */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contenido *
                                        </label>
                                        <textarea
                                            value={article.content}
                                            onChange={(e) => updateArticle(index, 'content', e.target.value)}
                                            rows={8}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Contenido completo del artículo"
                                        />
                                    </div>

                                    {/* Metadatos */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Image className="inline h-4 w-4 mr-1" />
                                                URL de Imagen
                                            </label>
                                            <input
                                                type="url"
                                                value={article.image_url || ''}
                                                onChange={(e) => updateArticle(index, 'image_url', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://ejemplo.com/imagen.jpg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Autor
                                            </label>
                                            <input
                                                type="text"
                                                value={article.author}
                                                onChange={(e) => updateArticle(index, 'author', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nombre del autor"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Calendar className="inline h-4 w-4 mr-1" />
                                                Fecha de Publicación
                                            </label>
                                            <input
                                                type="date"
                                                value={article.publication_date}
                                                onChange={(e) => updateArticle(index, 'publication_date', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Etiquetas
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {article.tags.map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                                                >
                                                    {tag}
                                                    <button
                                                        onClick={() => removeTag(index, tagIndex)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addTag(index)}
                                                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nueva etiqueta"
                                            />
                                            <button
                                                onClick={() => addTag(index)}
                                                className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700"
                                            >
                                                Agregar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Opciones */}
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={article.is_featured}
                                                onChange={(e) => updateArticle(index, 'is_featured', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Artículo destacado</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={article.is_active}
                                                onChange={(e) => updateArticle(index, 'is_active', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Artículo activo</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {article.title || 'Sin título'}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {article.summary || 'Sin resumen'}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>Por: {article.author}</span>
                                        <span>{article.publication_date}</span>
                                        <span className="flex items-center gap-1">
                                            {article.is_active ? (
                                                <><Eye className="h-3 w-3" /> Visible</>
                                            ) : (
                                                <><EyeOff className="h-3 w-3" /> Oculto</>
                                            )}
                                        </span>
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
