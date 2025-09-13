/**
 * Componente Input reutilizable con TypeScript avanzado
 */

import React, { forwardRef } from 'react'

// Tipos para las variantes del input
type InputVariant = 'default' | 'error' | 'success'
type InputSize = 'sm' | 'md' | 'lg'

// Props del input con tipos explícitos
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  success?: string
  hint?: string
  variant?: InputVariant
  size?: InputSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
}

// Mapeo de clases CSS por variante
const variantClasses: Record<InputVariant, string> = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
}

// Mapeo de clases CSS por tamaño
const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-4 py-3 text-lg'
}

/**
 * Componente Input reutilizable con soporte para ref
 * 
 * @example
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   error={errors.email}
 *   placeholder="tu@email.com"
 * />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  hint,
  variant,
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  id,
  ...props
}, ref) => {
  // Determinar variante automáticamente si no se especifica
  const computedVariant: InputVariant = variant || (error ? 'error' : success ? 'success' : 'default')
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  const baseClasses = 'block w-full rounded-md border shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'
  
  const inputClasses = [
    baseClasses,
    variantClasses[computedVariant],
    sizeClasses[size],
    leftIcon ? 'pl-10' : '',
    rightIcon || isLoading ? 'pr-10' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">
              {leftIcon}
            </span>
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {/* Right icon or loading */}
        {(rightIcon || isLoading) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isLoading ? (
              <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <span className="text-gray-400 sm:text-sm">
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Messages */}
      {(error || success || hint) && (
        <div className="mt-1">
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm text-green-600">
              {success}
            </p>
          )}
          {hint && !error && !success && (
            <p className="text-sm text-gray-500">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
