import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];
const AUTH_PATHS = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth token from cookie (set by client on login)
  const token = request.cookies.get('hub-auth-token')?.value;
  const isLoggedIn = Boolean(token);

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn && !PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder (locales, images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|locales|.*\\..*).*)' ,
  ],
};
