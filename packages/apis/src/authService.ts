'use server';

import { instance } from './instance';
import {
  JoinRequest,
  LoginRequest,
  RefreshTokenRequest,
  TokenResponse,
} from '@withbee/types';

// 로그인
export const login = async ({ email, password }: LoginRequest) => {
  const response = await instance.post<TokenResponse>('/api/auth/login', {
    body: JSON.stringify({
      email,
      password,
    }),
    requireAuth: false,
  });

  return response;
};

// 회원가입
export const join = async ({
  email,
  password,
  name,
  pinNumber,
}: JoinRequest) => {
  const response = await instance.post('/api/auth/join', {
    body: JSON.stringify({
      email,
      password,
      name,
      pinNumber,
    }),
    requireAuth: false,
  });

  return response;
};

// 리프레시
export const refresh = async ({ refreshToken }: RefreshTokenRequest) => {
  const response = await instance.post<TokenResponse>('/api/auth/refresh', {
    body: JSON.stringify({
      refreshToken,
    }),
    requireAuth: false,
  });

  return response;
};
