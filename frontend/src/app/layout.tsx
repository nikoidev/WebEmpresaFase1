import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { InlineEditProvider } from '@/contexts/InlineEditContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SEVP - Sistema Educativo Virtual Profesional',
  description: 'Plataforma educativa completa para instituciones educativas modernas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <InlineEditProvider>
            {children}
          </InlineEditProvider>
        </AuthProvider>
      </body>
    </html>
  )
}