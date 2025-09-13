'use client'

import adminApi from '@/services/adminApi'
import type { ContactMessage } from '@/types'
import {
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    Filter,
    Mail,
    MessageCircle,
    Phone,
    Search,
    Trash2,
    User
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ContactsManagementPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'responded'>('all')
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [responseText, setResponseText] = useState('')

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const response = await adminApi.getContactMessages()
            setMessages(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching contact messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsResponded = async (id: number) => {
        try {
            await adminApi.updateContactMessage(id, {
                is_responded: true,
                responded_at: new Date().toISOString(),
                response: responseText || 'Mensaje atendido'
            })
            setResponseText('')
            setSelectedMessage(null)
            setShowModal(false)
            fetchMessages()
        } catch (error) {
            console.error('Error updating message:', error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            try {
                await adminApi.deleteContactMessage(id)
                fetchMessages()
            } catch (error) {
                console.error('Error deleting message:', error)
            }
        }
    }

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message)
        setResponseText('')
        setShowModal(true)
    }

    const filteredMessages = messages.filter(message => {
        const matchesSearch =
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'pending' && !message.is_responded) ||
            (statusFilter === 'responded' && message.is_responded)

        return matchesSearch && matchesStatus
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const stats = {
        total: messages.length,
        pending: messages.filter(m => !m.is_responded).length,
        responded: messages.filter(m => m.is_responded).length,
        today: messages.filter(m =>
            new Date(m.created_at).toDateString() === new Date().toDateString()
        ).length
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
                    <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
                    <p className="mt-2 text-gray-600">
                        Gestiona y responde los mensajes de contacto
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <MessageCircle className="text-blue-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <Clock className="text-yellow-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Pendientes</p>
                            <p className="text-xl font-bold">{stats.pending}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Respondidos</p>
                            <p className="text-xl font-bold">{stats.responded}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-purple-600" size={24} />
                        <div>
                            <p className="text-sm text-gray-600">Hoy</p>
                            <p className="text-xl font-bold">{stats.today}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar mensajes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'responded')}
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="responded">Respondidos</option>
                    </select>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron mensajes.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredMessages.map((message) => (
                            <div key={message.id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-gray-400" />
                                                <span className="font-semibold text-gray-900">
                                                    {message.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-gray-400" />
                                                <a
                                                    href={`mailto:${message.email}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {message.email}
                                                </a>
                                            </div>
                                            {message.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={16} className="text-gray-400" />
                                                    <span className="text-gray-600">{message.phone}</span>
                                                </div>
                                            )}
                                        </div>

                                        {message.subject && (
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {message.subject}
                                            </h3>
                                        )}

                                        <p className="text-gray-700 mb-3 line-clamp-2">
                                            {message.message}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(message.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs ${message.is_responded
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {message.is_responded ? 'Respondido' : 'Pendiente'}
                                            </span>
                                        </div>

                                        {message.is_responded && message.responded_at && (
                                            <div className="mt-2 text-sm text-gray-500">
                                                Respondido el {new Date(message.responded_at).toLocaleDateString('es-ES')}
                                                {message.response && (
                                                    <div className="mt-1 p-2 bg-green-50 rounded text-green-700">
                                                        {message.response}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={() => handleViewMessage(message)}
                                            className="text-blue-600 hover:text-blue-900 p-2"
                                            title="Ver mensaje"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(message.id)}
                                            className="text-red-600 hover:text-red-900 p-2"
                                            title="Eliminar mensaje"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Mensaje de Contacto</h2>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre
                                    </label>
                                    <p className="text-gray-900">{selectedMessage.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {selectedMessage.email}
                                    </a>
                                </div>
                            </div>

                            {selectedMessage.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <p className="text-gray-900">{selectedMessage.phone}</p>
                                </div>
                            )}

                            {selectedMessage.subject && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asunto
                                    </label>
                                    <p className="text-gray-900">{selectedMessage.subject}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mensaje
                                </label>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-gray-900 whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de Recepción
                                </label>
                                <p className="text-gray-900">
                                    {new Date(selectedMessage.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {!selectedMessage.is_responded && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Respuesta (opcional)
                                    </label>
                                    <textarea
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        placeholder="Agrega una nota sobre la respuesta..."
                                    />
                                </div>
                            )}

                            {selectedMessage.is_responded && selectedMessage.response && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Respuesta Registrada
                                    </label>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-green-900">{selectedMessage.response}</p>
                                        <p className="text-sm text-green-600 mt-1">
                                            Respondido el {new Date(selectedMessage.responded_at!).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        setSelectedMessage(null)
                                        setResponseText('')
                                    }}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cerrar
                                </button>
                                {!selectedMessage.is_responded && (
                                    <button
                                        onClick={() => handleMarkAsResponded(selectedMessage.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Marcar como Respondido
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
