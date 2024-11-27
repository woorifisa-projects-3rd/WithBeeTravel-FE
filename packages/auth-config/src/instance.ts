'use server';

import type {
  LoginRequest,
  TokenResponse,
  RefreshTokenRequest,
} from '@withbee/types';
import { ERROR_MESSAGES } from '@withbee/exception';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function post<T>(url: string, data: unknown) {
  try {
    console.log('auth data', JSON.stringify(data));

    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-cache',
    });

    if (!response.ok) {
      console.error(ERROR_MESSAGES['FETCH-FAILED'], response.status);
      throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
    }

    // console.log('response', response);

    return await response.json();
  } catch (error) {
    console.error('Auth API error:', error);
    return null;
  }
}

export const login = (data: LoginRequest) => {
  return post<{ data: TokenResponse }>('/api/auth/login', data);
};

export const refresh = (data: RefreshTokenRequest) => {
  return post<{ data: TokenResponse }>('/api/auth/token-refresh', data);
};
