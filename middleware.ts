import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const publicPaths = ['/login', '/register', '/explore'];
    const isPublic = publicPaths.some((p) => pathname.startsWith(p));

    const token = req.cookies.get('authjs.session-token') ||
        req.cookies.get('__Secure-authjs.session-token');

    const isLoggedIn = !!token;

    if (!isLoggedIn && !isPublic) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'],
};