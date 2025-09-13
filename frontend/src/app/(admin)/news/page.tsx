'use client'

import adminApi from '@/services/adminApi'
import type { NewsArticle } from '@/types'
import DevFileInfo from '@/components/DevFileInfo'
import AdminLayout from '@/components/layout/AdminLayout'
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
        featured_image: '',
        status: 'draft',
        featured: false
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
        
        // Validaciones básicas
        if (!formData.title.trim()) {
            alert('El título es requerido')
            return
        }
        if (!formData.content.trim()) {
            alert('El contenido es requerido')
            return
        }
        if (formData.title.length < 5) {
            alert('El título debe tener al menos 5 caracteres')
            return
        }
        
        try {
            const dataToSend = {
                ...formData,
                excerpt: formData.excerpt || formData.content.substring(0, 100),
                featured_image: formData.featured_image || null
            }
            
            if (editingNews) {
                await adminApi.updateNews(editingNews.id, dataToSend)
            } else {
                await adminApi.createNews(dataToSend)
            }

            setShowModal(false)
            setEditingNews(null)
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                featured_image: '',
                status: 'draft',
                featured: false
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
            featured_image: newsItem.featured_image || '',
            status: newsItem.status || 'draft',
            featured: newsItem.featured || false
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
        <AdminLayout>
            <div className="h-full space-y-8">
                <DevFileInfo filePath="frontend/src/app/admin/news/page.tsx" />
            
            {/* Header */}
            <div>
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
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
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
            </div>

            {/* News List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Edit className="h-5 w-5 mr-2" />
                        Lista de Noticias ({filteredNews.length})
                    </h3>
                </div>
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
                        {filteredNews.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <Search className="h-12 w-12 text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No hay noticias
                                        </h3>
                                        <p className="text-gray-500 mb-4">
                                            {searchTerm ? 'No se encontraron noticias que coincidan con tu búsqueda.' : 'Comienza creando tu primera noticia.'}
                                        </p>
                                        {!searchTerm && (
                                            <button
                                                onClick={() => setShowModal(true)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                            >
                                                <Plus size={16} />
                                                Crear Primera Noticia
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredNews.map((newsItem) => (
                            <tr key={newsItem.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {newsItem.featured_image && (
                                            <img
                                                className="h-10 w-10 rounded-lg object-cover mr-4"
                                                src={newsItem.featured_image}
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
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${newsItem.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {newsItem.status === 'published' ? 'Publicado' : 'Borrador'}
                                        </span>
                                        {newsItem.featured && (
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
                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Editar noticia"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(newsItem.id)}
                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                                            title="Eliminar noticia"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
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
                                    URL de Imagen Destacada
                                </label>
                                <input
                                    type="url"
                                    value={formData.featured_image}
                                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">Borrador</option>
                                        <option value="published">Publicado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="flex items-center mt-8">
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="mr-2"
                                        />
                                        Artículo Destacado
                                    </label>
                                </div>
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
                                            featured_image: '',
                                            status: 'draft',
                                            featured: false
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
        </AdminLayout>
    )
}
