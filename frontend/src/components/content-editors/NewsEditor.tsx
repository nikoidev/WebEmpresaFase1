'use client'

import React, { useState, useEffect } from 'react'
import { Plus, FileText, Calendar, Tag, Star } from 'lucide-react'

interface FeaturedPost {
    id: number
    title: string
    excerpt: string
    content: string
    author: string
    date: string
    image: string
    tags: string[]
    is_featured: boolean
    category: string
}

interface RecentPost {
    id: number
    title: string
    date: string
    category: string
}

interface NewsContent {
    hero: {
        title: string
        subtitle: string
        description: string
    }
    featured_posts: FeaturedPost[]
    categories: string[]
    recent_posts: RecentPost[]
}

interface NewsEditorProps {
    data: NewsContent
    onChange: (data: NewsContent) => void
}

export default function NewsEditor({ data, onChange }: NewsEditorProps) {
    const [formData, setFormData] = useState<NewsContent>(data)

    // Sincronizar estado local con props cuando cambian los datos
    useEffect(() => {
        setFormData(data)
    }, [data])
    const [editingPost, setEditingPost] = useState<number | null>(null)
    const [editingRecent, setEditingRecent] = useState<number | null>(null)
    const [newCategory, setNewCategory] = useState('')

    const handleChange = (newData: NewsContent) => {
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

    const addFeaturedPost = () => {
        const newPost: FeaturedPost = {
            id: Date.now(),
            title: 'Nuevo Artículo',
            excerpt: 'Resumen del artículo...',
            content: 'Contenido completo del artículo...',
            author: 'Autor',
            date: new Date().toISOString().split('T')[0],
            image: '',
            tags: ['General'],
            is_featured: false,
            category: 'General'
        }
        const updatedData = {
            ...formData,
            featured_posts: [...formData.featured_posts, newPost]
        }
        handleChange(updatedData)
        setEditingPost(formData.featured_posts.length)
    }

    const updateFeaturedPost = (index: number, field: keyof FeaturedPost, value: any) => {
        const updatedPosts = [...formData.featured_posts]
        updatedPosts[index] = { ...updatedPosts[index], [field]: value }
        const updatedData = { ...formData, featured_posts: updatedPosts }
        handleChange(updatedData)
    }

    const deleteFeaturedPost = (index: number) => {
        const updatedPosts = formData.featured_posts.filter((_, i) => i !== index)
        const updatedData = { ...formData, featured_posts: updatedPosts }
        handleChange(updatedData)
        setEditingPost(null)
    }

    const addTagToPost = (postIndex: number, tag: string) => {
        if (tag.trim() && !formData.featured_posts[postIndex].tags.includes(tag.trim())) {
            const updatedPosts = [...formData.featured_posts]
            updatedPosts[postIndex].tags.push(tag.trim())
            const updatedData = { ...formData, featured_posts: updatedPosts }
            handleChange(updatedData)
        }
    }

    const removeTagFromPost = (postIndex: number, tagIndex: number) => {
        const updatedPosts = [...formData.featured_posts]
        updatedPosts[postIndex].tags.splice(tagIndex, 1)
        const updatedData = { ...formData, featured_posts: updatedPosts }
        handleChange(updatedData)
    }

    const addCategory = () => {
        if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
            const updatedData = {
                ...formData,
                categories: [...formData.categories, newCategory.trim()]
            }
            handleChange(updatedData)
            setNewCategory('')
        }
    }

    const removeCategory = (index: number) => {
        const updatedCategories = formData.categories.filter((_, i) => i !== index)
        const updatedData = { ...formData, categories: updatedCategories }
        handleChange(updatedData)
    }

    const addRecentPost = () => {
        const newPost: RecentPost = {
            id: Date.now(),
            title: 'Noticia Reciente',
            date: new Date().toISOString().split('T')[0],
            category: 'General'
        }
        const updatedData = {
            ...formData,
            recent_posts: [...formData.recent_posts, newPost]
        }
        handleChange(updatedData)
        setEditingRecent(formData.recent_posts.length)
    }

    const updateRecentPost = (index: number, field: keyof RecentPost, value: any) => {
        const updatedPosts = [...formData.recent_posts]
        updatedPosts[index] = { ...updatedPosts[index], [field]: value }
        const updatedData = { ...formData, recent_posts: updatedPosts }
        handleChange(updatedData)
    }

    const deleteRecentPost = (index: number) => {
        const updatedPosts = formData.recent_posts.filter((_, i) => i !== index)
        const updatedData = { ...formData, recent_posts: updatedPosts }
        handleChange(updatedData)
        setEditingRecent(null)
    }

    return (
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Editor de Noticias</h3>
                <div className="flex gap-2">
                    <button
                        onClick={addRecentPost}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Noticia Reciente
                    </button>
                    <button
                        onClick={addFeaturedPost}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Artículo
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
                            placeholder="Noticias y Blog"
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
                            placeholder="Mantente al día con las últimas novedades del sector EdTech"
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
                            placeholder="Artículos, noticias y análisis sobre educación y tecnología."
                        />
                    </div>
                </div>
            </div>

            {/* Categorías */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                    {formData.categories.map((category, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {category}
                            <button
                                onClick={() => removeCategory(index)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Nueva categoría"
                    />
                    <button
                        onClick={addCategory}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Agregar
                    </button>
                </div>
            </div>

            {/* Artículos Destacados */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Artículos Destacados</h4>
                {formData.featured_posts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay artículos. Haz clic en "Artículo" para empezar.</p>
                    </div>
                ) : (
                    formData.featured_posts.map((post, index) => (
                        <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Artículo #{index + 1}
                                    </span>
                                    {post.is_featured && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            Destacado
                                        </span>
                                    )}
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {post.category}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingPost(editingPost === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingPost === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteFeaturedPost(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingPost === index ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Título
                                            </label>
                                            <input
                                                type="text"
                                                value={post.title}
                                                onChange={(e) => updateFeaturedPost(index, 'title', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Título del artículo"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Autor
                                            </label>
                                            <input
                                                type="text"
                                                value={post.author}
                                                onChange={(e) => updateFeaturedPost(index, 'author', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nombre del autor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha
                                            </label>
                                            <input
                                                type="date"
                                                value={post.date}
                                                onChange={(e) => updateFeaturedPost(index, 'date', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Categoría
                                            </label>
                                            <select
                                                value={post.category}
                                                onChange={(e) => updateFeaturedPost(index, 'category', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                {formData.categories.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            URL de Imagen
                                        </label>
                                        <input
                                            type="url"
                                            value={post.image}
                                            onChange={(e) => updateFeaturedPost(index, 'image', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Resumen
                                        </label>
                                        <textarea
                                            value={post.excerpt}
                                            onChange={(e) => updateFeaturedPost(index, 'excerpt', e.target.value)}
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Resumen del artículo..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contenido Completo
                                        </label>
                                        <textarea
                                            value={post.content}
                                            onChange={(e) => updateFeaturedPost(index, 'content', e.target.value)}
                                            rows={6}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Contenido completo del artículo..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {post.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                                                    {tag}
                                                    <button
                                                        onClick={() => removeTagFromPost(index, tagIndex)}
                                                        className="text-gray-600 hover:text-gray-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    addTagToPost(index, e.currentTarget.value)
                                                    e.currentTarget.value = ''
                                                }
                                            }}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Agregar tag (presiona Enter)"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={post.is_featured}
                                                onChange={(e) => updateFeaturedPost(index, 'is_featured', e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Artículo Destacado</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start gap-4">
                                        {post.image && (
                                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-900">{post.title}</h5>
                                            <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                <span>Por {post.author}</span>
                                                <span>•</span>
                                                <span>{post.date}</span>
                                                <span>•</span>
                                                <div className="flex gap-1">
                                                    {post.tags.map((tag, tagIndex) => (
                                                        <span key={tagIndex} className="bg-gray-100 px-1 rounded">#{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Noticias Recientes */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Noticias Recientes</h4>
                {formData.recent_posts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay noticias recientes. Haz clic en "Noticia Reciente" para empezar.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.recent_posts.map((post, index) => (
                            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-sm font-medium text-gray-500">Noticia #{index + 1}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingRecent(editingRecent === index ? null : index)}
                                            className="text-blue-600 hover:text-blue-700 text-xs"
                                        >
                                            {editingRecent === index ? 'Cerrar' : 'Editar'}
                                        </button>
                                        <button
                                            onClick={() => deleteRecentPost(index)}
                                            className="text-red-600 hover:text-red-700 text-xs"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                {editingRecent === index ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Título</label>
                                            <input
                                                type="text"
                                                value={post.title}
                                                onChange={(e) => updateRecentPost(index, 'title', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                placeholder="Título de la noticia"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                                            <input
                                                type="date"
                                                value={post.date}
                                                onChange={(e) => updateRecentPost(index, 'date', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
                                            <select
                                                value={post.category}
                                                onChange={(e) => updateRecentPost(index, 'category', e.target.value)}
                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                            >
                                                {formData.categories.map(category => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h5 className="font-medium text-gray-900 text-sm">{post.title}</h5>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span className="bg-blue-100 text-blue-800 px-1 rounded">{post.category}</span>
                                        </div>
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