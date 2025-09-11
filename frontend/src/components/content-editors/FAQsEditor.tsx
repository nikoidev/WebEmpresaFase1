'use client'

import React, { useState } from 'react'
import { Plus, HelpCircle, X } from 'lucide-react'

interface FAQ {
    question: string
    answer: string
    tags: string[]
}

interface FAQCategory {
    name: string
    icon: string
    faqs: FAQ[]
}

interface FAQsContent {
    hero: {
        title: string
        subtitle: string
        description: string
    }
    categories: FAQCategory[]
}

interface FAQsEditorProps {
    data: FAQsContent
    onChange: (data: FAQsContent) => void
}

export default function FAQsEditor({ data, onChange }: FAQsEditorProps) {
    const [formData, setFormData] = useState<FAQsContent>(data)
    const [editingCategory, setEditingCategory] = useState<number | null>(null)
    const [editingFAQ, setEditingFAQ] = useState<{ categoryIndex: number; faqIndex: number } | null>(null)

    const handleChange = (newData: FAQsContent) => {
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

    const addCategory = () => {
        const newCategory: FAQCategory = {
            name: 'Nueva Categoría',
            icon: '❓',
            faqs: []
        }
        const updatedData = {
            ...formData,
            categories: [...formData.categories, newCategory]
        }
        handleChange(updatedData)
        setEditingCategory(formData.categories.length)
    }

    const updateCategory = (index: number, field: keyof FAQCategory, value: any) => {
        const updatedCategories = [...formData.categories]
        updatedCategories[index] = { ...updatedCategories[index], [field]: value }
        const updatedData = { ...formData, categories: updatedCategories }
        handleChange(updatedData)
    }

    const deleteCategory = (index: number) => {
        const updatedCategories = formData.categories.filter((_, i) => i !== index)
        const updatedData = { ...formData, categories: updatedCategories }
        handleChange(updatedData)
        setEditingCategory(null)
    }

    const addFAQ = (categoryIndex: number) => {
        const newFAQ: FAQ = {
            question: '¿Nueva pregunta?',
            answer: 'Nueva respuesta...',
            tags: ['general']
        }
        const updatedCategories = [...formData.categories]
        updatedCategories[categoryIndex].faqs.push(newFAQ)
        const updatedData = { ...formData, categories: updatedCategories }
        handleChange(updatedData)
        setEditingFAQ({ categoryIndex, faqIndex: updatedCategories[categoryIndex].faqs.length - 1 })
    }

    const updateFAQ = (categoryIndex: number, faqIndex: number, field: keyof FAQ, value: any) => {
        const updatedCategories = [...formData.categories]
        updatedCategories[categoryIndex].faqs[faqIndex] = {
            ...updatedCategories[categoryIndex].faqs[faqIndex],
            [field]: value
        }
        const updatedData = { ...formData, categories: updatedCategories }
        handleChange(updatedData)
    }

    const deleteFAQ = (categoryIndex: number, faqIndex: number) => {
        const updatedCategories = [...formData.categories]
        updatedCategories[categoryIndex].faqs.splice(faqIndex, 1)
        const updatedData = { ...formData, categories: updatedCategories }
        handleChange(updatedData)
        setEditingFAQ(null)
    }

    const addTagToFAQ = (categoryIndex: number, faqIndex: number, tag: string) => {
        if (tag.trim() && !formData.categories[categoryIndex].faqs[faqIndex].tags.includes(tag.trim())) {
            const updatedCategories = [...formData.categories]
            updatedCategories[categoryIndex].faqs[faqIndex].tags.push(tag.trim())
            const updatedData = { ...formData, categories: updatedCategories }
            handleChange(updatedData)
        }
    }

    const removeTagFromFAQ = (categoryIndex: number, faqIndex: number, tagIndex: number) => {
        const updatedCategories = [...formData.categories]
        updatedCategories[categoryIndex].faqs[faqIndex].tags.splice(tagIndex, 1)
        const updatedData = { ...formData, categories: updatedCategories }
        handleChange(updatedData)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Editor de FAQs</h3>
                <button
                    onClick={addCategory}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Categoría
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
                            placeholder="Preguntas Frecuentes"
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
                            placeholder="Encuentra respuestas a las dudas más comunes"
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
                            placeholder="Resolvemos tus preguntas sobre nuestra plataforma..."
                        />
                    </div>
                </div>
            </div>

            {/* Categorías */}
            <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Categorías de FAQs</h4>
                {formData.categories.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay categorías. Haz clic en "Agregar Categoría" para empezar.</p>
                    </div>
                ) : (
                    formData.categories.map((category, categoryIndex) => (
                        <div key={`category-${categoryIndex}`} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{category.icon}</span>
                                    <span className="text-sm font-medium text-gray-500">
                                        Categoría #{categoryIndex + 1}: {category.name}
                                    </span>
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {category.faqs.length} FAQs
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => addFAQ(categoryIndex)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                    >
                                        + FAQ
                                    </button>
                                    <button
                                        onClick={() => setEditingCategory(editingCategory === categoryIndex ? null : categoryIndex)}
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        {editingCategory === categoryIndex ? 'Cerrar' : 'Editar'}
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(categoryIndex)}
                                        className="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            {editingCategory === categoryIndex && (
                                <div className="mb-4 p-3 bg-gray-50 rounded">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nombre de Categoría
                                            </label>
                                            <input
                                                type="text"
                                                value={category.name}
                                                onChange={(e) => updateCategory(categoryIndex, 'name', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="General"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Icono (emoji)
                                            </label>
                                            <input
                                                type="text"
                                                value={category.icon}
                                                onChange={(e) => updateCategory(categoryIndex, 'icon', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="❓"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FAQs de la categoría */}
                            <div className="space-y-3">
                                {category.faqs.length === 0 ? (
                                    <div className="text-center py-4 bg-gray-50 rounded">
                                        <p className="text-gray-500 text-sm">No hay FAQs en esta categoría.</p>
                                    </div>
                                ) : (
                                    category.faqs.map((faq, faqIndex) => (
                                        <div key={`faq-${categoryIndex}-${faqIndex}`} className="border border-gray-100 rounded p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-medium text-gray-500">
                                                    FAQ #{faqIndex + 1}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingFAQ(
                                                            editingFAQ?.categoryIndex === categoryIndex && editingFAQ?.faqIndex === faqIndex
                                                                ? null
                                                                : { categoryIndex, faqIndex }
                                                        )}
                                                        className="text-blue-600 hover:text-blue-700 text-xs"
                                                    >
                                                        {editingFAQ?.categoryIndex === categoryIndex && editingFAQ?.faqIndex === faqIndex ? 'Cerrar' : 'Editar'}
                                                    </button>
                                                    <button
                                                        onClick={() => deleteFAQ(categoryIndex, faqIndex)}
                                                        className="text-red-600 hover:text-red-700 text-xs"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>

                                            {editingFAQ?.categoryIndex === categoryIndex && editingFAQ?.faqIndex === faqIndex ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Pregunta
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={faq.question}
                                                            onChange={(e) => updateFAQ(categoryIndex, faqIndex, 'question', e.target.value)}
                                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                            placeholder="¿Pregunta frecuente?"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Respuesta
                                                        </label>
                                                        <textarea
                                                            value={faq.answer}
                                                            onChange={(e) => updateFAQ(categoryIndex, faqIndex, 'answer', e.target.value)}
                                                            rows={3}
                                                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                                            placeholder="Respuesta detallada..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Tags
                                                        </label>
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {faq.tags.map((tag, tagIndex) => (
                                                                <span key={`tag-${categoryIndex}-${faqIndex}-${tagIndex}`} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                                                                    {tag}
                                                                    <button
                                                                        onClick={() => removeTagFromFAQ(categoryIndex, faqIndex, tagIndex)}
                                                                        className="text-gray-600 hover:text-gray-800"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    addTagToFAQ(categoryIndex, faqIndex, e.currentTarget.value)
                                                                    e.currentTarget.value = ''
                                                                }
                                                            }}
                                                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                                            placeholder="Agregar tag (presiona Enter)"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h5 className="font-medium text-gray-900 text-sm mb-1">{faq.question}</h5>
                                                    <p className="text-xs text-gray-600 mb-2">{faq.answer}</p>
                                                    <div className="flex gap-1">
                                                        {faq.tags.map((tag, tagIndex) => (
                                                            <span key={`display-tag-${categoryIndex}-${faqIndex}-${tagIndex}`} className="bg-blue-100 text-blue-800 px-1 rounded text-xs">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}