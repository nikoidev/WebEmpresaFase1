'use client'

import { useAuth } from '@/contexts/AuthContext'
import { InlineEditProvider } from '@/contexts/InlineEditContext'
import { BarChart3, DollarSign, FileText, HelpCircle, Home, LogOut, Menu, MessageSquare, Settings, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout, isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin/login')
        }
    }, [isAuthenticated, isLoading, router])

    const handleLogout = async () => {
        await logout()
        router.push('/admin/login')
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
        { name: 'Gestión de Contenido', href: '/admin/content', icon: Settings },
        { name: 'Usuarios', href: '/admin/users', icon: Users },
        { name: 'Mensajes de Contacto', href: '/admin/contacts', icon: MessageSquare },
        { name: 'Información de Empresa', href: '/admin/company', icon: Settings },
        { name: 'Reportes', href: '/admin/reports', icon: BarChart3 },
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <InlineEditProvider>
            <div className="h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col`}>
                <div className="flex items-center justify-center h-16 bg-gray-800 px-4 border-b border-gray-700">
                    <div className="flex items-center w-full">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <span className="text-white text-xl font-bold truncate">SEVP Admin</span>
                    </div>
                </div>

                <nav className="mt-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-6 py-3 text-white hover:bg-primary-600 transition-all duration-200"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon className="h-5 w-5 mr-3 text-white" />
                            <span className="text-white">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold">
                                    {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-white text-sm font-medium">
                                    {user?.first_name || user?.username}
                                </p>
                                <p className="text-white text-xs">
                                    {user?.is_superuser ? 'Super Admin' : 'Admin'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <div className="bg-white shadow-sm border-b border-gray-200 z-10">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                            {isSidebarOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>

                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                Ver Sitio Público
                            </Link>

                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-white text-sm font-bold">
                                        {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                                    </span>
                                </div>
                                <span className="text-gray-700 text-sm font-medium hidden sm:block">
                                    {user?.first_name || user?.username}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dev Mode File Info */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-2 text-xs">
                        <span className="text-yellow-800 font-mono">
                            📁 Layout: frontend/src/components/layout/AdminLayout.tsx
                        </span>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                </div>
            )}
            </div>
        </InlineEditProvider>
    )
}
