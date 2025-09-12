'use client'

import SectionEditButton from '../SectionEditButton'

interface SectionBasedHomepageEditorProps {
    content: any
    onChange: (content: any) => void
}

export default function SectionBasedHomepageEditor({ 
    content, 
    onChange 
}: SectionBasedHomepageEditorProps) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                    {/* Información del sistema */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                            🏠 Editor de Página de Inicio - Sistema por Secciones
                        </h3>
                        <p className="text-blue-700 text-sm">
                            Esta página usa el mismo sistema de edición por secciones que las demás páginas públicas.
                            Cada sección se puede editar individualmente usando los mismos modales que aparecen en la página pública.
                        </p>
                    </div>

                    {/* Sección Hero */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Sección Hero</h3>
                                <p className="text-sm text-gray-600">
                                    Título principal, subtítulo, descripción y slideshow multimedia
                                </p>
                            </div>
                            <SectionEditButton 
                                sectionName="Sección Hero"
                                sectionType="hero"
                                pageKey="homepage"
                                content={content}
                                onChange={onChange}
                                variant="primary"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="space-y-2">
                                <p><strong>Título:</strong> {content.hero_title || 'Sin configurar'}</p>
                                <p><strong>Subtítulo:</strong> {content.hero_subtitle || 'Sin configurar'}</p>
                                <p><strong>Descripción:</strong> {content.hero_description || 'Sin configurar'}</p>
                                <p><strong>Multimedia:</strong> 
                                    {content.hero?.slideshow?.length > 0 
                                        ? `${content.hero.slideshow.length} elementos en slideshow`
                                        : content.hero?.image_url 
                                        ? 'Imagen configurada'
                                        : content.hero?.video_url 
                                        ? 'Video configurado'
                                        : 'Sin multimedia'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sección Características */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Características</h3>
                                <p className="text-sm text-gray-600">
                                    Funcionalidades principales del sistema
                                </p>
                            </div>
                            <SectionEditButton 
                                sectionName="Características"
                                sectionType="features"
                                pageKey="homepage"
                                content={content}
                                onChange={onChange}
                                variant="secondary"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p><strong>Características configuradas:</strong> {content.features?.length || 0}</p>
                            {content.features?.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {content.features.slice(0, 3).map((feature: any, index: number) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            • {feature.title || `Característica ${index + 1}`}
                                        </li>
                                    ))}
                                    {content.features.length > 3 && (
                                        <li className="text-sm text-gray-500">
                                            ... y {content.features.length - 3} más
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Sección CTA */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Call to Action</h3>
                                <p className="text-sm text-gray-600">
                                    Llamada a la acción principal
                                </p>
                            </div>
                            <SectionEditButton 
                                sectionName="Call to Action"
                                sectionType="cta"
                                pageKey="homepage"
                                content={content}
                                onChange={onChange}
                                variant="accent"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="space-y-2">
                                <p><strong>Título:</strong> {content.call_to_action?.title || 'Sin configurar'}</p>
                                <p><strong>Descripción:</strong> {content.call_to_action?.description || 'Sin configurar'}</p>
                                <p><strong>Botón:</strong> {content.call_to_action?.button_text || 'Sin configurar'}</p>
                                <p><strong>Enlace:</strong> {content.call_to_action?.button_link || 'Sin configurar'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Estadísticas</h3>
                                <p className="text-sm text-gray-600">
                                    Números de impacto y métricas destacadas
                                </p>
                            </div>
                            <SectionEditButton 
                                sectionName="Estadísticas"
                                sectionType="stats"
                                pageKey="homepage"
                                content={content}
                                onChange={onChange}
                                variant="info"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p><strong>Estadísticas configuradas:</strong> 
                                {content.stats && typeof content.stats === 'object' && Object.keys(content.stats).length > 0
                                    ? Object.keys(content.stats).length
                                    : 0
                                }
                            </p>
                        </div>
                    </div>

                    {/* Testimonios */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Testimonios</h3>
                                <p className="text-sm text-gray-600">
                                    Testimonios de clientes destacados
                                </p>
                            </div>
                            <SectionEditButton 
                                sectionName="Testimonios"
                                sectionType="testimonials"
                                pageKey="homepage"
                                content={content}
                                onChange={onChange}
                                variant="success"
                            />
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p><strong>Testimonios configurados:</strong> {content.testimonials?.length || 0}</p>
                            {content.testimonials?.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {content.testimonials.slice(0, 2).map((testimonial: any, index: number) => (
                                        <li key={index} className="text-sm text-gray-600">
                                            • {testimonial.author || `Testimonio ${index + 1}`}
                                        </li>
                                    ))}
                                    {content.testimonials.length > 2 && (
                                        <li className="text-sm text-gray-500">
                                            ... y {content.testimonials.length - 2} más
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
