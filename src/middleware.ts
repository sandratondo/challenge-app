import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Handle API routes
  if (path.startsWith('/api/')) {
    // Add CORS headers for API routes
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register';

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // Verify token if it exists
  let isValidToken = false;
  if (token) {
    try {
      verify(token, process.env.JWT_SECRET || "your-secret-key");
      isValidToken = true;
    } catch (error) {
      // Token is invalid or expired
      isValidToken = false;
    }
  }

  // Redirect logic
  if (isPublicPath && isValidToken) {
    // If user is logged in and tries to access login/register, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !isValidToken) {
    // If user is not logged in and tries to access protected routes, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is not logged in and tries to access root path, redirect to login
  if (path === '/' && !isValidToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and tries to access root path, redirect to dashboard
  if (path === '/' && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/api/:path*',
  ],
}; 