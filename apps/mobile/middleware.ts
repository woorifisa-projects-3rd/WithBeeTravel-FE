import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './auth';

export default async function middleware(
  request: NextRequest,
  response: NextResponse,
) {
  // console.log('미들웨어 실행', request.url);
  const session = await auth();

  // console.log('미들웨어 세션', session);
  if (!session || !session.user.accessToken) {
    const response = NextResponse.redirect(new URL('/login', request.url));

    // response.cookies.delete('next-auth.session-token');
    // response.cookies.delete('next-auth.csrf-token');
    // response.cookies.delete('next-auth.callback-url');

    return response;
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/travel/:path*', '/notification/:path*', '/banking/:path*'],
};
