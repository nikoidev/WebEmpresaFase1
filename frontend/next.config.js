/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002',
    },
    images: {
        domains: ['localhost', '127.0.0.1', '172.22.48.1'],
    },
    // Permitir cross-origin requests para desarrollo
    allowedDevOrigins: [
        'http://localhost:3001',
        'http://127.0.0.1:3001', 
        'http://172.22.48.1:3001'
    ],
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'}/api/:path*`,
            },
        ];
    }
}

module.exports = nextConfig
