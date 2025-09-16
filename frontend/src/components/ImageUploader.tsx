'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
    currentImageUrl?: string
    onImageChange: (imageUrl: string) => void
    maxWidth?: number
    maxHeight?: number
    quality?: number
    className?: string
}

export default function ImageUploader({
    currentImageUrl,
    onImageChange,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.8,
    className = ""
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            
            img.onload = () => {
                // Dimensiones originales
                const originalWidth = img.width
                const originalHeight = img.height
                
                // Calcular nuevas dimensiones manteniendo proporción
                let targetWidth = originalWidth
                let targetHeight = originalHeight
                
                if (targetWidth > maxWidth || targetHeight > maxHeight) {
                    const aspectRatio = originalWidth / originalHeight
                    
                    if (targetWidth > targetHeight) {
                        targetWidth = maxWidth
                        targetHeight = targetWidth / aspectRatio
                        
                        if (targetHeight > maxHeight) {
                            targetHeight = maxHeight
                            targetWidth = targetHeight * aspectRatio
                        }
                    } else {
                        targetHeight = maxHeight
                        targetWidth = targetHeight * aspectRatio
                        
                        if (targetWidth > maxWidth) {
                            targetWidth = maxWidth
                            targetHeight = targetWidth / aspectRatio
                        }
                    }
                }
                
                // Redimensionado de alta calidad (múltiples pasos si es necesario)
                let currentCanvas = canvas
                let currentCtx = ctx
                
                // Si la reducción es muy grande (más de 50%), usar múltiples pasos
                const reductionRatio = Math.min(targetWidth / originalWidth, targetHeight / originalHeight)
                
                if (reductionRatio < 0.5) {
                    // Primer paso: reducir a 50% del original
                    const intermediateWidth = originalWidth * 0.5
                    const intermediateHeight = originalHeight * 0.5
                    
                    const tempCanvas = document.createElement('canvas')
                    const tempCtx = tempCanvas.getContext('2d')
                    
                    tempCanvas.width = intermediateWidth
                    tempCanvas.height = intermediateHeight
                    
                    if (tempCtx) {
                        tempCtx.imageSmoothingEnabled = true
                        tempCtx.imageSmoothingQuality = 'high'
                        tempCtx.drawImage(img, 0, 0, intermediateWidth, intermediateHeight)
                    }
                    
                    // Segundo paso: del intermedio al tamaño final
                    currentCanvas.width = targetWidth
                    currentCanvas.height = targetHeight
                    
                    if (currentCtx) {
                        currentCtx.imageSmoothingEnabled = true
                        currentCtx.imageSmoothingQuality = 'high'
                        currentCtx.drawImage(tempCanvas, 0, 0, targetWidth, targetHeight)
                    }
                } else {
                    // Redimensionado directo para cambios menores
                    currentCanvas.width = targetWidth
                    currentCanvas.height = targetHeight
                    
                    if (currentCtx) {
                        currentCtx.imageSmoothingEnabled = true
                        currentCtx.imageSmoothingQuality = 'high'
                        currentCtx.drawImage(img, 0, 0, targetWidth, targetHeight)
                    }
                }
                
                // Usar PNG para imágenes pequeñas (mejor calidad sin compresión) o JPEG con alta calidad
                const shouldUsePNG = targetWidth <= 200 && targetHeight <= 200
                const finalQuality = Math.max(quality, 0.92) // Mínimo 92% de calidad
                
                const dataUrl = shouldUsePNG 
                    ? currentCanvas.toDataURL('image/png')
                    : currentCanvas.toDataURL('image/jpeg', finalQuality)
                    
                resolve(dataUrl)
            }
            
            img.onerror = reject
            img.src = URL.createObjectURL(file)
        })
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation() // Evitar que el evento se propague al modal padre
        event.preventDefault() // Prevenir el comportamiento por defecto
        const file = event.target.files?.[0]
        if (!file) return

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido')
            return
        }

        // Validar tamaño de archivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo es muy grande. Por favor selecciona una imagen menor a 5MB')
            return
        }

        setIsUploading(true)

        try {
            const resizedImageUrl = await resizeImage(file)
            setPreviewUrl(resizedImageUrl)
            onImageChange(resizedImageUrl)
        } catch (error) {
            console.error('Error al procesar la imagen:', error)
            alert('Error al procesar la imagen. Por favor intenta con otro archivo.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleRemoveImage = (event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation() // Evitar que el evento se propague al modal padre
            event.preventDefault() // Prevenir el comportamiento por defecto
        }
        setPreviewUrl('')
        onImageChange('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div 
            className={`space-y-2 ${className}`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            
            {previewUrl ? (
                <div className="relative">
                    <div className="rounded-full overflow-hidden mx-auto" style={{width: '200px', height: '200px'}}>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        onClick={(e) => handleRemoveImage(e)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        type="button"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        fileInputRef.current?.click()
                    }}
                    disabled={isUploading}
                    type="button"
                    className="rounded-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center mx-auto text-gray-500 hover:text-gray-700"
                    style={{width: '200px', height: '200px'}}
                >
                    {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                    ) : (
                        <>
                            <ImageIcon className="h-6 w-6 mb-1" />
                            <span className="text-xs text-center">Subir foto</span>
                        </>
                    )}
                </button>
            )}
            
            {!previewUrl && (
                <div className="text-center flex justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            fileInputRef.current?.click()
                        }}
                        disabled={isUploading}
                        type="button"
                        className="text-sm text-primary-600 hover:text-primary-700 disabled:text-gray-400"
                    >
                        {isUploading ? 'Procesando...' : 'Seleccionar imagen'}
                    </button>
                </div>
            )}
            
            <div className="text-xs text-gray-500 text-center">
                <p>Máximo: {maxWidth}x{maxHeight}px</p>
                <p>Formatos: JPG, PNG, GIF (max 5MB)</p>
            </div>
        </div>
    )
}
