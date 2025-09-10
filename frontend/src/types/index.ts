// Tipos de datos para la aplicación

export interface User {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    is_staff: boolean
    is_superuser: boolean
}

export interface NewsArticle {
    id: number
    title: string
    slug: string
    content: string
    excerpt: string
    featured_image?: string
    status: 'draft' | 'published' | 'archived'
    meta_description?: string
    meta_keywords?: string
    published_at?: string
    created_at: string
    updated_at: string
    views_count: number
    featured: boolean
}

export interface ServicePlan {
    id: number
    name: string
    slug: string
    description: string
    price_monthly: number
    price_yearly?: number
    max_users: number
    max_courses: number
    storage_gb: number
    api_requests_limit: number
    features: string[]
    is_active: boolean
    is_popular: boolean
    display_order: number
    color_primary: string
    color_secondary: string
    monthly_savings: number
    created_at: string
    updated_at: string
}

export interface Testimonial {
    id: number
    client_name: string
    client_position: string
    client_company: string
    content: string
    rating: number
    client_photo?: string
    is_active: boolean
    is_featured: boolean
    display_order: number
    created_at: string
    updated_at: string
}

export interface FAQ {
    id: number
    question: string
    answer: string
    category: 'general' | 'pricing' | 'technical' | 'support' | 'billing'
    is_active: boolean
    display_order: number
    views_count: number
    helpful_votes: number
    created_at: string
    updated_at: string
}

export interface CompanyInfo {
    id: number
    company_name: string
    tagline: string
    description: string
    email: string
    phone: string
    address: string
    website?: string
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
    logo?: string
    hero_image?: string
    meta_title: string
    meta_description: string
}

export interface ContactMessage {
    id: number
    name: string
    email: string
    phone?: string
    company?: string
    subject: string
    message: string
    status: 'new' | 'in_progress' | 'responded' | 'closed'
    assigned_to?: User
    admin_response?: string
    responded_at?: string
    created_at: string
    updated_at: string
}

export interface HomepageContent {
    featured_articles: NewsArticle[]
    featured_testimonials: Testimonial[]
    company_info: CompanyInfo | null
}

export interface PublicStats {
    total_articles: number
    total_testimonials: number
    total_faqs: number
    featured_articles: number
}

// Formularios
export interface ContactFormData {
    name: string
    email: string
    phone?: string
    company?: string
    subject: string
    message: string
}

export interface LoginFormData {
    username: string
    password: string
}

// Estados de carga
export interface LoadingState {
    isLoading: boolean
    error: string | null
}

// Contexto de autenticación
export interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: LoginFormData) => Promise<void>
    logout: () => void
}

// Metadatos SEO
export interface SEOMetadata {
    title: string
    description: string
    keywords?: string
    image?: string
    url?: string
    type?: 'website' | 'article'
}
