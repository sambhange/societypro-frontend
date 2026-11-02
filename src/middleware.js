import { NextResponse } from 'next/server';

// Pages that don't need login
const PUBLIC_PATHS = [
  '/',
  '/resident-login',
  '/register',
  '/offline',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.') // static files like .png, .ico, .js
  ) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get('token')?.value;
  const userType = request.cookies.get('userType')?.value;

  // Resident pages — check resident login
  if (pathname.startsWith('/resident')) {
    const residentToken = request.cookies.get('residentToken')?.value;
    if (!residentToken) {
      return NextResponse.redirect(new URL('/resident-login', request.url));
    }
    return NextResponse.next();
  }

  // Admin pages — check admin token
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
