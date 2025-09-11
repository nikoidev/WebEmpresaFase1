'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Star, Video, TrendingUp } from 'lucide-react'

interface ImpactMetric {
    engagement_increase?: string
    satisfaction_score?: string
    time_saved?: string
    response_time?: string
    resolution_rate?: string
    grade_improvement?: string
    retention_rate?: string
}

interface FeaturedTestimonial {
    id: number
    quote: string
    author: string
    position: string
    institution: string
    country: string
    image: string
    rating: number
    date: string
    is_featured: boolean
    video_url: string
    impact_metrics: ImpactMetric
}

interface Stat {
    number: string
    label: string
    description: string
}

interface TestimonialsContent {
    hero: {
        title: string
        subtitle: string
        description: string
    }
    featured_testimonials: FeaturedTestimonial[]
    stats: Stat[]
}

interface TestimonialsEditorProps {
    data: TestimonialsContent
    onChange: (data: TestimonialsContent) => void
}

export default function TestimonialsEditor({ data, onChange }: TestimonialsEditorProps) {
    const [formData, setFormData] = useState<TestimonialsContent>(data)

    // Sincronizar estado local con props cuando cambian los datos
    useEffect(() => {
        setFormData(data)
    }, [data])
    const [editingTestimonial, setEditingTestimonial] = useState<number | null>(null)

    const handleChange = (newData: TestimonialsContent) => {
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

    const addTestimonial = () => {
        const newTestimonial: FeaturedTestimonial = {
            id: Date.now(),
            quote: 'Excelente plataforma que ha transformado nuestra institución.',
            author: 'Nuevo Cliente',
            position: 'Director',
            institution: 'Institución Educativa',
            country: 'México',
            image: '',
            rating: 5,
            date: new Date().toISOString().split('T')[0],
            is_featured: false,
            video_url: '',
            impact_metrics: {
                satisfaction_score: '9.5/10',
                engagement_increase: '50%',
                time_saved: '30%'
            }
        }
        const updatedData = {
            ...formData,
            featured_testimonials: [...formData.featured_testimonials, newTestimonial]
        }
        handleChange(updatedData)
        setEditingTestimonial(formData.featured_testimonials.length)
    }

    const updateTestimonial = (index: number, field: keyof FeaturedTestimonial, value: any) => {
        const updatedTestimonials = [...formData.featured_testimonials]
        updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value }
        const updatedData = { ...formData, featured_testimonials: updatedTestimonials }
        handleChange(updatedData)
    }

    const updateImpactMetric = (testimonialIndex: number, metric: keyof ImpactMetric, value: string) => {
        const updatedTestimonials = [...formData.featured_testimonials]
        updatedTestimonials[testimonialIndex].impact_metrics = {
            ...updatedTestimonials[testimonialIndex].impact_metrics,
            [metric]: value
        }
        const updatedData = { ...formData, featured_testimonials: updatedTestimonials }
        handleChange(updatedData)
    }

    const deleteTestimonial = (index: number) => {
        const updatedTestimonials = formData.featured_testimonials.filter((_, i) => i !== index)
        const updatedData = { ...formData, featured_testimonials: updatedTestimonials }
        handleChange(updatedData)
        setEditingTestimonial(null)
    }

    const updateStat = (index: number, field: keyof Stat, value: string) => {
        const updatedStats = [...formData.stats]
        updatedStats[index] = { ...updatedStats[index], [field]: value }
        const updatedData = { ...formData, stats: updatedStats }
        handleChange(updatedData)
    }

    return (
        <div className="space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Editor de Testimonios</h3>
                <button
                    onClick={addTestimonial}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Testimonio
                </button>
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
                            placeholder="Lo que Dicen Nuestros Clientes"
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
                            placeholder="Historias reales de transformación educativa"
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
                            placeholder="Descubre cómo SEVP ha ayudado a instituciones..."
                        />
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Estadísticas de Satisfacción</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.stats.map((stat, index) => (
                        <div key={index} className="border border-gray-200 p-3 rounded-md">
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Número</label>
                                    <input
                                        type="text"
                                        value={stat.number}
                                        onChange={(e) => updateStat(index, 'number', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        placeholder="98%"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Etiqueta</label>
                                    <input
                                        type="text"
                                        value={stat.label}
                                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        placeholder="Satisfacción del Cliente"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Descripción</label>
                                    <input
                                        type="text"
                                        value={stat.description}
                                        onChange={(e) => updateStat(index, 'description', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        placeholder="De nuestros clientes recomendarían SEVP"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonios */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Testimonios Destacados</h4>
                {formData.featured_testimonials.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay testimonios. Haz clic en "Agregar Testimonio" para empezar.</p>
                    </div>
                ) : (
                    formData.featured_testimonials.map((testimonial, index) => (
                        <div key={testimonial.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-500">
                                        Testimonio #{index + 1}
                                    </span>
                                    {testimonial.is_featured && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            Destacado
                                        </span>
                                    )}
                                    <div className="flex">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingTestimonial(editingTestimonial === index ? null : index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingTestimonial === index ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteTestimonial(index)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingTestimonial === index ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Autor
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.author}
                                                onChange={(e) => updateTestimonial(index, 'author', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Nombre del cliente"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cargo
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.position}
                                                onChange={(e) => updateTestimonial(index, 'position', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Director, CEO, etc."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Institución
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.institution}
                                                onChange={(e) => updateTestimonial(index, 'institution', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Universidad Nacional"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                País
                                            </label>
                                            <input
                                                type="text"
                                                value={testimonial.country}
                                                onChange={(e) => updateTestimonial(index, 'country', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="México"
                                            />
                                        </div>
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
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Calificación (1-5)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={testimonial.rating}
                                                onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value) || 5)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                URL de Imagen
                                            </label>
                                            <input
                                                type="url"
                                                value={testimonial.image}
                                                onChange={(e) => updateTestimonial(index, 'image', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://ejemplo.com/foto.jpg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                URL de Video
                                            </label>
                                            <input
                                                type="url"
                                                value={testimonial.video_url}
                                                onChange={(e) => updateTestimonial(index, 'video_url', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="https://youtube.com/watch?v=..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Testimonio
                                        </label>
                                        <textarea
                                            value={testimonial.quote}
                                            onChange={(e) => updateTestimonial(index, 'quote', e.target.value)}
                                            rows={4}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="El testimonio del cliente..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            <TrendingUp className="inline h-4 w-4 mr-1" />
                                            Métricas de Impacto
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Aumento Engagement</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.impact_metrics.engagement_increase || ''}
                                                    onChange={(e) => updateImpactMetric(index, 'engagement_increase', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                    placeholder="65%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Puntuación Satisfacción</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.impact_metrics.satisfaction_score || ''}
                                                    onChange={(e) => updateImpactMetric(index, 'satisfaction_score', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                    placeholder="9.2/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Tiempo Ahorrado</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.impact_metrics.time_saved || ''}
                                                    onChange={(e) => updateImpactMetric(index, 'time_saved', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                    placeholder="40%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Tiempo Respuesta</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.impact_metrics.response_time || ''}
                                                    onChange={(e) => updateImpactMetric(index, 'response_time', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                    placeholder="< 2 horas"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Tasa Resolución</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.impact_metrics.resolution_rate || ''}
                                                    onChange={(e) => updateImpactMetric(index, 'resolution_rate', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                    placeholder="99%"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Mejora Calificaciones</label>
                                                <input
                                                    type="text"
                                                    value={testimonial.impact_metrics.grade_improvement || ''}
                                                    onChange={(e) => updateImpactMetric(index, 'grade_improvement', e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                    placeholder="25%"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={testimonial.is_featured}
                                                onChange={(e) => updateTestimonial(index, 'is_featured', e.target.checked)}
                                                className="mr-2"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Testimonio Destacado</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-start gap-4">
                                        {testimonial.image && (
                                            <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                                                <img
                                                    src={testimonial.image}
                                                    alt={testimonial.author}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <blockquote className="text-gray-700 italic mb-3">
                                                "{testimonial.quote}"
                                            </blockquote>
                                            <div className="text-sm text-gray-600">
                                                <strong>{testimonial.author}</strong>, {testimonial.position}
                                                <br />
                                                {testimonial.institution}, {testimonial.country}
                                                <br />
                                                <span className="text-xs text-gray-500">{testimonial.date}</span>
                                                {testimonial.video_url && (
                                                    <span className="ml-2 text-blue-600">
                                                        <Video className="inline h-3 w-3 mr-1" />
                                                        Video disponible
                                                    </span>
                                                )}
                                            </div>
                                            {Object.keys(testimonial.impact_metrics).length > 0 && (
                                                <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                                                    <strong>Impacto:</strong>
                                                    {Object.entries(testimonial.impact_metrics).map(([key, value]) => value && (
                                                        <span key={key} className="ml-2 text-green-700">
                                                            {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}