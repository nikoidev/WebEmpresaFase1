'use client'

import { publicApi } from '@/lib/api'
import { useEffect, useState } from 'react'
import SectionEditModal from './SectionEditModal'

interface HomepageHeroModalProps {
    isOpen: boolean
    onClose: () => void
    onSave?: () => Promise<void>
}

/**
 * Modal específico para la sección Hero de Homepage
 * Usa exactamente la misma lógica que HomePage para consistencia total
 */
export default function HomepageHeroModal({ isOpen, onClose, onSave }: HomepageHeroModalProps) {
    const [fullPageContent, setFullPageContent] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            loadContent()
        }
    }, [isOpen])

    const loadContent = async () => {
        setIsLoading(true)
        try {
            console.log('🔄 HomepageHeroModal - Cargando contenido fresco...')
            const response = await publicApi.getPageContent('homepage')
            setFullPageContent(response.data)
            console.log('✅ HomepageHeroModal - Contenido cargado:', response.data)
        } catch (error) {
            console.error('❌ Error cargando contenido:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSectionSave = async () => {
        console.log('🔄 HomepageHeroModal - handleSectionSave ejecutándose...')
        
        // Recargar contenido después de guardar
        await loadContent()
        
        // Llamar callback externo si existe (para actualizar admin)
        if (onSave) {
            await onSave()
        }
        
        console.log('✅ HomepageHeroModal - Guardado completado')
        onClose()
    }

    if (!isOpen || !fullPageContent || isLoading) {
        return null
    }

    return (
        <SectionEditModal
            isOpen={isOpen}
            onClose={onClose}
            sectionType="hero"
            pageKey="homepage"
            initialContent={fullPageContent} // ← Mismo objeto que HomePage
            onSave={handleSectionSave}       // ← Misma lógica que HomePage
        />
    )
}
