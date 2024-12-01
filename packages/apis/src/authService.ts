'use server';

import { instance } from './instance';
import { JoinRequest } from '@withbee/types';

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
