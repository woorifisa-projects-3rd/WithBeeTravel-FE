'use server';

import { instance } from './instance';
import {
  ErrorResponse,
  JoinRequest,
  MyPageInfoResponse,
  SuccessResponse,
} from '@withbee/types';

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

// 마이 페이지
export const getMyPageInfo = async (): Promise<
  SuccessResponse<MyPageInfoResponse> | ErrorResponse
> => {
  const response = await instance.get<MyPageInfoResponse>('/api/auth/mypage');

  return response;
};
