'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LoginFormData } from '@/types'
import { AlertCircle, Eye, EyeOff, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function AdminLoginPage() {
    const [mounted, setMounted] = useState(false)
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const router = useRouter()

    // Asegurar que el componente solo se renderice del lado del cliente
    useEffect(() => {
        setMounted(true)
        
        // Recuperar error persistente si existe
        const persistedError = localStorage.getItem('loginError')
        if (persistedError) {
            setError(persistedError)
        }
    }, [])

    // No renderizar hasta que esté montado del lado del cliente
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando...</p>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        
        // Limpiar error previo al iniciar nuevo intento
        localStorage.removeItem('loginError')
        setError('')

        try {
            await login(formData)
            localStorage.removeItem('loginError') // Asegurar que se limpia en éxito
            router.push('/admin/dashboard')
        } catch (err: any) {
            const errorMessage = err.message || 'Error al iniciar sesión'
            // Persistir error en localStorage para sobrevivir re-mounts
            localStorage.setItem('loginError', errorMessage)
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        // Ya no limpiamos el error automáticamente al escribir
        // El error se mantendrá visible hasta el próximo intento de login
    }

    const clearError = () => {
        setError('')
        localStorage.removeItem('loginError')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center">
                        <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-2xl">S</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">SEVP</span>
                    </Link>
                </div>

                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                    Acceso Administrativo
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Inicia sesión para gestionar el contenido de la plataforma
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="text-red-800 font-medium text-sm">
                                            ⚠️ Error de autenticación
                                        </div>
                                        <div className="text-red-700 text-sm mt-1">
                                            {error}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearError}
                                        className="ml-3 text-red-400 hover:text-red-600 text-sm"
                                        title="Cerrar error"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="admin@sevp.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    placeholder="Ingresa tu contraseña"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <LogIn className="h-5 w-5 mr-2" />
                                        Iniciar Sesión
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">¿No tienes acceso?</span>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                href="/contacto"
                                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                            >
                                Contacta al administrador del sistema
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Back to Public Site */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                        ← Volver al sitio público
                    </Link>
                </div>
            </div>
        </div>
    )
}
