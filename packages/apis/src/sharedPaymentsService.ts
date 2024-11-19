import { instance } from './instance';
import type {
  DateFormat,
  PageResponse,
  SharedPayment,
  SuccessResponse,
} from '@withbee/types';
import { ERROR_MESSAGES } from '@withbee/exception';

interface Params {
  travelId: number;
  page?: number;
  sortBy?: 'latest' | 'amount';
  userId?: number;
  startDate?: string;
  endDate?: string;
}

// 공유 결제 내역 가져오기
export const getSharedPayments = async ({
  travelId,
  page = 0,
  sortBy = 'latest',
  userId,
  startDate,
  endDate,
}: Params) => {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    sortBy,
  });

  // 선택적 파라미터는 값이 있을 때만 추가
  if (userId) searchParams.append('userId', userId.toString());
  if (startDate) searchParams.append('startDate', startDate);
  if (endDate) searchParams.append('endDate', endDate);

  const response = await instance.get<PageResponse<SharedPayment>>(
    `/api/travels/${travelId}/payments?${searchParams.toString()}`,
  );

  return response as SuccessResponse<PageResponse<SharedPayment>>;
};

// 정산 인원 선택하기
export const chooseParticipants = async (
  travelId: number,
  paymentId: number,
  travelMembersId: number[],
) => {
  return instance.patch(
    `/api/travels/${travelId}/payments/${paymentId}/participants`,
    {
      body: JSON.stringify({
        travelMembersId,
      }),
      // cache: 'no-store',
    },
  );
};
