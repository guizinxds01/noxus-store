import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = path === '/admin/login' || path === '/api/admin/login';
  const isAdminRoute = (path.startsWith('/admin') || path.startsWith('/api/admin')) && !isAuthRoute;

  if (isAdminRoute) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (isAuthRoute) {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch (error) {
        // Token invalid, let them login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
