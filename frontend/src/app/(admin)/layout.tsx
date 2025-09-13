import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin - SEVP | Sistema Educativo Virtual Profesional',
    description: 'Panel de administración para gestionar contenido del sitio web SEVP.',
    robots: 'noindex, nofollow',
}

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
