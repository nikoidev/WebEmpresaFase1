'use client'

import adminApi from '@/services/adminApi'
import type { NewsArticle } from '@/types'
import {
    Calendar,
    Edit,
    Plus,
    Search,
    Trash2
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NewsManagementPage() {
    const [news, setNews] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingNews, setEditingNews] = useState<NewsArticle | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        is_published: false,
        is_featured: false
    })

    useEffect(() => {
        fetchNews()
    }, [])

    const fetchNews = async () => {
        try {
            const response = await adminApi.getNews()
            setNews(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching news:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingNews) {
                await adminApi.updateNews(editingNews.id, formData)
            } else {
                await adminApi.createNews(formData)
            }

            setShowModal(false)
            setEditingNews(null)
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                image_url: '',
                is_published: false,
                is_featured: false
            })
            fetchNews()
        } catch (error) {
            console.error('Error saving news:', error)
        }
    }

    const handleEdit = (newsItem: NewsArticle) => {
        setEditingNews(newsItem)
        setFormData({
            title: newsItem.title,
            content: newsItem.content,
            excerpt: newsItem.excerpt || '',
            image_url: newsItem.image_url || '',
            is_published: newsItem.is_published,
            is_featured: newsItem.is_featured
        })
        setShowModal(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
            try {
                await adminApi.deleteNews(id)
                fetchNews()
            } catch (error) {
                console.error('Error deleting news:', error)
            }
        }
    }

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    )

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
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Noticias</h1>
                    <p className="mt-2 text-gray-600">
                        Administra las noticias y artículos de tu sitio web
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nueva Noticia
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar noticias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* News List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Título
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredNews.map((newsItem) => (
                            <tr key={newsItem.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {newsItem.image_url && (
                                            <img
                                                className="h-10 w-10 rounded-lg object-cover mr-4"
                                                src={newsItem.image_url}
                                                alt=""
                                            />
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {newsItem.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {newsItem.excerpt?.substring(0, 60)}...
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${newsItem.is_published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {newsItem.is_published ? 'Publicado' : 'Borrador'}
                                        </span>
                                        {newsItem.is_featured && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Destacado
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        {new Date(newsItem.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(newsItem)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(newsItem.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingNews ? 'Editar Noticia' : 'Nueva Noticia'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Resumen
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenido
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={6}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL de Imagen
                                </label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_published}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Publicar
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Destacar
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingNews(null)
                                        setFormData({
                                            title: '',
                                            content: '',
                                            excerpt: '',
                                            image_url: '',
                                            is_published: false,
                                            is_featured: false
                                        })
                                    }}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingNews ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
