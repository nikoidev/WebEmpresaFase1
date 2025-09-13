/**
 * Tipos específicos para APIs
 */

// Respuestas estándar de la API
export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

// Tipos para paginación
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Tipos para filtros y ordenamiento
export interface ApiFilters {
  search?: string
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Tipos para endpoints específicos
export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  user: import('./index').User
}

export interface PageContentResponse {
  id: number
  page_key: string
  title: string
  content_json: Record<string, any>
  meta_title: string
  meta_description: string
  meta_keywords: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessageResponse {
  id: number
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'responded' | 'closed'
  admin_response: string
  responded_at?: string
  assigned_to_id?: number
  created_at: string
  updated_at: string
}
