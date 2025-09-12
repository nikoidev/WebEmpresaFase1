'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

interface InlineEditContextType {
    isEditMode: boolean
    toggleEditMode: () => void
    canEdit: boolean
}

const InlineEditContext = createContext<InlineEditContextType | undefined>(undefined)

export function InlineEditProvider({ children }: { children: React.ReactNode }) {
    const [isEditMode, setIsEditMode] = useState(false)
    const { user, isAuthenticated } = useAuth()

    // Solo admins pueden editar
    const canEdit = isAuthenticated && user?.is_admin

    const toggleEditMode = () => {
        if (canEdit) {
            setIsEditMode(!isEditMode)
        }
    }

    // Atajos de teclado para edición
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl/Cmd + E para toggle edit mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'e' && canEdit) {
                e.preventDefault()
                toggleEditMode()
            }
            // Escape para salir del edit mode
            if (e.key === 'Escape' && isEditMode) {
                setIsEditMode(false)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [canEdit, isEditMode])

    return (
        <InlineEditContext.Provider value={{
            isEditMode,
            toggleEditMode,
            canEdit
        }}>
            {children}
        </InlineEditContext.Provider>
    )
}

export function useInlineEdit() {
    const context = useContext(InlineEditContext)
    if (context === undefined) {
        throw new Error('useInlineEdit must be used within an InlineEditProvider')
    }
    return context
}
