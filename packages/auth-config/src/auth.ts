import NextAuth, { User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { refresh, login } from './instance';
import { JWT } from 'next-auth/jwt';

// 59분
const ACCESS_TOKEN_EXPIRES = 59 * 60 * 1000;
// const ACCESS_TOKEN_EXPIRES = 30 * 1000; // 테스트용 5초

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  const response = await refresh({
    refreshToken: token.refreshToken!,
  });

  const { accessToken, refreshToken } = response || {};

  console.log('토큰 갱신 성공', { accessToken, refreshToken });

  if (!accessToken || !refreshToken) {
    console.error('토큰 갱신 실패', { accessToken, refreshToken });
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }

  return {
    ...token,
    accessToken,
    refreshToken,
    expires_at: Date.now() + ACCESS_TOKEN_EXPIRES,
    error: undefined,
  };
};

export const authConfig = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 Day
  },
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

          if (!response) throw new Error('로그인에 실패했습니다.');

          const { accessToken, refreshToken, role } = response;

          return {
            id: credentials.email as string,
            email: credentials.email as string,
            accessToken,
            refreshToken,
            role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          // @ts-ignore
          throw new Error(error?.message || '로그인에 실패했습니다.');
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, account }): Promise<JWT | null> => {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          expires_at: Date.now() + ACCESS_TOKEN_EXPIRES,
          user,
        };
      }

      if (Date.now() < token.expires_at!) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.expires_at = token.expires_at;
      session.user.role = token.role;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
