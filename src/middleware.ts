import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔒 Middleware checking:', pathname);

  // Allow access to login page and login API
  if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/check-session') {
    console.log('✅ Allowed: Login page/API');
    return NextResponse.next();
  }

  // Check for admin session cookie
  const adminSession = request.cookies.get('admin-session');
  console.log('🍪 Session cookie:', adminSession?.value);

  // If no session, redirect to login
  if (!adminSession || adminSession.value !== 'authenticated') {
    console.log('❌ No valid session - Redirecting to login');
    
    // For RSC requests, return 401 instead of redirect to avoid errors
    if (request.headers.get('RSC') === '1' || request.nextUrl.searchParams.has('_rsc')) {
      console.log('🔄 RSC request - returning 401');
      return new NextResponse(null, { status: 401 });
    }
    
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log('✅ Valid session - Allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

