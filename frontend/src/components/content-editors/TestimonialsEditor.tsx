'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Star, User, Building, Eye, EyeOff } from 'lucide-react'

interface Testimonial {
    id?: number
    client_name: string
    client_position?: string
    client_company?: string
    content: string
    rating: number
    image_url?: string
    is_featured: boolean
    is_active: boolean
    date: string
}

interface TestimonialsData {
    testimonials: Testimonial[]
}

interface TestimonialsEditorProps {
    data: TestimonialsData
    onChange: (data: TestimonialsData) => void
}

export default function TestimonialsEditor({ data, onChange }: TestimonialsEditorProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(data.testimonials || [])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    useEffect(() => {
        onChange({ testimonials })
    }, [testimonials, onChange])

    const addTestimonial = () => {
        const newTestimonial: Testimonial = {
            client_name: '',
            content: '',
            rating: 5,
            is_featured: false,
            is_active: true,
            date: new Date().toISOString().split('T')[0]
        }
        setTestimonials([...testimonials, newTestimonial])
        setEditingIndex(testimonials.length)
    }

    const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
        const updatedTestimonials = [...testimonials]
        updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value }
        setTestimonials(updatedTestimonials)
    }

    const deleteTestimonial = (index: number) => {
        const updatedTestimonials = testimonials.filter((_, i) => i !== index)
        setTestimonials(updatedTestimonials)
        setEditingIndex(null)
    }

    const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${
                            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        } ${interactive ? 'cursor-pointer hover:text-yellow-500' : ''}`}
                        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de Testimonios</h3>
                <button
                    onClick={addTestimonial}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Testimonio
                </button>
            </div>

            {testimonials.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No hay testimonios. Haz clic en "Agregar Testimonio" para empezar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Testimonio #{index + 1}
                                    </span>
                                    {testimonial.is_featured && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                            Destacado
                                        </span>
                                    )}
                                    {!testimonial.is_active && (
                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                            Inactivo
                                        </span>
                                    )}
                                    <div className="ml-2">
                                        {renderStars(testimonial.rating)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingIndex === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteTestimonial(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingIndex === index ? (
                                <div className="space-y-4">
                                    {/* Información del Cliente */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <User className="inline h-4 w-4 mr-1" />
                                                Nombre del Cliente *
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.client_name}
                                                onChange={(e) => updateTestimonial(index, 'client_name', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nombre completo"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cargo/Posición
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.client_position || ''}
                                                onChange={(e) => updateTestimonial(index, 'client_position', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="CEO, Director, etc."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Building className="inline h-4 w-4 mr-1" />
                                                Empresa
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.client_company || ''}
                                                onChange={(e) => updateTestimonial(index, 'client_company', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nombre de la empresa"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                URL de Foto
                                            </label>
                                            <input
                                                type="url"
                                                value={testimonial.image_url || ''}
                                                onChange={(e) => updateTestimonial(index, 'image_url', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://ejemplo.com/foto.jpg"
                                            />
                                        </div>
                                    </div>

                                    {/* Testimonio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Testimonio *
                                        </label>
                                        <textarea
                                            value={testimonial.content}
                                            onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Escribe aquí el testimonio del cliente..."
                                        />
                                    </div>

                                    {/* Calificación */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Calificación
                                        </label>
                                        {renderStars(
                                            testimonial.rating, 
                                            true, 
                                            (rating) => updateTestimonial(index, 'rating', rating)
                                        )}
                                    </div>

                                    {/* Fecha */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fecha
                                            </label>
                                            <input
                                                type="date"
                                                value={testimonial.date}
                                                onChange={(e) => updateTestimonial(index, 'date', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Opciones */}
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={testimonial.is_featured}
                                                onChange={(e) => updateTestimonial(index, 'is_featured', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Testimonio destacado</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={testimonial.is_active}
                                                onChange={(e) => updateTestimonial(index, 'is_active', e.target.checked)}
                                                className="rounded"
                                            />
                                            <span className="text-sm text-gray-700">Testimonio activo</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start gap-3">
                                        {testimonial.image_url && (
                                            <img
                                                src={testimonial.image_url}
                                                alt={testimonial.client_name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {testimonial.client_name || 'Sin nombre'}
                                            </h4>
                                            {testimonial.client_position && (
                                                <p className="text-sm text-gray-600">
                                                    {testimonial.client_position}
                                                    {testimonial.client_company && ` en ${testimonial.client_company}`}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-700 mt-2">
                                                {testimonial.content || 'Sin contenido'}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span>{testimonial.date}</span>
                                                <span className="flex items-center gap-1">
                                                    {testimonial.is_active ? (
                                                        <><Eye className="h-3 w-3" /> Visible</>
                                                    ) : (
                                                        <><EyeOff className="h-3 w-3" /> Oculto</>
                                                    )}
                                                </span>
                                            </div>
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
