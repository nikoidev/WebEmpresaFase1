'use client'

import React, { useState } from 'react'
import { Plus, Star, Building, Users, Globe, X } from 'lucide-react'

interface ClientTestimonial {
    quote: string
    author: string
    position: string
    institution: string
    country: string
    logo: string
    rating: number
}

interface Client {
    name: string
    logo: string
    country: string
    students: string
    since: string
}

interface Stat {
    number: string
    label: string
    icon: string
}

interface ClientsContent {
    hero: {
        title: string
        subtitle: string
        description: string
    }
    testimonials: ClientTestimonial[]
    clients: Client[]
    stats: Stat[]
}

interface ClientsEditorProps {
    data: ClientsContent
    onChange: (data: ClientsContent) => void
}

export default function ClientsEditor({ data, onChange }: ClientsEditorProps) {
    const [formData, setFormData] = useState<ClientsContent>(data)
    const [editingClient, setEditingClient] = useState<number | null>(null)
    const [editingTestimonial, setEditingTestimonial] = useState<number | null>(null)
    const [activeSection, setActiveSection] = useState<'hero' | 'testimonials' | 'clients' | 'stats'>('hero')

    const handleChange = (newData: ClientsContent) => {
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

    const addClient = () => {
        const newClient: Client = {
            name: 'Nuevo Cliente',
            logo: '',
            country: '',
            students: '1,000+',
            since: '2024'
        }
        const updatedData = {
            ...formData,
            clients: [...formData.clients, newClient]
        }
        handleChange(updatedData)
        setEditingClient(formData.clients.length)
    }

    const updateClient = (index: number, field: keyof Client, value: string) => {
        const updatedClients = [...formData.clients]
        updatedClients[index] = { ...updatedClients[index], [field]: value }
        const updatedData = { ...formData, clients: updatedClients }
        handleChange(updatedData)
    }

    const deleteClient = (index: number) => {
        const updatedClients = formData.clients.filter((_, i) => i !== index)
        const updatedData = { ...formData, clients: updatedClients }
        handleChange(updatedData)
        setEditingClient(null)
    }

    const addTestimonial = () => {
        const newTestimonial: ClientTestimonial = {
            quote: 'Excelente servicio y soporte técnico.',
            author: 'Nuevo Cliente',
            position: 'Director',
            institution: 'Institución Educativa',
            country: 'México',
            logo: '',
            rating: 5
        }
        const updatedData = {
            ...formData,
            testimonials: [...formData.testimonials, newTestimonial]
        }
        handleChange(updatedData)
        setEditingTestimonial(formData.testimonials.length)
    }

    const updateTestimonial = (index: number, field: keyof ClientTestimonial, value: string | number) => {
        const updatedTestimonials = [...formData.testimonials]
        updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value }
        const updatedData = { ...formData, testimonials: updatedTestimonials }
        handleChange(updatedData)
    }

    const deleteTestimonial = (index: number) => {
        const updatedTestimonials = formData.testimonials.filter((_, i) => i !== index)
        const updatedData = { ...formData, testimonials: updatedTestimonials }
        handleChange(updatedData)
        setEditingTestimonial(null)
    }

    const updateStat = (index: number, field: keyof Stat, value: string) => {
        const updatedStats = [...formData.stats]
        updatedStats[index] = { ...updatedStats[index], [field]: value }
        const updatedData = { ...formData, stats: updatedStats }
        handleChange(updatedData)
    }

    const sections = [
        { id: 'hero', label: 'Contenido Principal', icon: '🏢' },
        { id: 'stats', label: 'Estadísticas', icon: '📊' },
        { id: 'testimonials', label: 'Testimonios', icon: '⭐' },
        { id: 'clients', label: 'Lista de Clientes', icon: '🏛️' }
    ]

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Secciones de Clientes</h3>
                <nav className="space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                activeSection === section.id
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Editor */}
            <div className="flex-1 p-6 overflow-y-auto">
                {activeSection === 'hero' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Contenido Principal</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                value={formData.hero.title}
                                onChange={(e) => updateHero('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Nuestros Clientes"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                value={formData.hero.subtitle}
                                onChange={(e) => updateHero('subtitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Instituciones que confían en SEVP"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.hero.description}
                                onChange={(e) => updateHero('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                placeholder="Trabajamos con las mejores instituciones educativas de América Latina para transformar la educación."
                            />
                        </div>
                    </div>
                )}

                {activeSection === 'stats' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Estadísticas</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.stats.map((stat, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-4">Estadística {index + 1}</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                            <input
                                                type="text"
                                                value={stat.number}
                                                onChange={(e) => updateStat(index, 'number', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="500+"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="Instituciones"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Icono (emoji)</label>
                                            <input
                                                type="text"
                                                value={stat.icon}
                                                onChange={(e) => updateStat(index, 'icon', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                placeholder="🏛️"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'testimonials' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Testimonios de Clientes</h3>
                            <button
                                onClick={addTestimonial}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Star className="h-4 w-4" />
                                Agregar Testimonio
                            </button>
                        </div>

                        {formData.testimonials.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No hay testimonios. Haz clic en "Agregar Testimonio" para empezar.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.testimonials.map((testimonial, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Testimonio #{index + 1}
                                                </span>
                                                <div className="flex">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingTestimonial(editingTestimonial === index ? null : index)}
                                                    className="text-green-600 hover:text-green-700 text-sm"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                            placeholder="Nombre de la institución"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                            placeholder="País"
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
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            URL del Logo
                                                        </label>
                                                        <input
                                                            type="url"
                                                            value={testimonial.logo}
                                                            onChange={(e) => updateTestimonial(index, 'logo', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                            placeholder="https://ejemplo.com/logo.jpg"
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
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="El testimonio del cliente..."
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <blockquote className="text-gray-700 italic mb-3">
                                                    "{testimonial.quote}"
                                                </blockquote>
                                                <div className="text-sm text-gray-600">
                                                    <strong>{testimonial.author}</strong>, {testimonial.position}
                                                    <br />
                                                    {testimonial.institution}, {testimonial.country}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'clients' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Lista de Clientes</h3>
                            <button
                                onClick={addClient}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Cliente
                            </button>
                        </div>

                        {formData.clients.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No hay clientes. Haz clic en "Agregar Cliente" para empezar.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.clients.map((client, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Cliente #{index + 1}
                                                </span>
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {client.country}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingClient(editingClient === index ? null : index)}
                                                    className="text-green-600 hover:text-green-700 text-sm"
                                                >
                                                    {editingClient === index ? 'Cerrar' : 'Editar'}
                                                </button>
                                                <button
                                                    onClick={() => deleteClient(index)}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {editingClient === index ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Nombre de la Institución
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={client.name}
                                                        onChange={(e) => updateClient(index, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="Universidad Nacional"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        País
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={client.country}
                                                        onChange={(e) => updateClient(index, 'country', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="México"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Número de Estudiantes
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={client.students}
                                                        onChange={(e) => updateClient(index, 'students', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="50,000+"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Cliente desde
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={client.since}
                                                        onChange={(e) => updateClient(index, 'since', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="2020"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        URL del Logo
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={client.logo}
                                                        onChange={(e) => updateClient(index, 'logo', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                                        placeholder="https://ejemplo.com/logo.jpg"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                {client.logo && (
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={client.logo}
                                                            alt={client.name}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{client.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {client.students} estudiantes • Desde {client.since}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}