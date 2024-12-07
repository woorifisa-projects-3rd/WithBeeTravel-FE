'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './auth';

export async function middleware(request: NextRequest, response: NextResponse) {
  const session = await auth();

  if (
    !session ||
    !session.user.accessToken ||
    session.error === 'RefreshAccessTokenError'
  ) {
    // signOut() 제거
    const response = NextResponse.redirect(new URL('/login', request.url));

    // 필요한 경우 쿠키 삭제
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('next-auth.csrf-token');
    response.cookies.delete('next-auth.callback-url');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/travel/:path*',
    '/notification/:path*',
    '/banking/:path*',
    '/mypage/:path*',
  ],
};
