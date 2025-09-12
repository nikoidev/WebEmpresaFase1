'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

interface SlideItem {
    type: 'image' | 'video'
    url: string
    alt?: string
}

interface HeroSlideshowProps {
    slides: SlideItem[]
    autoPlayInterval?: number // segundos
    className?: string
}

export default function HeroSlideshow({ 
    slides, 
    autoPlayInterval = 5, 
    className = '' 
}: HeroSlideshowProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isHovered, setIsHovered] = useState(false)

    // Función para ir al siguiente slide
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [slides.length])

    // Función para ir al slide anterior
    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [slides.length])

    // Auto-play funcionalidad
    useEffect(() => {
        if (!isPlaying || isHovered || slides.length <= 1) return

        const interval = setInterval(nextSlide, autoPlayInterval * 1000)
        return () => clearInterval(interval)
    }, [isPlaying, isHovered, nextSlide, autoPlayInterval, slides.length])

    // Función para renderizar YouTube embed
    const renderYouTubeEmbed = (url: string) => {
        let videoId = ''
        if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0]
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0]
        }
        
        return (
            <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                style={{ 
                    border: 'none',
                    display: 'block'
                }}
            />
        )
    }

    // Si no hay slides, mostrar placeholder
    if (!slides || slides.length === 0) {
        return (
            <div className={`bg-white/10 rounded-lg h-96 flex items-center justify-center ${className}`}>
                <div className="text-center text-white/50">
                    <Play className="h-16 w-16 mx-auto mb-2" />
                    <p>No hay contenido multimedia</p>
                </div>
            </div>
        )
    }

    const currentSlideData = slides[currentSlide]
    
    // Detectar automáticamente el tipo si no está especificado correctamente
    const isYouTube = currentSlideData.url.includes('youtube.com') || currentSlideData.url.includes('youtu.be')
    const isVideoUrl = isYouTube || 
                      currentSlideData.url.includes('.mp4') || 
                      currentSlideData.url.includes('.webm') || 
                      currentSlideData.url.includes('.ogg') ||
                      currentSlideData.url.includes('.mov') ||
                      currentSlideData.type === 'video'
    
    // Determinar el tipo real basándose en la URL
    const actualType = isVideoUrl ? 'video' : 'image'

    return (
        <div 
            className={`relative flex items-center justify-center ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
                width: '900px',
                height: '450px',
                maxWidth: '100%'
            }}
        >
            {/* Contenido del slide actual */}
            {actualType === 'image' ? (
                <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden flex items-center justify-center">
                    <img
                        src={currentSlideData.url}
                        alt={currentSlideData.alt || `Slide ${currentSlide + 1}`}
                        className="block rounded-lg"
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '900px',
                            maxHeight: '450px',
                            objectFit: 'contain',
                            display: 'block'
                        }}
                        onError={(e) => {
                            console.error('Error loading image:', currentSlideData.url)
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                </div>
            ) : actualType === 'video' ? (
                isYouTube ? (
                    <div 
                        className="w-full h-full rounded-lg overflow-hidden shadow-2xl"
                        style={{ 
                            maxWidth: '900px',
                            maxHeight: '450px'
                        }}
                    >
                        {renderYouTubeEmbed(currentSlideData.url)}
                    </div>
                ) : (
                    <video
                        className="block rounded-lg shadow-2xl"
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '900px',
                            maxHeight: '450px',
                            objectFit: 'contain'
                        }}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls={false}
                        preload="metadata"
                        onError={(e) => {
                            console.error('Error loading video:', currentSlideData.url)
                            e.currentTarget.style.display = 'none'
                        }}
                    >
                        <source src={currentSlideData.url} type="video/mp4" />
                        <source src={currentSlideData.url} type="video/webm" />
                        <source src={currentSlideData.url} type="video/ogg" />
                    </video>
                )
            ) : null}

            {/* Flechas de navegación */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        style={{ opacity: isHovered ? 1 : 0.7 }}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                        style={{ opacity: isHovered ? 1 : 0.7 }}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Indicadores de posición */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentSlide 
                                    ? 'bg-white' 
                                    : 'bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Control de play/pause */}
            {slides.length > 1 && (
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                    style={{ opacity: isHovered ? 1 : 0.5 }}
                >
                    {isPlaying ? (
                        <Pause className="h-4 w-4" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                </button>
            )}

            {/* Overlay con información del slide actual */}
            {slides.length > 1 && isHovered && (
                <div className="absolute bottom-16 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    {currentSlide + 1} / {slides.length}
                </div>
            )}
        </div>
    )
}
