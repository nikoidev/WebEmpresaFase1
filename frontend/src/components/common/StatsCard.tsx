/**
 * Componente StatsCard con TypeScript avanzado
 * Ejemplo de migración de componente existente
 */

import React from 'react'
import { Card } from '@/components/ui'

// Props tipadas explícitamente
interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period: string
  }
  icon?: React.ReactNode
  loading?: boolean
  className?: string
}

// Mapeo de colores por tipo de cambio
const changeColors = {
  increase: 'text-green-600',
  decrease: 'text-red-600',
  neutral: 'text-gray-600'
} as const

/**
 * Tarjeta de estadísticas reutilizable
 * 
 * @example
 * <StatsCard
 *   title="Total Usuarios"
 *   value={1234}
 *   change={{ value: 12, type: 'increase', period: 'vs mes anterior' }}
 *   icon={<UsersIcon />}
 * />
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <Card.Content>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </Card.Content>
      </Card>
    )
  }

  return (
    <Card hover className={className}>
      <Card.Content>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 truncate">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <div className="flex items-center mt-1">
                <span className={`text-sm font-medium ${changeColors[change.type]}`}>
                  {change.type === 'increase' ? '+' : change.type === 'decrease' ? '-' : ''}
                  {Math.abs(change.value)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {change.period}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0">
              <div className="w-8 h-8 text-gray-400">
                {icon}
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}

export default StatsCard
