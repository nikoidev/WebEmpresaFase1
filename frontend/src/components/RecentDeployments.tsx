'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Deployment {
    id: string
    version: string
    client: string
    type: 'backend' | 'frontend' | 'database' | 'full'
    status: 'success' | 'failed' | 'in_progress' | 'pending'
    deployedBy: string
    duration: string
    timestamp: string
}

export default function RecentDeployments() {
    const [deployments, setDeployments] = useState<Deployment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDeployments = async () => {
            try {
                // Datos simulados - aquí se conectaría a la API real
                const mockDeployments: Deployment[] = [
                    {
                        id: 'dep-001',
                        version: 'v2.1.4',
                        client: 'Colegio San Martín',
                        type: 'backend',
                        status: 'success',
                        deployedBy: 'Admin',
                        duration: '2m 15s',
                        timestamp: 'Hace 30 min'
                    },
                    {
                        id: 'dep-002',
                        version: 'v1.8.2',
                        client: 'Universidad Nacional',
                        type: 'full',
                        status: 'success',
                        deployedBy: 'Admin',
                        duration: '5m 42s',
                        timestamp: 'Hace 2 horas'
                    },
                    {
                        id: 'dep-003',
                        version: 'v2.1.3',
                        client: 'Academia Excel',
                        type: 'frontend',
                        status: 'in_progress',
                        deployedBy: 'Admin',
                        duration: '1m 30s',
                        timestamp: 'Hace 5 min'
                    },
                    {
                        id: 'dep-004',
                        version: 'v1.9.1',
                        client: 'Instituto Técnico',
                        type: 'backend',
                        status: 'failed',
                        deployedBy: 'Admin',
                        duration: '45s',
                        timestamp: 'Hace 1 hora'
                    }
                ]

                setDeployments(mockDeployments)
            } catch (error) {
                console.error('Error loading deployments:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadDeployments()

        // Actualizar cada 30 segundos para deployments en progreso
        const interval = setInterval(loadDeployments, 30000)
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'text-green-600 bg-green-100'
            case 'failed':
                return 'text-red-600 bg-red-100'
            case 'in_progress':
                return 'text-blue-600 bg-blue-100'
            case 'pending':
                return 'text-yellow-600 bg-yellow-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return '✅'
            case 'failed':
                return '❌'
            case 'in_progress':
                return '🔄'
            case 'pending':
                return '⏳'
            default:
                return '❓'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'success':
                return 'Exitoso'
            case 'failed':
                return 'Fallido'
            case 'in_progress':
                return 'En Progreso'
            case 'pending':
                return 'Pendiente'
            default:
                return 'Desconocido'
        }
    }

    const getTypeText = (type: string) => {
        switch (type) {
            case 'backend':
                return 'Backend'
            case 'frontend':
                return 'Frontend'
            case 'database':
                return 'Base de Datos'
            case 'full':
                return 'Completo'
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
                {deployments.map((deployment) => (
                    <div key={deployment.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">{getStatusIcon(deployment.status)}</span>
                            <div>
                                <div className="font-medium text-gray-900">
                                    {deployment.client} • {deployment.version}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {getTypeText(deployment.type)} • Duración: {deployment.duration}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {deployment.timestamp} • Por {deployment.deployedBy}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                                {getStatusText(deployment.status)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                    href="/deployments"
                    className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                    Ver todos los despliegues →
                </Link>
            </div>
        </div>
    )
}
