import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')
    const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/mdeicines') ||
        request.nextUrl.pathname.startsWith('/orders') ||
        request.nextUrl.pathname.startsWith('/reports')

    if (isProtectedPage && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/medicines/:path*', '/orders/:path*', '/reports/:path*', '/login', '/register']
}