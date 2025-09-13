'use client'

import adminApi from '@/services/adminApi'
import type { FAQ } from '@/types'
import {
    ChevronDown,
    ChevronUp,
    Edit,
    Eye,
    EyeOff,
    HelpCircle,
    Plus,
    Search,
    ThumbsUp,
    Trash2
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function FAQsManagementPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: '',
        is_active: true,
        order: 0
    })

    useEffect(() => {
        fetchFAQs()
    }, [])

    const fetchFAQs = async () => {
        try {
            const response = await adminApi.getFAQs()
            setFaqs(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching FAQs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const faqData = {
                ...formData,
                order: parseInt(formData.order.toString()) || 0
            }

            if (editingFAQ) {
                await adminApi.updateFAQ(editingFAQ.id, faqData)
            } else {
                await adminApi.createFAQ(faqData)
            }

            setShowModal(false)
            setEditingFAQ(null)
            resetForm()
            fetchFAQs()
        } catch (error) {
            console.error('Error saving FAQ:', error)
        }
    }

    const resetForm = () => {
        setFormData({
            question: '',
            answer: '',
            category: '',
            is_active: true,
            order: 0
        })
    }

    const handleEdit = (faq: FAQ) => {
        setEditingFAQ(faq)
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category: faq.category || '',
            is_active: faq.is_active,
            order: faq.order || 0
        })
        setShowModal(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta FAQ?')) {
            try {
                await adminApi.deleteFAQ(id)
                fetchFAQs()
            } catch (error) {
                console.error('Error deleting FAQ:', error)
            }
        }
    }

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => (a.order || 0) - (b.order || 0))

    // Get unique categories
    const categories = Array.from(new Set(faqs.map(faq => faq.category).filter(Boolean)))

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
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de FAQs</h1>
                    <p className="mt-2 text-gray-600">
                        Administra las preguntas frecuentes de tu sitio web
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nueva FAQ
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <HelpCircle className="text-blue-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Total FAQs</p>
                            <p className="text-xl font-bold">{faqs.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <Eye className="text-green-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Activas</p>
                            <p className="text-xl font-bold">{faqs.filter(f => f.is_active).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <EyeOff className="text-red-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Inactivas</p>
                            <p className="text-xl font-bold">{faqs.filter(f => !f.is_active).length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <ThumbsUp className="text-yellow-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Votos Útiles</p>
                            <p className="text-xl font-bold">{faqs.reduce((acc, faq) => acc + (faq.helpful_votes || 0), 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs List */}
            <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg shadow">
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {expandedFAQ === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {faq.question}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                        {faq.category && (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                {faq.category}
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 rounded-full ${faq.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {faq.is_active ? 'Activa' : 'Inactiva'}
                                        </span>
                                        <span>Orden: {faq.order || 0}</span>
                                        {faq.helpful_votes !== undefined && (
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp size={14} />
                                                {faq.helpful_votes} útiles
                                            </span>
                                        )}
                                    </div>

                                    {expandedFAQ === faq.id && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-gray-700">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(faq)}
                                        className="text-blue-600 hover:text-blue-900 p-2"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="text-red-600 hover:text-red-900 p-2"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingFAQ ? 'Editar FAQ' : 'Nueva FAQ'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pregunta
                                </label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Respuesta
                                </label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoría
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        list="categories"
                                    />
                                    <datalist id="categories">
                                        {categories.map((category, index) => (
                                            <option key={index} value={category} />
                                        ))}
                                    </datalist>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Orden de Visualización
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Activa
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingFAQ(null)
                                        resetForm()
                                    }}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingFAQ ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
