/**
 * Hook personalizado para llamadas a API con TypeScript avanzado
 */

import { useState, useEffect, useCallback } from 'react'

// Tipos para el estado de la API
interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// Opciones para el hook
interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

// Tipo para funciones de API
type ApiFunction<T> = () => Promise<T>

/**
 * Hook para manejar llamadas a API con estado de loading y error
 * 
 * @example
 * const { data, loading, error, execute } = useApi(
 *   () => fetch('/api/users').then(res => res.json()),
 *   { immediate: true }
 * )
 */
export function useApi<T>(
  apiFunction: ApiFunction<T>,
  options: UseApiOptions = {}
): ApiState<T> & { execute: () => Promise<void>; reset: () => void } {
  const { immediate = false, onSuccess, onError } = options

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await apiFunction()
      setState({ data: result, loading: false, error: null })
      onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setState({ data: null, loading: false, error: errorMessage })
      onError?.(errorMessage)
    }
  }, [apiFunction, onSuccess, onError])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return {
    ...state,
    execute,
    reset
  }
}
