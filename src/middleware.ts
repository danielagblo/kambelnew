import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and login API
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // Let Next.js RSC fetches / router resource requests pass through without redirecting.
  // These requests include the `_rsc` query param (e.g. `?_rsc=karnu`) and should not
  // be redirected to the login page by middleware because the client expects a component
  // payload (redirecting returns HTML and causes fetch failures).
  if (request.nextUrl.searchParams.has('_rsc')) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const adminSession = request.cookies.get('admin-session');

  // If no session, redirect to login
  if (!adminSession || adminSession.value !== 'authenticated') {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

