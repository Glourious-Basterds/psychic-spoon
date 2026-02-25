import { auth } from '@/lib/auth/config';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth?.user;

    // Percorsi pubblici
    const publicPaths = ['/login', '/register', '/explore'];
    const isPublic = publicPaths.some((p) => pathname.startsWith(p));

    if (!isLoggedIn && !isPublic) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (isLoggedIn && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!_next|api/auth|favicon.ico|.*\\..*).*)'],
};
