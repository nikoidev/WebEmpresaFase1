'use client'

import React, { useState, useEffect } from 'react'
import { Plus, ChevronDown, ChevronRight, HelpCircle, Eye, EyeOff } from 'lucide-react'

interface FAQ {
    id?: number
    question: string
    answer: string
    category: string
    order: number
    is_active: boolean
}

interface FAQsData {
    faqs: FAQ[]
    categories: string[]
}

interface FAQsEditorProps {
    data: FAQsData
    onChange: (data: FAQsData) => void
}

export default function FAQsEditor({ data, onChange }: FAQsEditorProps) {
    const [faqs, setFaqs] = useState<FAQ[]>(data.faqs || [])
    const [categories, setCategories] = useState<string[]>(data.categories || ['General', 'Servicios', 'Precios', 'Soporte'])
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
    const [newCategory, setNewCategory] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todas')

    useEffect(() => {
        onChange({ faqs, categories })
    }, [faqs, categories, onChange])

    const addFAQ = () => {
        const newFAQ: FAQ = {
            question: '',
            answer: '',
            category: 'General',
            order: faqs.length + 1,
            is_active: true
        }
        setFaqs([...faqs, newFAQ])
        setEditingIndex(faqs.length)
    }

    const updateFAQ = (index: number, field: keyof FAQ, value: any) => {
        const updatedFaqs = [...faqs]
        updatedFaqs[index] = { ...updatedFaqs[index], [field]: value }
        setFaqs(updatedFaqs)
    }

    const deleteFAQ = (index: number) => {
        const updatedFaqs = faqs.filter((_, i) => i !== index)
        setFaqs(updatedFaqs)
        setEditingIndex(null)
    }

    const addCategory = () => {
        if (!newCategory.trim() || categories.includes(newCategory.trim())) return
        setCategories([...categories, newCategory.trim()])
        setNewCategory('')
    }

    const deleteCategory = (categoryToDelete: string) => {
        if (categoryToDelete === 'General') return // No permitir eliminar la categoría General
        setCategories(categories.filter(cat => cat !== categoryToDelete))
        // Reasignar FAQs de esa categoría a 'General'
        const updatedFaqs = faqs.map(faq => 
            faq.category === categoryToDelete ? { ...faq, category: 'General' } : faq
        )
        setFaqs(updatedFaqs)
    }

    const moveFAQ = (index: number, direction: 'up' | 'down') => {
        const newFaqs = [...faqs]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        
        if (targetIndex < 0 || targetIndex >= faqs.length) return
        
        // Intercambiar elementos
        [newFaqs[index], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[index]]
        
        // Actualizar órdenes
        newFaqs[index].order = index + 1
        newFaqs[targetIndex].order = targetIndex + 1
        
        setFaqs(newFaqs)
        setEditingIndex(targetIndex)
    }

    const filteredFaqs = selectedCategory === 'Todas' 
        ? faqs 
        : faqs.filter(faq => faq.category === selectedCategory)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestión de FAQs</h3>
                <button
                    onClick={addFAQ}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar FAQ
                </button>
            </div>

            {/* Gestión de Categorías */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Categorías</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                    {categories.map((category) => (
                        <span
                            key={category}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                            {category}
                            {category !== 'General' && (
                                <button
                                    onClick={() => deleteCategory(category)}
                                    className="text-blue-600 hover:text-blue-800 ml-1"
                                >
                                    ×
                                </button>
                            )}
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
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                        Agregar
                    </button>
                </div>
            </div>

            {/* Filtro por Categoría */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Filtrar por categoría:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2"
                >
                    <option value="Todas">Todas las categorías</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                        {selectedCategory === 'Todas' 
                            ? 'No hay FAQs. Haz clic en "Agregar FAQ" para empezar.'
                            : `No hay FAQs en la categoría "${selectedCategory}".`
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => {
                        const originalIndex = faqs.findIndex(f => f === faq)
                        return (
                            <div key={originalIndex} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-500">
                                            FAQ #{originalIndex + 1}
                                        </span>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {faq.category}
                                        </span>
                                        {!faq.is_active && (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                                Inactivo
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {originalIndex > 0 && (
                                            <button
                                                onClick={() => moveFAQ(originalIndex, 'up')}
                                                className="text-gray-600 hover:text-gray-700 text-sm"
                                            >
                                                ↑
                                            </button>
                                        )}
                                        {originalIndex < faqs.length - 1 && (
                                            <button
                                                onClick={() => moveFAQ(originalIndex, 'down')}
                                                className="text-gray-600 hover:text-gray-700 text-sm"
                                            >
                                                ↓
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setEditingIndex(editingIndex === originalIndex ? null : originalIndex)}
                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            {editingIndex === originalIndex ? 'Cerrar' : 'Editar'}
                                        </button>
                                        <button
                                            onClick={() => deleteFAQ(originalIndex)}
                                            className="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>

                                {editingIndex === originalIndex ? (
                                    <div className="space-y-4">
                                        {/* Pregunta */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Pregunta *
                                            </label>
                                            <input
                                                type="text"
                                                value={faq.question}
                                                onChange={(e) => updateFAQ(originalIndex, 'question', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="¿Cuál es tu pregunta?"
                                            />
                                        </div>

                                        {/* Respuesta */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Respuesta *
                                            </label>
                                            <textarea
                                                value={faq.answer}
                                                onChange={(e) => updateFAQ(originalIndex, 'answer', e.target.value)}
                                                rows={5}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                placeholder="Escribe aquí la respuesta detallada..."
                                            />
                                        </div>

                                        {/* Categoría y Orden */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Categoría
                                                </label>
                                                <select
                                                    value={faq.category}
                                                    onChange={(e) => updateFAQ(originalIndex, 'category', e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                >
                                                    {categories.map((category) => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Orden
                                                </label>
                                                <input
                                                    type="number"
                                                    value={faq.order}
                                                    onChange={(e) => updateFAQ(originalIndex, 'order', parseInt(e.target.value))}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        {/* Opciones */}
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={faq.is_active}
                                                    onChange={(e) => updateFAQ(originalIndex, 'is_active', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span className="text-sm text-gray-700">FAQ activo</span>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            onClick={() => setExpandedIndex(expandedIndex === originalIndex ? null : originalIndex)}
                                            className="flex items-center gap-2 w-full text-left"
                                        >
                                            {expandedIndex === originalIndex ? (
                                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-gray-500" />
                                            )}
                                            <h4 className="font-medium text-gray-900">
                                                {faq.question || 'Sin pregunta'}
                                            </h4>
                                        </button>
                                        
                                        {expandedIndex === originalIndex && (
                                            <div className="mt-3 pl-6">
                                                <p className="text-gray-700">
                                                    {faq.answer || 'Sin respuesta'}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span>Orden: {faq.order}</span>
                                                    <span className="flex items-center gap-1">
                                                        {faq.is_active ? (
                                                            <><Eye className="h-3 w-3" /> Visible</>
                                                        ) : (
                                                            <><EyeOff className="h-3 w-3" /> Oculto</>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
