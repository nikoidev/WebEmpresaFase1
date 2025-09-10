'use client'

import { useEffect, useState } from 'react'

interface StatData {
    title: string
    value: string
    change: string
    changeType: 'positive' | 'negative' | 'neutral'
    icon: string
}

export default function DashboardStats() {
    const [stats, setStats] = useState<StatData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simular carga de datos desde la API
        const loadStats = async () => {
            try {
                // Aquí se haría la llamada real a la API
                const mockStats: StatData[] = [
                    {
                        title: 'Clientes Activos',
                        value: '12',
                        change: '+2 este mes',
                        changeType: 'positive',
                        icon: '👥'
                    },
                    {
                        title: 'Instancias EC2',
                        value: '8',
                        change: 'Sin cambios',
                        changeType: 'neutral',
                        icon: '☁️'
                    },
                    {
                        title: 'Despliegues Hoy',
                        value: '4',
                        change: '+1 desde ayer',
                        changeType: 'positive',
                        icon: '🚀'
                    },
                    {
                        title: 'Tiempo Promedio',
                        value: '2.3min',
                        change: '-15% vs mes anterior',
                        changeType: 'positive',
                        icon: '⏱️'
                    }
                ]

                setStats(mockStats)
            } catch (error) {
                console.error('Error loading stats:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadStats()
    }, [])

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="dashboard-card animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="dashboard-card hover:shadow-lg transition-shadow duration-200">
                    <div className="dashboard-stat">
                        <div className="flex items-center justify-between mb-2">
                            <div className="dashboard-stat-title">
                                {stat.title}
                            </div>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <div className="dashboard-stat-value">
                            {stat.value}
                        </div>
                        <div className={`dashboard-stat-change ${stat.changeType}`}>
                            {stat.change}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
