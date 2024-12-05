'use server';

import { instance } from './instance';
import { ErrorResponse, SuccessResponse, InviteCode } from '@withbee/types';

// 초대 코드 조회하기
export const getInviteCode = async (
  travelId: number,
): Promise<SuccessResponse<InviteCode> | ErrorResponse> => {
  const response = instance.get<InviteCode>(
    `/api/travels/${travelId}/invite-code`,
  );

  return response;
};
// 초대 코드로 여행 가입하기
export const postInviteCode = async (
  inviteCode: String,
  travelId: number,
): Promise<SuccessResponse<InviteCode> | ErrorResponse> => {
  const response = instance.post<InviteCode>(
    `/api/travels/${travelId}/invite-code`,
    {
      body: JSON.stringify({
        inviteCode,
      }),
    },
  );

  return response;
};
