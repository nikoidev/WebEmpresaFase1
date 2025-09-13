/**
 * Componente Card reutilizable con TypeScript avanzado
 */

import React from 'react'

// Props del card con tipos explícitos
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  hover?: boolean
}

// Props para el header del card
interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

// Props para el contenido del card
interface CardContentProps {
  children: React.ReactNode
  className?: string
}

// Props para el footer del card
interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

// Mapeo de clases CSS por padding
const paddingClasses: Record<NonNullable<CardProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6'
}

// Mapeo de clases CSS por shadow
const shadowClasses: Record<NonNullable<CardProps['shadow']>, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg'
}

/**
 * Componente Card principal
 * 
 * @example
 * <Card padding="md" shadow="md" hover>
 *   <Card.Header>
 *     <h3>Título</h3>
 *   </Card.Header>
 *   <Card.Content>
 *     <p>Contenido</p>
 *   </Card.Content>
 * </Card>
 */
export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>
  Content: React.FC<CardContentProps>
  Footer: React.FC<CardFooterProps>
} = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false
}) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden'
  
  const classes = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    border ? 'border border-gray-200' : '',
    hover ? 'transition-shadow hover:shadow-lg' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

/**
 * Header del Card
 */
const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Contenido del Card
 */
const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Footer del Card
 */
const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`}>
      {children}
    </div>
  )
}

// Asignar componentes como propiedades del Card
Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter

export default Card
