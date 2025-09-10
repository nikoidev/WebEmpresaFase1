'use client'

import adminApi from '@/services/adminApi'
import type { Testimonial } from '@/types'
import {
    Building,
    Edit,
    Plus,
    Search,
    Star,
    Trash2,
    User
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function TestimonialsManagementPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
    const [formData, setFormData] = useState({
        client_name: '',
        client_position: '',
        client_company: '',
        testimonial_text: '',
        rating: 5,
        is_featured: false,
        is_active: true,
        image_url: ''
    })

    useEffect(() => {
        fetchTestimonials()
    }, [])

    const fetchTestimonials = async () => {
        try {
            const response = await adminApi.getTestimonials()
            setTestimonials(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching testimonials:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingTestimonial) {
                await adminApi.updateTestimonial(editingTestimonial.id, formData)
            } else {
                await adminApi.createTestimonial(formData)
            }

            setShowModal(false)
            setEditingTestimonial(null)
            resetForm()
            fetchTestimonials()
        } catch (error) {
            console.error('Error saving testimonial:', error)
        }
    }

    const resetForm = () => {
        setFormData({
            client_name: '',
            client_position: '',
            client_company: '',
            testimonial_text: '',
            rating: 5,
            is_featured: false,
            is_active: true,
            image_url: ''
        })
    }

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial)
        setFormData({
            client_name: testimonial.client_name,
            client_position: testimonial.client_position || '',
            client_company: testimonial.client_company || '',
            testimonial_text: testimonial.testimonial_text,
            rating: testimonial.rating,
            is_featured: testimonial.is_featured,
            is_active: testimonial.is_active,
            image_url: testimonial.image_url || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este testimonio?')) {
            try {
                await adminApi.deleteTestimonial(id)
                fetchTestimonials()
            } catch (error) {
                console.error('Error deleting testimonial:', error)
            }
        }
    }

    const filteredTestimonials = testimonials.filter(testimonial =>
        testimonial.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.testimonial_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.client_company?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                size={16}
                className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            />
        ))
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
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Testimonios</h1>
                    <p className="mt-2 text-gray-600">
                        Administra las reseñas y testimonios de clientes
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nuevo Testimonio
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar testimonios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                {testimonial.image_url ? (
                                    <img
                                        src={testimonial.image_url}
                                        alt={testimonial.client_name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User size={24} className="text-gray-500" />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{testimonial.client_name}</h3>
                                    {testimonial.client_position && (
                                        <p className="text-sm text-gray-600">{testimonial.client_position}</p>
                                    )}
                                    {testimonial.client_company && (
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Building size={12} />
                                            {testimonial.client_company}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {testimonial.is_featured && (
                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                        Destacado
                                    </span>
                                )}
                                <span className={`w-3 h-3 rounded-full ${testimonial.is_active ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                            {renderStars(testimonial.rating)}
                            <span className="text-sm text-gray-600 ml-2">({testimonial.rating}/5)</span>
                        </div>

                        <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                            "{testimonial.testimonial_text}"
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(testimonial)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2"
                            >
                                <Edit size={16} />
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(testimonial.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre del Cliente
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.client_name}
                                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cargo/Posición
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.client_position}
                                        onChange={(e) => setFormData({ ...formData, client_position: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Empresa
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.client_company}
                                        onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Calificación
                                    </label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={1}>1 estrella</option>
                                        <option value={2}>2 estrellas</option>
                                        <option value={3}>3 estrellas</option>
                                        <option value={4}>4 estrellas</option>
                                        <option value={5}>5 estrellas</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Testimonio
                                </label>
                                <textarea
                                    value={formData.testimonial_text}
                                    onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL de Imagen (opcional)
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
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Destacar
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="mr-2"
                                    />
                                    Activo
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setEditingTestimonial(null)
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
                                    {editingTestimonial ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
