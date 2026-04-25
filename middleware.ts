import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminSession, getParticipantSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  
  console.log('Current Path:', currentPath);
  
  // Ignore static assets, images, and API routes
  if (
    currentPath.startsWith('/_next') ||
    currentPath.startsWith('/api') ||
    currentPath.startsWith('/favicon.ico') ||
    /\.(jpg|jpeg|png|gif|svg|ico|css|js)$/i.test(currentPath) // Skip files with extensions
  ) {
    console.log('Ignoring static asset:', currentPath);
    return NextResponse.next();
  }

  // Check admin dashboard routes
  if (currentPath.startsWith('/admin-dashboard')) {
    const adminSession = await getAdminSession();
    if (!adminSession) {
      console.log('REDIRECTING: No valid admin session found for admin-dashboard path');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    console.log('ALLOWING: Valid admin session for:', adminSession.username);
    return NextResponse.next();
  }

  // Check participant dashboard routes
  if (currentPath.startsWith('/dashboard')) {
    const participantSession = await getParticipantSession();
    if (!participantSession) {
      console.log('REDIRECTING: No valid participant session found for dashboard path');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('ALLOWING: Valid participant session for:', participantSession.username);
    return NextResponse.next();
  }

  // Allow all other requests
  console.log('ALLOWING: Not a protected route');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.jpg$|.*\\.png$).*)']
};
