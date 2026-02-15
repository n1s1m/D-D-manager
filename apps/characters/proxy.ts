import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CHARACTERS_PATH = '/characters';
const LOGIN_PATH = '/login';

const protectedRoutes = ['/characters'];
const publicAuthRoutes = ['/login', '/signup'];

function isProtectedRoute(path: string): boolean {
  return (
    path === CHARACTERS_PATH || path.startsWith(CHARACTERS_PATH + '/')
  );
}

function isPublicAuthRoute(path: string): boolean {
  return (
    publicAuthRoutes.includes(path) || path.startsWith(LOGIN_PATH + '/') || path.startsWith('/signup/')
  );
}

export default async function proxy(req: NextRequest) {
  const response = NextResponse.next({ request: req });
  const path = req.nextUrl.pathname;
  const isProtected = isProtectedRoute(path);
  const isPublicAuth = isPublicAuthRoute(path);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options ?? {})
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    loginUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicAuth && user) {
    return NextResponse.redirect(new URL(CHARACTERS_PATH, req.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
