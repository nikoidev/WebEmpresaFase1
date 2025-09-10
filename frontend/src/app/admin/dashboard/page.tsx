'use client'

import AdminLayout from '@/components/layout/AdminLayout'
import { publicApi } from '@/lib/api'
import { BarChart3, DollarSign, FileText, Globe, MessageSquare, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
    totalNews: number
    totalTestimonials: number
    totalPlans: number
    totalContacts: number
    featuredNews: number
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalNews: 0,
        totalTestimonials: 0,
        totalPlans: 0,
        totalContacts: 0,
        featuredNews: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            const response = await publicApi.getStats()
            setStats({
                totalNews: response.data.total_articles,
                totalTestimonials: response.data.total_testimonials,
                totalPlans: 3, // Hardcoded por ahora
                totalContacts: 0, // Será implementado
                featuredNews: response.data.featured_articles
            })
        } catch (error) {
            console.error('Error loading stats:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Artículos de Noticias',
            value: stats.totalNews,
            icon: FileText,
            color: 'bg-blue-500',
            href: '/admin/news'
        },
        {
            title: 'Planes de Servicio',
            value: stats.totalPlans,
            icon: DollarSign,
            color: 'bg-green-500',
            href: '/admin/plans'
        },
        {
            title: 'Testimonios',
            value: stats.totalTestimonials,
            icon: MessageSquare,
            color: 'bg-purple-500',
            href: '/admin/testimonials'
        },
        {
            title: 'Mensajes de Contacto',
            value: stats.totalContacts,
            icon: Users,
            color: 'bg-orange-500',
            href: '/admin/contacts'
        }
    ]

    const quickActions = [
        {
            title: 'Crear Nuevo Artículo',
            description: 'Agregar una nueva noticia o entrada de blog',
            icon: FileText,
            href: '/admin/news/create',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Gestionar Planes',
            description: 'Editar precios y características de los planes',
            icon: DollarSign,
            href: '/admin/plans',
            color: 'bg-green-100 text-green-600'
        },
        {
            title: 'Ver Mensajes',
            description: 'Revisar y responder mensajes de contacto',
            icon: MessageSquare,
            href: '/admin/contacts',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            title: 'Configurar Empresa',
            description: 'Actualizar información de la empresa',
            icon: Globe,
            href: '/admin/company',
            color: 'bg-orange-100 text-orange-600'
        }
    ]

    return (
        <AdminLayout>
            <div className="h-full space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Bienvenido al panel de administración de SEVP. Gestiona el contenido de tu sitio web.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <Link key={index} href={stat.href}>
                            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-center">
                                    <div className={`${stat.color} p-3 rounded-lg`}>
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {isLoading ? '...' : stat.value}
                                        </h3>
                                        <p className="text-sm text-gray-600">{stat.title}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                                    <div className={`${action.color} p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4`}>
                                        <action.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {action.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* System Status */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Estado del Sistema
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">API Backend</span>
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Activo
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Base de Datos</span>
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Conectada
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Sitio Público</span>
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Globe className="h-5 w-5 mr-2" />
                            Enlaces Útiles
                        </h3>
                        <div className="space-y-3">
                            <Link href="/" className="block text-primary-600 hover:text-primary-700 text-sm">
                                → Ver Sitio Público
                            </Link>
                            <Link href="http://localhost:8001/admin/" className="block text-primary-600 hover:text-primary-700 text-sm">
                                → Panel Admin Django
                            </Link>
                            <Link href="/admin/company" className="block text-primary-600 hover:text-primary-700 text-sm">
                                → Configurar Información de Empresa
                            </Link>
                            <Link href="/admin/plans" className="block text-primary-600 hover:text-primary-700 text-sm">
                                → Gestionar Planes de Precios
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
