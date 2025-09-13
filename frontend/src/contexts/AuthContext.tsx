'use client'

import { adminApi } from '@/lib/api'
import { AuthContextType, LoginFormData, User } from '@/types'
import Cookies from 'js-cookie'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('access_token')
            if (token) {
                // Intentar obtener usuario actual para validar token
                const response = await adminApi.getCurrentUser()
                setUser(response.data || response)
            } else {
                setUser(null)
            }
        } catch (error: any) {
            // Token inválido o backend no disponible, limpiar sesión
            localStorage.removeItem('access_token')
            Cookies.remove('authToken')
            Cookies.remove('user')
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (username: string, password: string) => {
        try {
            console.log('=== LOGIN DEBUG START ===')
            const response = await adminApi.login({ username, password })
            console.log('Raw response:', response)
            console.log('Response type:', typeof response)
            console.log('Response keys:', Object.keys(response))
            console.log('response.data:', response.data)
            console.log('response.access_token:', response.access_token)
            
            // Intentar ambas formas
            const access_token = response.data?.access_token || response.access_token
            
            if (!access_token) {
                throw new Error('No se recibió token de acceso del servidor')
            }

            // Guardar token en localStorage Y en cookies (para middleware)
            localStorage.setItem('access_token', access_token)
            Cookies.set('authToken', access_token, { expires: 7 })
            console.log('Token saved:', access_token)

            // Obtener datos del usuario después del login
            console.log('Getting current user...')
            const userResponse = await adminApi.getCurrentUser()
            console.log('User response:', userResponse)
            console.log('User response type:', typeof userResponse)
            console.log('User response keys:', Object.keys(userResponse))
            console.log('userResponse.data:', userResponse.data)
            
            const userData = userResponse.data || userResponse
            console.log('Final user data:', userData)
            
            Cookies.set('user', JSON.stringify(userData), { expires: 7 })
            setUser(userData)
            console.log('Login completed successfully')
            console.log('=== LOGIN DEBUG END ===')
            return true // Indicar éxito explícitamente
        } catch (error: any) {
            console.error('Login error:', error)
            let errorMessage = 'Error al iniciar sesión'
            
            if (error.message) {
                errorMessage = error.message
            } else if (error.response?.status === 401) {
                errorMessage = 'Usuario o contraseña incorrectos'
            } else if (error.response?.status === 400) {
                errorMessage = 'Usuario inactivo'
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail
            }
            
            throw new Error(errorMessage)
        }
    }

    const logout = async () => {
        try {
            await adminApi.logout()
        } catch (error) {
            // Ignorar errores de logout
        } finally {
            // Limpiar estado local siempre
            localStorage.removeItem('access_token')
            Cookies.remove('authToken')
            Cookies.remove('user')
            setUser(null)
        }
    }

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}