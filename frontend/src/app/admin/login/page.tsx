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

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('=== FORM SUBMIT TRIGGERED ===')
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            console.log('Starting login process...')
            console.log('Form data:', formData)
            await login(formData.username, formData.password)
            console.log('Login successful, redirecting to dashboard...')
            
            // Intentar redirección inmediata
            window.location.href = '/admin/dashboard'
            console.log('Window.location.href called')
        } catch (err) {
            console.error('Login failed:', err)
            console.error('Error details:', err)
            setError('Credenciales inválidas. Por favor, intenta de nuevo.')
        } finally {
            console.log('Setting isLoading to false')
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if (!mounted) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <LogIn className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Panel de Administración
                        </h2>
                        <p className="text-gray-600">
                            Ingresa tus credenciales para acceder
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Ingresa tu usuario"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                                    placeholder="Ingresa tu contraseña"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Iniciando sesión...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <LogIn className="h-4 w-4" />
                                    <span>Iniciar Sesión</span>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link 
                            href="/" 
                            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            ← Volver al sitio web
                        </Link>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 WebEmpresa. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    )
}
