/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002',
    },
    images: {
        domains: ['localhost', '127.0.0.1'],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/api/:path*`,
            },
        ];
    },
    // Configuración para desarrollo - permite acceso desde diferentes IPs de la red local
    // Nota: allowedDevOrigins se maneja automáticamente en Next.js moderno
}

module.exports = nextConfig
