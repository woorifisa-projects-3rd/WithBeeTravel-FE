import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { refresh, login } from './instance';
import { JWT } from 'next-auth/jwt';

// 59분
const ACCESS_TOKEN_EXPIRES = 59 * 60 * 1000;
// const ACCESS_TOKEN_EXPIRES = 5 * 1000; // 테스트용 5초

// 진행 중인 토큰 갱신 요청을 저장할 변수
let refreshPromise: Promise<JWT> | null = null;
let lastRefreshTime = 0;
const REFRESH_COOLDOWN = 1000; // 1초 쿨다운

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  // 마지막 갱신 시도 후 쿨다운 시간이 지나지 않았으면 현재 토큰 반환
  if (Date.now() - lastRefreshTime < REFRESH_COOLDOWN) {
    return token;
  }

  // 이미 진행 중인 갱신 요청이 있다면 그 결과를 기다림
  if (refreshPromise) {
    return await refreshPromise;
  }

  console.log('토큰을 갱신합니다.', token);
  lastRefreshTime = Date.now();

  // 새로운 갱신 요청 시작
  refreshPromise = (async () => {
    try {
      const response = await refresh({
        refreshToken: token.refreshToken!,
      });

      if ('code' in response!) {
        console.error('토큰 갱신 실패', response);
        throw new Error('RefreshAccessTokenError');
      }

      const { accessToken, refreshToken } = response?.data || {};

      console.log('토큰 갱신 성공', response);

      if (!accessToken || !refreshToken) {
        throw new Error('RefreshAccessTokenError');
      }

      return {
        ...token,
        accessToken,
        refreshToken,
        expires_at: Date.now() + ACCESS_TOKEN_EXPIRES,
        error: undefined,
      };
    } catch (error) {
      return {
        ...token,
        error: 'RefreshAccessTokenError' as const,
      };
    }
  })();

  // 갱신 완료 후 Promise 초기화
  const result = await refreshPromise;
  refreshPromise = null;
  return result;
};

export const authConfig = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: '이메일',
          type: 'text',
          placeholder: '이메일을 입력해주세요.',
        },
        password: {
          label: '비밀번호',
          type: 'password',
          placeholder: '비밀번호를 입력해주세요.',
        },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if ('code' in response) {
            return null;
          }
          const { accessToken, refreshToken } = response.data || {};

          console.log('Auth success:', refreshToken);

          return {
            id: credentials.email as string,
            email: credentials.email as string,
            accessToken,
            refreshToken,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT | null> {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expires_at: Date.now() + ACCESS_TOKEN_EXPIRES,
          user,
        };
      }

      if (Date.now() < token.expires_at!) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.expires_at = token.expires_at;
        session.error = token.error;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
