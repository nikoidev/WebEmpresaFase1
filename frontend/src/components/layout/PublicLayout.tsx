'use client'

import { LogIn, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { InlineEditProvider } from '@/contexts/InlineEditContext'

interface PublicLayoutProps {
    children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navigation = [
        { name: 'Inicio', href: '/' },
        { name: 'Nosotros', href: '/nosotros' },
        { name: 'Historia', href: '/historia' },
        { name: 'Clientes', href: '/clientes' },
        { name: 'Precios', href: '/precios' },
        { name: 'Contacto', href: '/contacto' },
    ]

    return (
        <AuthProvider>
            <InlineEditProvider>
                <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-xl">S</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">SEVP</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Admin Access Button */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/admin/login"
                                className="flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Acceso Admin
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/admin/login"
                                    className="flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors pt-4 border-t border-gray-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Acceso Admin
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-xl">S</span>
                                </div>
                                <span className="text-xl font-bold text-white">SEVP</span>
                            </div>
                            <p className="text-white mb-4 max-w-md">
                                Sistema Educativo Virtual Profesional - La plataforma más completa
                                para transformar la gestión educativa de tu institución.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">Navegación</h3>
                            <ul className="space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-white hover:text-gray-200 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">Soporte</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="mailto:soporte@sevp.com" className="text-white hover:text-gray-200 transition-colors">
                                        soporte@sevp.com
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+51999999999" className="text-white hover:text-gray-200 transition-colors">
                                        +51 999 999 999
                                    </a>
                                </li>
                                <li>
                                    <span className="text-white">
                                        Lun - Vie: 9:00 - 18:00
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white text-sm">
                            © {new Date().getFullYear()} SEVP. Todos los derechos reservados.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacidad" className="text-white hover:text-gray-200 text-sm transition-colors">
                                Política de Privacidad
                            </Link>
                            <Link href="/terminos" className="text-white hover:text-gray-200 text-sm transition-colors">
                                Términos de Uso
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
                </div>
            </InlineEditProvider>
        </AuthProvider>
    )
}
