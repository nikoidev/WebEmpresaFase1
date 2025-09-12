import { useState, useEffect } from 'react'
import { publicApi } from '@/lib/api'

interface CompanyStat {
    number: string
    label: string
    description?: string
}

interface CompanyStats {
    global_stats: CompanyStat[]
    success_metrics: CompanyStat[]
}

/**
 * Hook para obtener estadísticas globales de la empresa
 * Estas stats se comparten entre páginas como Historia, Clientes, etc.
 */
export function useCompanyStats() {
    const [stats, setStats] = useState<CompanyStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadCompanyStats()
    }, [])

    const loadCompanyStats = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Intentar obtener stats de la página company
            const response = await publicApi.getPageContent('company')
            setStats(response.data.content_json)
            
        } catch (err) {
            console.warn('No se pudieron cargar stats de company, usando fallback')
            
            // Fallback stats por defecto
            setStats({
                global_stats: [
                    { number: '500+', label: 'Instituciones', description: 'Instituciones educativas que confían en nosotros' },
                    { number: '100K+', label: 'Estudiantes', description: 'Estudiantes activos en nuestra plataforma' },
                    { number: '15', label: 'Países', description: 'Países donde operamos' },
                    { number: '99.9%', label: 'Satisfacción', description: 'Índice de satisfacción de clientes' }
                ],
                success_metrics: [
                    { number: '98%', label: 'Satisfacción del Cliente', description: 'Clientes satisfechos con nuestro servicio' },
                    { number: '45%', label: 'Reducción en Costos', description: 'Reducción promedio en costos operativos' },
                    { number: '300%', label: 'Aumento en Engagement', description: 'Incremento en engagement estudiantil' },
                    { number: '24/7', label: 'Soporte Técnico', description: 'Disponibilidad de soporte' }
                ]
            })
            
            setError('Usando datos por defecto')
        } finally {
            setLoading(false)
        }
    }

    const refreshStats = () => {
        loadCompanyStats()
    }

    return {
        stats,
        loading,
        error,
        refreshStats,
        globalStats: stats?.global_stats || [],
        successMetrics: stats?.success_metrics || []
    }
}
