'use client'

import { LogIn, Menu, X, Edit } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useInlineEdit } from '@/contexts/InlineEditContext'
import { publicApi } from '@/lib/api'
import UniversalSectionEditModal from '@/components/UniversalSectionEditModal'

interface SocialNetwork {
    name: string
    url: string
    icon: string
    platform: string
}

interface FooterContent {
    company?: {
        name?: string
        logo_letter?: string
        description?: string
    }
    social_networks?: SocialNetwork[]
    social_links?: {
        facebook?: string
        linkedin?: string
        twitter?: string
    }
    support?: {
        email?: string
        phone?: string
        hours?: string
    }
    copyright?: {
        text?: string
        year?: number
    }
    legal_links?: {
        privacy_policy?: string
        terms_of_service?: string
    }
}

interface PublicLayoutProps {
    children: React.ReactNode
}

// Función para obtener el icono SVG según la plataforma
const getSocialIcon = (iconType: string) => {
    switch (iconType) {
        case 'facebook':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
            )
        case 'twitter':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
            )
        case 'linkedin':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            )
        case 'instagram':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            )
        case 'youtube':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            )
        case 'github':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            )
        case 'whatsapp':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488" />
                </svg>
            )
        case 'telegram':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
            )
        case 'discord':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" />
                </svg>
            )
        case 'tiktok':
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
            )
        default:
            return (
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 6V8H5V19H16V14H18V20A1 1 0 0 1 17 21H4A1 1 0 0 1 3 20V7A1 1 0 0 1 4 6H10ZM21 3V11H19L15 7L11 11L9.5 9.5L13.5 5.5L17 9V3H21Z" />
                </svg>
            )
    }
}

// Componente para el botón de editar del footer
function FooterEditButton() {
    const { canEdit } = useInlineEdit()
    const [showModal, setShowModal] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    if (!canEdit) return null

    const handleEdit = () => {
        setShowModal(true)
    }

    return (
        <>
            <div className="absolute top-2 right-2 z-50">
                <button
                    onClick={handleEdit}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="bg-white hover:bg-gray-50 text-primary-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-300"
                    title="Editar Footer"
                >
                    <Edit className="h-4 w-4" />
                </button>
                
                {isHovered && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        Editar Footer
                    </div>
                )}
            </div>

            {showModal && (
                <UniversalSectionEditModal
                    isOpen={showModal}
                    sectionType="footer"
                    sectionName="Footer"
                    pageKey="footer"
                    initialContent={null}
                    onClose={() => setShowModal(false)}
                    onSave={async () => {
                        setShowModal(false)
                        // Recargar la página para mostrar los cambios  
                        window.location.reload()
                    }}
                />
            )}
        </>
    )
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [footerContent, setFooterContent] = useState<FooterContent | null>(null)
    const [navigation, setNavigation] = useState([
        { name: 'Inicio', href: '/', icon: 'Home' },
        { name: 'Nosotros', href: '/nosotros', icon: 'Users' },
        { name: 'Historia', href: '/historia', icon: 'History' },
        { name: 'Clientes', href: '/clientes', icon: 'Globe' },
        { name: 'Precios', href: '/precios', icon: 'DollarSign' },
        { name: 'Contacto', href: '/contacto', icon: 'Mail' },
    ])

    useEffect(() => {
        loadFooterContent()
        loadNavigationContent()
    }, [])

    const loadFooterContent = async () => {
        try {
            const response = await publicApi.getPageContent('footer')
            if (response.data?.content_json) {
                setFooterContent(response.data.content_json)
            }
        } catch (error) {
            console.error('Error loading footer content:', error)
            // Usar contenido por defecto si no existe
            setFooterContent({
                company: {
                    name: 'SEVP',
                    logo_letter: 'S',
                    description: 'Sistema Educativo Virtual Profesional - La plataforma más completa para transformar la gestión educativa de tu institución.'
                },
                social_links: {
                    facebook: '#',
                    linkedin: '#',
                    twitter: '#'
                },
                support: {
                    email: 'soporte@sevp.com',
                    phone: '+51 999 999 999',
                    hours: 'Lun - Vie: 9:00 - 18:00'
                },
                copyright: {
                    text: 'SEVP. Todos los derechos reservados.',
                    year: new Date().getFullYear()
                },
                legal_links: {
                    privacy_policy: '/privacidad',
                    terms_of_service: '/terminos'
                }
            })
        }
    }

    const loadNavigationContent = async () => {
        try {
            const response = await publicApi.getPageContent('navigation')
            if (response.data?.content_json?.navigation_items) {
                setNavigation(response.data.content_json.navigation_items)
            }
            
            // También cargar datos de marca si existen
            if (response.data?.content_json?.brand) {
                const brand = response.data.content_json.brand
                setFooterContent(prev => ({
                    ...prev,
                    company: {
                        ...prev?.company,
                        name: brand.companyName || prev?.company?.name || 'SEVP',
                        logo_letter: brand.logoLetter || prev?.company?.logo_letter || 'S'
                    }
                }))
                console.log('✅ Datos de marca actualizados desde navegación:', brand)
            }
        } catch (error) {
            console.error('Error loading navigation content:', error)
            // Usar navegación por defecto si no se puede cargar
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-xl">
                                        {footerContent?.company?.logo_letter || 'S'}
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-gray-900">
                                    {footerContent?.company?.name || 'SEVP'}
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Admin Access Button */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/admin/login"
                                className="flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Acceso Admin
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <div className="flex flex-col space-y-4">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/admin/login"
                                    className="flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors pt-4 border-t border-gray-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Acceso Admin
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white relative">
                <FooterEditButton />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-white font-bold text-xl">
                                        {footerContent?.company?.logo_letter || 'S'}
                                    </span>
                                </div>
                                <span className="text-xl font-bold text-white">
                                    {footerContent?.company?.name || 'SEVP'}
                                </span>
                            </div>
                            <p className="text-white mb-4 max-w-md">
                                {footerContent?.company?.description || 'Sistema Educativo Virtual Profesional - La plataforma más completa para transformar la gestión educativa de tu institución.'}
                            </p>
                            <div className="flex space-x-4">
                                {/* Nuevas redes sociales dinámicas */}
                                {footerContent?.social_networks?.map((network, index) => (
                                    <a 
                                        key={index}
                                        href={network.url} 
                                        className="text-gray-400 hover:text-white transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="sr-only">{network.name}</span>
                                        {getSocialIcon(network.icon)}
                                    </a>
                                ))}
                                
                                {/* Fallback a la estructura antigua si no existe la nueva */}
                                {(!footerContent?.social_networks || footerContent.social_networks.length === 0) && (
                                    <>
                                        {footerContent?.social_links?.facebook && (
                                            <a href={footerContent.social_links.facebook} className="text-gray-400 hover:text-white transition-colors">
                                                <span className="sr-only">Facebook</span>
                                                {getSocialIcon('facebook')}
                                            </a>
                                        )}
                                        {footerContent?.social_links?.linkedin && (
                                            <a href={footerContent.social_links.linkedin} className="text-gray-400 hover:text-white transition-colors">
                                                <span className="sr-only">LinkedIn</span>
                                                {getSocialIcon('linkedin')}
                                            </a>
                                        )}
                                        {footerContent?.social_links?.twitter && (
                                            <a href={footerContent.social_links.twitter} className="text-gray-400 hover:text-white transition-colors">
                                                <span className="sr-only">Twitter</span>
                                                {getSocialIcon('twitter')}
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">Navegación</h3>
                            <ul className="space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-white hover:text-gray-200 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-white">Soporte</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a 
                                        href={`mailto:${footerContent?.support?.email || 'soporte@sevp.com'}`} 
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        {footerContent?.support?.email || 'soporte@sevp.com'}
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href={`tel:${footerContent?.support?.phone?.replace(/\s/g, '') || '+51999999999'}`} 
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        {footerContent?.support?.phone || '+51 999 999 999'}
                                    </a>
                                </li>
                                <li>
                                    <span className="text-white">
                                        {footerContent?.support?.hours || 'Lun - Vie: 9:00 - 18:00'}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-white text-sm">
                            © {footerContent?.copyright?.year || new Date().getFullYear()} {footerContent?.copyright?.text || 'SEVP. Todos los derechos reservados.'}
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link 
                                href={footerContent?.legal_links?.privacy_policy || '/privacidad'} 
                                className="text-white hover:text-gray-200 text-sm transition-colors"
                            >
                                Política de Privacidad
                            </Link>
                            <Link 
                                href={footerContent?.legal_links?.terms_of_service || '/terminos'} 
                                className="text-white hover:text-gray-200 text-sm transition-colors"
                            >
                                Términos de Uso
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
