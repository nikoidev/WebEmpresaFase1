'use client'

import DevFileInfo from '@/components/DevFileInfo'
import { BarChart3, Globe, Settings, Users } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {

    const quickActions = [
        {
            title: 'Gestión de Contenido',
            description: 'Editar y administrar todo el contenido del sitio web',
            icon: Settings,
            href: '/admin/content',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Gestionar Usuarios',
            description: 'Administrar usuarios y permisos del sistema',
            icon: Users,
            href: '/admin/users',
            color: 'bg-green-100 text-green-600'
        },
        {
            title: 'Ver Sitio Público',
            description: 'Revisar cómo se ve el sitio web público',
            icon: Globe,
            href: '/',
            color: 'bg-purple-100 text-purple-600'
        }
    ]

    return (
        <div className="h-full space-y-8">
                <DevFileInfo filePath="frontend/src/app/admin/dashboard/page.tsx" />
                
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Bienvenido al panel de administración de SEVP. Gestiona el contenido de tu sitio web.
                    </p>
                </div>

                {/* Mensaje informativo */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Settings className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-lg font-medium text-blue-900">
                                Sistema Unificado de Gestión de Contenido
                            </h3>
                            <p className="mt-2 text-blue-700">
                                Ahora todo el contenido del sitio web se gestiona desde un solo lugar. 
                                Ve a <strong>Gestión de Contenido</strong> para editar páginas, noticias, testimonios, FAQs, precios y más.
                            </p>
                            <div className="mt-4">
                                <Link
                                    href="/admin/content"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Ir a Gestión de Contenido
                                    <Settings className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Acciones Principales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                {/* System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                <span className="text-sm text-gray-600">Gestión de Contenido</span>
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Disponible
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Globe className="h-5 w-5 mr-2" />
                            Enlaces Útiles
                        </h3>
                        <div className="space-y-3">
                            <Link href="/" className="block text-blue-600 hover:text-blue-700 text-sm">
                                → Ver Sitio Público
                            </Link>
                            <Link href="/admin/content" className="block text-blue-600 hover:text-blue-700 text-sm">
                                → Gestión de Contenido
                            </Link>
                            <Link href="/admin/users" className="block text-blue-600 hover:text-blue-700 text-sm">
                                → Administrar Usuarios
                            </Link>
                            <Link href="/admin/contacts" className="block text-blue-600 hover:text-blue-700 text-sm">
                                → Ver Mensajes de Contacto
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
    )
}