import { instance } from './instance';
import { ErrorResponse, SuccessResponse, InviteCode } from '@withbee/types';

export const getInviteCode = async (
  travelId: number,
): Promise<SuccessResponse<InviteCode> | ErrorResponse> => {
  const response = instance.get<InviteCode>(
    `api/travels/${travelId}/invite-code`,
  );
  return response;
};

export const postInviteCode = async (
  inviteCode: string,
): Promise<SuccessResponse<InviteCode> | ErrorResponse> => {
  const response = instance.post<InviteCode>(`/api/travels/invite-code`, {
    body: JSON.stringify({
      inviteCode,
    }),
  });
  return response;
};
