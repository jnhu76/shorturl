import {withAuth} from 'next-auth/middleware';
import {NextResponse} from 'next/server';

export default withAuth(function middleware(req) {
  const token = req.nextauth.token;

  // 如果用户已退出但尝试访问需要认证的路由
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}, {
  callbacks: {
    authorized: ({token}) => {
      return !!token;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
});

export const config = {
  matcher: ['/dashboard/:path*']
};