import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './auth';
import { signOut } from 'next-auth/react';

export default async function middleware(
  request: NextRequest,
  response: NextResponse,
) {
  console.log('middleware 접속');

  const session = await auth();

  // console.log('session', session);

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: ['/travel/:path*', '/notification/:path*', '/banking/:path*'],
};

// export { auth as middleware } from './auth';
