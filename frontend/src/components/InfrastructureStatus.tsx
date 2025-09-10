'use client'

import { useEffect, useState } from 'react'

interface InfrastructureItem {
    id: string
    name: string
    type: 'ec2' | 'rds' | 'elb' | 's3'
    status: 'running' | 'stopped' | 'warning' | 'error'
    region: string
    cost: string
    utilization?: string
}

export default function InfrastructureStatus() {
    const [infrastructure, setInfrastructure] = useState<InfrastructureItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadInfrastructure = async () => {
            try {
                // Datos simulados - aquí se conectaría a AWS API
                const mockData: InfrastructureItem[] = [
                    {
                        id: 'i-1234567890abcdef0',
                        name: 'sevp-web-prod-1',
                        type: 'ec2',
                        status: 'running',
                        region: 'us-east-1',
                        cost: '$45.20/mes',
                        utilization: '65%'
                    },
                    {
                        id: 'sevp-prod-db',
                        name: 'sevp-database',
                        type: 'rds',
                        status: 'running',
                        region: 'us-east-1',
                        cost: '$89.50/mes',
                        utilization: '40%'
                    },
                    {
                        id: 'arn:aws:elasticloadbalancing',
                        name: 'sevp-main-alb',
                        type: 'elb',
                        status: 'running',
                        region: 'us-east-1',
                        cost: '$22.35/mes'
                    },
                    {
                        id: 'sevp-assets-bucket',
                        name: 'sevp-static-files',
                        type: 's3',
                        status: 'running',
                        region: 'us-east-1',
                        cost: '$12.80/mes'
                    }
                ]

                setInfrastructure(mockData)
            } catch (error) {
                console.error('Error loading infrastructure:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadInfrastructure()

        // Actualizar cada 60 segundos
        const interval = setInterval(loadInfrastructure, 60000)
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running':
                return 'text-green-600 bg-green-100'
            case 'warning':
                return 'text-yellow-600 bg-yellow-100'
            case 'stopped':
                return 'text-gray-600 bg-gray-100'
            case 'error':
                return 'text-red-600 bg-red-100'
            default:
                return 'text-gray-600 bg-gray-100'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ec2':
                return '🖥️'
            case 'rds':
                return '🗄️'
            case 'elb':
                return '⚖️'
            case 's3':
                return '💾'
            default:
                return '☁️'
        }
    }

    const getTypeName = (type: string) => {
        switch (type) {
            case 'ec2':
                return 'EC2 Instance'
            case 'rds':
                return 'RDS Database'
            case 'elb':
                return 'Load Balancer'
            case 's3':
                return 'S3 Bucket'
            default:
                return 'Unknown'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'running':
                return 'Ejecutando'
            case 'warning':
                return 'Advertencia'
            case 'stopped':
                return 'Detenido'
            case 'error':
                return 'Error'
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
                {infrastructure.map((item) => (
                    <div key={item.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                            <span className="text-xl">{getTypeIcon(item.type)}</span>
                            <div>
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-sm text-gray-500">
                                    {getTypeName(item.type)} • {item.region}
                                    {item.utilization && ` • CPU: ${item.utilization}`}
                                </div>
                                <div className="text-xs text-gray-400">
                                    Costo estimado: {item.cost}
                                </div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Costo Total Estimado</span>
                    <span className="font-medium text-gray-900">$169.85/mes</span>
                </div>
            </div>
        </div>
    )
}
