import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'SEVP - Sistema Educativo Virtual Profesional',
    description: 'Plataforma educativa completa para instituciones. Gestión de estudiantes, cursos, calificaciones y más.',
    keywords: ['SEVP', 'educativo', 'plataforma', 'estudiantes', 'cursos', 'calificaciones'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
}
