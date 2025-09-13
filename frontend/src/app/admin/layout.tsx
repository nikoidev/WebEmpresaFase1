'use client'

import { usePathname } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import { InlineEditProvider } from '@/contexts/InlineEditContext'

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    
    // Si es la página de login, no aplicar el layout de admin
    if (pathname === '/admin/login') {
        return (
            <AuthProvider>
                {children}
            </AuthProvider>
        )
    }
    
    // Para todas las demás páginas de admin, aplicar el layout completo
    return (
        <AuthProvider>
            <InlineEditProvider>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </InlineEditProvider>
        </AuthProvider>
    )
}
