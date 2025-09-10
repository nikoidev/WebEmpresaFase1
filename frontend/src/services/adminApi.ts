import api from '@/lib/api'
import type {
    CompanyInfo,
    ContactMessage,
    FAQ,
    LoginFormData,
    NewsArticle,
    ServicePlan,
    Testimonial,
    User
} from '@/types'

// Authentication
export const login = async (credentials: LoginFormData) => {
    return await api.post('/api/auth/login/', credentials)
}

export const logout = async () => {
    return await api.post('/api/auth/logout/')
}

export const getCurrentUser = async (): Promise<{ data: User }> => {
    return await api.get('/api/auth/user/')
}

// News Management
export const getNews = async () => {
    return await api.get('/api/admin/news/')
}

export const getNewsById = async (id: number) => {
    return await api.get(`/api/admin/news/${id}/`)
}

export const createNews = async (news: Partial<NewsArticle>) => {
    return await api.post('/api/admin/news/', news)
}

export const updateNews = async (id: number, news: Partial<NewsArticle>) => {
    return await api.put(`/api/admin/news/${id}/`, news)
}

export const deleteNews = async (id: number) => {
    return await api.delete(`/api/admin/news/${id}/`)
}

// Service Plans Management
export const getPlans = async () => {
    return await api.get('/api/admin/plans/')
}

export const getPlanById = async (id: number) => {
    return await api.get(`/api/admin/plans/${id}/`)
}

export const createPlan = async (plan: Partial<ServicePlan>) => {
    return await api.post('/api/admin/plans/', plan)
}

export const updatePlan = async (id: number, plan: Partial<ServicePlan>) => {
    return await api.put(`/api/admin/plans/${id}/`, plan)
}

export const deletePlan = async (id: number) => {
    return await api.delete(`/api/admin/plans/${id}/`)
}

// Testimonials Management
export const getTestimonials = async () => {
    return await api.get('/api/admin/testimonials/')
}

export const getTestimonialById = async (id: number) => {
    return await api.get(`/api/admin/testimonials/${id}/`)
}

export const createTestimonial = async (testimonial: Partial<Testimonial>) => {
    return await api.post('/api/admin/testimonials/', testimonial)
}

export const updateTestimonial = async (id: number, testimonial: Partial<Testimonial>) => {
    return await api.put(`/api/admin/testimonials/${id}/`, testimonial)
}

export const deleteTestimonial = async (id: number) => {
    return await api.delete(`/api/admin/testimonials/${id}/`)
}

// FAQs Management
export const getFAQs = async () => {
    return await api.get('/api/admin/faqs/')
}

export const getFAQById = async (id: number) => {
    return await api.get(`/api/admin/faqs/${id}/`)
}

export const createFAQ = async (faq: Partial<FAQ>) => {
    return await api.post('/api/admin/faqs/', faq)
}

export const updateFAQ = async (id: number, faq: Partial<FAQ>) => {
    return await api.put(`/api/admin/faqs/${id}/`, faq)
}

export const deleteFAQ = async (id: number) => {
    return await api.delete(`/api/admin/faqs/${id}/`)
}

// Contact Messages Management
export const getContactMessages = async () => {
    return await api.get('/api/admin/contact-messages/')
}

export const getContactMessageById = async (id: number) => {
    return await api.get(`/api/admin/contact-messages/${id}/`)
}

export const updateContactMessage = async (id: number, message: Partial<ContactMessage>) => {
    return await api.put(`/api/admin/contact-messages/${id}/`, message)
}

export const deleteContactMessage = async (id: number) => {
    return await api.delete(`/api/admin/contact-messages/${id}/`)
}

// Company Info Management
export const getCompanyInfo = async () => {
    return await api.get('/api/admin/company/')
}

export const updateCompanyInfo = async (id: number, info: Partial<CompanyInfo>) => {
    return await api.put(`/api/admin/company/${id}/`, info)
}

export default {
    // Auth
    login,
    logout,
    getCurrentUser,

    // News
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,

    // Plans
    getPlans,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,

    // Testimonials
    getTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,

    // FAQs
    getFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ,

    // Contact Messages
    getContactMessages,
    getContactMessageById,
    updateContactMessage,
    deleteContactMessage,

    // Company Info
    getCompanyInfo,
    updateCompanyInfo
}
