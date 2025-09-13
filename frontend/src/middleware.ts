import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    // Permitir acceso directo a /admin/login sin verificación
    if (request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next()
    }

    // Check if this is an admin route (pero no login)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check if user has auth token
        const authToken = request.cookies.get('authToken')

        if (!authToken) {
            // Redirect to login if no token
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*'
    ]
}
