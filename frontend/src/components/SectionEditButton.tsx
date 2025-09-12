'use client'

import { useState } from 'react'
import { Edit, Save, X } from 'lucide-react'
import { useInlineEdit } from '@/contexts/InlineEditContext'

interface SectionEditButtonProps {
    sectionName: string
    onEdit: () => void
    className?: string
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function SectionEditButton({ 
    sectionName, 
    onEdit,
    className = '',
    position = 'top-right'
}: SectionEditButtonProps) {
    const { canEdit } = useInlineEdit()
    const [isHovered, setIsHovered] = useState(false)

    if (!canEdit) return null

    const positionClasses = {
        'top-right': 'top-2 right-2',
        'top-left': 'top-2 left-2',
        'bottom-right': 'bottom-2 right-2',
        'bottom-left': 'bottom-2 left-2'
    }

    return (
        <div 
            className="absolute z-10"
            style={{ 
                [position.includes('top') ? 'top' : 'bottom']: '8px',
                [position.includes('right') ? 'right' : 'left']: '8px'
            }}
        >
            <button
                onClick={onEdit}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    bg-primary-600 hover:bg-primary-700 
                    text-white p-2 rounded-full shadow-lg 
                    transition-all duration-200 hover:scale-110
                    focus:outline-none focus:ring-2 focus:ring-primary-300
                    ${className}
                `}
                title={`Editar ${sectionName}`}
            >
                <Edit className="h-4 w-4" />
            </button>
            
            {isHovered && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                               bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    Editar {sectionName}
                </div>
            )}
        </div>
    )
}
