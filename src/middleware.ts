import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const protectedPaths = ['/trade', '/dashboard', '/earn', '/portfolio'];
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isProtected) {
        const hasAccess = request.cookies.get('bondemi_access');

        if (!hasAccess) {
            // Redirect to Landing Page
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/trade/:path*', '/dashboard/:path*', '/earn/:path*', '/portfolio/:path*'],
};
