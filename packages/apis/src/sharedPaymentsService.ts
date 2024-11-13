import { instance } from './instance';

// 정산 인원 선택하기
export const chooseParticipants = async (travelId: number, paymentId: number, travelMembersId: number[]) => {
  return instance.patch(
    `/api/travels/${travelId}/payments/${paymentId}/participants`,
    {
      body: JSON.stringify({
        travelMembersId,
      }),
      cache: 'no-store',
    },
  );
}