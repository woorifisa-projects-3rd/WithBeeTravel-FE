'use server';

import type {
  LoginRequest,
  TokenResponse,
  RefreshTokenRequest,
  LogoutRequest,
} from '@withbee/types';
import { ERROR_MESSAGES } from '@withbee/exception';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface AuthOptions {
  headers?: Record<string, string>;
  data?: unknown;
}

async function authInstance<T>(url: string, options: AuthOptions = {}) {
  try {
    const { headers = {}, data } = options;

    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: data ? JSON.stringify(data) : null,
      cache: 'no-store',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('error', await response.json());
      throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
    }

    const { accessToken, role } = (await response.json()).data;
    const refreshToken = response.headers
      .get('Set-Cookie')
      ?.split(';')[0]
      ?.split('=')[1];

    return { accessToken, refreshToken, role };
  } catch (error) {
    throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
  }
}

export const login = async (data: LoginRequest) => {
  return await authInstance<{ data: TokenResponse }>('/api/auth/login', {
    data,
  });
};

export const logout = async ({ accessToken, refreshToken }: LogoutRequest) => {
  return await authInstance('/api/auth/logout', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      refreshToken,
    },
  });
};

export const refresh = async ({ refreshToken }: RefreshTokenRequest) => {
  console.log('토큰 갱신 요청', refreshToken);

  const response = await authInstance<{ data: TokenResponse }>(
    '/api/auth/reissue',
    {
      headers: {
        refreshToken,
      },
    },
  );

  console.log('토큰 갱신 결과', response);
  return response;
};
