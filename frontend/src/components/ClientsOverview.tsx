'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Client {
    id: number
    name: string
    company: string
    status: 'active' | 'inactive' | 'trial'
    plan: string
    lastActivity: string
    users: number
}

export default function ClientsOverview() {
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadClients = async () => {
            try {
                // Datos simulados - aquí se conectaría a la API real
                const mockClients: Client[] = [
                    {
                        id: 1,
                        name: 'Colegio San Martín',
                        company: 'Institución Educativa',
                        status: 'active',
                        plan: 'Premium',
                        lastActivity: 'Hace 2 horas',
                        users: 450
                    },
                    {
                        id: 2,
                        name: 'Universidad Nacional',
                        company: 'Universidad',
                        status: 'active',
                        plan: 'Enterprise',
                        lastActivity: 'Hace 30 min',
                        users: 1200
                    },
                    {
                        id: 3,
                        name: 'Academia Excel',
                        company: 'Centro de Estudios',
                        status: 'trial',
                        plan: 'Básico',
                        lastActivity: 'Hace 1 día',
                        users: 85
                    },
                    {
                        id: 4,
                        name: 'Instituto Técnico',
                        company: 'Formación Técnica',
                        status: 'active',
                        plan: 'Premium',
                        lastActivity: 'Hace 4 horas',
                        users: 320
                    }
                ]

                setClients(mockClients)
            } catch (error) {
                console.error('Error loading clients:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadClients()
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-600 bg-green-100'
            case 'trial':
                return 'text-blue-600 bg-blue-100'
            case 'inactive':
                return 'text-red-600 bg-red-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Activo'
            case 'trial':
                return 'Prueba'
            case 'inactive':
                return 'Inactivo'
            default:
                return 'Desconocido'
        }
    }

    if (isLoading) {
        return (
            <div className="dashboard-card">
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between animate-pulse">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-card">
            <div className="space-y-4">
                {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex-1">
                            <div className="flex items-center space-x-3">
                                <div>
                                    <div className="font-medium text-gray-900">{client.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {client.company} • {client.users} usuarios • Plan {client.plan}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Última actividad: {client.lastActivity}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                                {getStatusText(client.status)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                    href="/clients"
                    className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                    Ver todos los clientes →
                </Link>
            </div>
        </div>
    )
}
