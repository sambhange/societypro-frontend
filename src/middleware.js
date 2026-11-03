import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/resident-login', '/register', '/offline', '/superadmin/login'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/icons/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token     = request.cookies.get('token')?.value;
  const userType  = request.cookies.get('userType')?.value;

  // ── Super Admin routes (/superadmin/*)
  if (pathname.startsWith('/superadmin')) {
    if (!token || userType !== 'super_admin') {
      return NextResponse.redirect(new URL('/superadmin/login', request.url));
    }
    return NextResponse.next();
  }

  // ── Resident routes (/resident/*)
  if (pathname.startsWith('/resident')) {
    const residentToken = request.cookies.get('residentToken')?.value;
    if (!residentToken && !token) {
      return NextResponse.redirect(new URL('/resident-login', request.url));
    }
    return NextResponse.next();
  }

  // ── All other protected routes (dashboard, settings, etc.)
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
