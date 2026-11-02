import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/resident-login', '/register', '/offline'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/icons/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (pathname.startsWith('/resident')) {
    const residentToken = request.cookies.get('residentToken')?.value;
    if (!residentToken && !token) {
      return NextResponse.redirect(new URL('/resident-login', request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
