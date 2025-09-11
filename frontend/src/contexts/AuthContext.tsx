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
            const token = Cookies.get('authToken')
            if (token) {
                const response = await adminApi.getCurrentUser()
                setUser(response.data)
            }
        } catch (error) {
            // Token inválido, limpiar
            Cookies.remove('authToken')
            Cookies.remove('user')
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (credentials: LoginFormData) => {
        try {
            const response = await adminApi.login(credentials)
            const { access_token } = response.data

            // Guardar token
            Cookies.set('authToken', access_token, { expires: 7 }) // 7 días

            // Obtener datos del usuario después del login
            const userResponse = await adminApi.getCurrentUser()
            const userData = userResponse.data
            
            Cookies.set('user', JSON.stringify(userData), { expires: 7 })
            setUser(userData)
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Error al iniciar sesión')
        }
    }

    const logout = async () => {
        try {
            await adminApi.logout()
        } catch (error) {
            // Ignorar errores de logout
        } finally {
            // Limpiar estado local siempre
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
