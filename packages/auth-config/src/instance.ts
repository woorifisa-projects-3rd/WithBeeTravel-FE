import type {
  LoginRequest,
  TokenResponse,
  RefreshTokenRequest,
} from '@withbee/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function post<T>(url: string, data: unknown) {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json() as Promise<T>;
}

export const login = (data: LoginRequest) => {
  return post<{ data: TokenResponse }>('/api/auth/login', data);
};

export const refresh = (data: RefreshTokenRequest) => {
  return post<{ data: TokenResponse }>('/api/auth/refresh', data);
};
