'use client'

import { adminApi } from '@/lib/api'
import type { ContactMessage } from '@/types'
import DevFileInfo from '@/components/DevFileInfo'
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
            const response = await adminApi.contacts.list()
            setMessages(response.data.results || response.data)
        } catch (error) {
            console.error('Error fetching contact messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsResponded = async (id: number) => {
        try {
            await adminApi.contacts.update(id, {
                status: 'responded',
                responded_at: new Date().toISOString(),
                admin_response: responseText || 'Mensaje atendido'
            })
            fetchMessages()
            setShowModal(false)
            setResponseText('')
        } catch (error) {
            console.error('Error updating message:', error)
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
            try {
                await adminApi.contacts.delete(id)
                fetchMessages()
            } catch (error) {
                console.error('Error deleting message:', error)
            }
        }
    }

    const filteredMessages = messages.filter(message => {
        const matchesSearch = 
            message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.message.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = 
            statusFilter === 'all' ||
            (statusFilter === 'pending' && message.status === 'new') ||
            (statusFilter === 'responded' && message.status === 'responded')

        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'responded':
                return 'bg-green-100 text-green-800'
            case 'in_progress':
                return 'bg-blue-100 text-blue-800'
            case 'closed':
                return 'bg-gray-100 text-gray-800'
            default: // 'new'
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'responded':
                return 'Respondido'
            case 'in_progress':
                return 'En Proceso'
            case 'closed':
                return 'Cerrado'
            default: // 'new'
                return 'Pendiente'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="h-full space-y-8">
            <DevFileInfo filePath="frontend/src/app/admin/contacts/page.tsx" />
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mensajes de Contacto</h1>
                <p className="mt-2 text-gray-600">
                    Gestiona y responde a los mensajes recibidos desde el formulario de contacto
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <MessageCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Mensajes</p>
                            <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <Clock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {messages.filter(m => m.status === 'new').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Respondidos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {messages.filter(m => m.status === 'responded').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, email, asunto o mensaje..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'responded')}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="responded">Respondidos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {filteredMessages.length === 0 ? (
                    <div className="p-8 text-center">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
                        <p className="text-gray-600">
                            {searchTerm || statusFilter !== 'all' 
                                ? 'No se encontraron mensajes con los filtros aplicados.'
                                : 'Aún no has recibido mensajes de contacto.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contacto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Asunto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredMessages.map((message) => (
                                    <tr key={message.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <User className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {message.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Mail className="h-4 w-4 mr-1" />
                                                        {message.email}
                                                    </div>
                                                    {message.phone && (
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <Phone className="h-4 w-4 mr-1" />
                                                            {message.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {message.subject}
                                            </div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {message.message}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                                                {getStatusText(message.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {formatDate(message.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMessage(message)
                                                        setShowModal(true)
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 p-1"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {message.status === 'new' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMessage(message)
                                                            setShowModal(true)
                                                        }}
                                                        className="text-green-600 hover:text-green-900 p-1"
                                                        title="Marcar como respondido"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(message.id)}
                                                    className="text-red-600 hover:text-red-900 p-1"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Detalles del Mensaje</h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false)
                                        setSelectedMessage(null)
                                        setResponseText('')
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Message Details */}
                            <div className="space-y-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre
                                        </label>
                                        <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <p className="text-sm text-gray-900">{selectedMessage.email}</p>
                                    </div>
                                </div>

                                {selectedMessage.phone && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Teléfono
                                        </label>
                                        <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Asunto
                                    </label>
                                    <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mensaje
                                    </label>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado
                                        </label>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                                            {getStatusText(selectedMessage.status)}
                                        </span>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha de recepción
                                        </label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedMessage.created_at)}</p>
                                    </div>
                                </div>

                                {selectedMessage.status === 'responded' && selectedMessage.responded_at && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Respondido el
                                        </label>
                                        <p className="text-sm text-gray-900">{formatDate(selectedMessage.responded_at)}</p>
                                        {selectedMessage.admin_response && (
                                            <div className="mt-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Respuesta
                                                </label>
                                                <div className="bg-blue-50 rounded-lg p-4">
                                                    <p className="text-sm text-gray-900">{selectedMessage.admin_response}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Response Section */}
                            {selectedMessage.status === 'new' && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Marcar como Respondido</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nota de respuesta (opcional)
                                            </label>
                                            <textarea
                                                value={responseText}
                                                onChange={(e) => setResponseText(e.target.value)}
                                                placeholder="Describe brevemente cómo se respondió al mensaje..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setShowModal(false)
                                                    setSelectedMessage(null)
                                                    setResponseText('')
                                                }}
                                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => handleMarkAsResponded(selectedMessage.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Marcar como Respondido
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}