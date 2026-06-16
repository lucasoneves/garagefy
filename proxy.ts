import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('garagefy_token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/', '/my-garage', '/expenses', '/logbook', '/add-fuel', '/services', '/settings'];
  const isProtected = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
