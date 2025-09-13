/**
 * Layout para páginas públicas
 * Aplica el layout público a todas las rutas dentro del grupo (public)
 */

import PublicLayout from '@/components/layout/PublicLayout'

interface PublicGroupLayoutProps {
  children: React.ReactNode
}

export default function PublicGroupLayout({ children }: PublicGroupLayoutProps) {
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  )
}
