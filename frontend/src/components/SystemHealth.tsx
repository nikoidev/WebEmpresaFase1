'use client'

import { useEffect, useState } from 'react'

interface HealthData {
    service: string
    status: 'healthy' | 'warning' | 'critical'
    uptime: string
    lastCheck: string
}

export default function SystemHealth() {
    const [healthData, setHealthData] = useState<HealthData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadHealthData = async () => {
            try {
                // Datos simulados - aquí se conectaría a la API real
                const mockData: HealthData[] = [
                    {
                        service: 'API Backend',
                        status: 'healthy',
                        uptime: '99.9%',
                        lastCheck: 'Hace 30s'
                    },
                    {
                        service: 'Base de Datos',
                        status: 'healthy',
                        uptime: '99.8%',
                        lastCheck: 'Hace 1m'
                    },
                    {
                        service: 'Redis Cache',
                        status: 'warning',
                        uptime: '98.5%',
                        lastCheck: 'Hace 2m'
                    },
                    {
                        service: 'AWS Load Balancer',
                        status: 'healthy',
                        uptime: '100%',
                        lastCheck: 'Hace 45s'
                    }
                ]

                setHealthData(mockData)
            } catch (error) {
                console.error('Error loading health data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadHealthData()

        // Actualizar cada 30 segundos
        const interval = setInterval(loadHealthData, 30000)
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'text-green-600 bg-green-100'
            case 'warning':
                return 'text-yellow-600 bg-yellow-100'
            case 'critical':
                return 'text-red-600 bg-red-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return '✅'
            case 'warning':
                return '⚠️'
            case 'critical':
                return '❌'
            default:
                return '❓'
        }
    }

    if (isLoading) {
        return (
            <div className="dashboard-card">
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-card">
            <div className="space-y-4">
                {healthData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-xl">{getStatusIcon(item.status)}</span>
                            <div>
                                <div className="font-medium text-gray-900">{item.service}</div>
                                <div className="text-sm text-gray-500">
                                    Uptime: {item.uptime} • {item.lastCheck}
                                </div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status === 'healthy' ? 'Saludable' :
                                item.status === 'warning' ? 'Advertencia' : 'Crítico'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Estado General del Sistema</span>
                    <span className="font-medium text-green-600">Operativo</span>
                </div>
            </div>
        </div>
    )
}
