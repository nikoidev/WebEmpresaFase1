'use client'

interface DevFileInfoProps {
    filePath: string
    className?: string
}

export default function DevFileInfo({ filePath, className = "" }: DevFileInfoProps) {
    // Solo mostrar en modo desarrollo
    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className={`bg-blue-50 border-l-4 border-blue-400 px-4 py-2 text-xs mb-4 ${className}`}>
            <span className="text-blue-800 font-mono">
                📄 Page: {filePath}
            </span>
        </div>
    )
}
