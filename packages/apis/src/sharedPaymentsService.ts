'use server';

import { instance } from './instance';
import type { PageResponse, SharedPayment } from '@withbee/types';

interface GetSharedPaymentsParams {
  travelId: number;
  page?: number;
  sortBy?: 'latest' | 'amount';
  memberId?: number;
  startDate?: string;
  endDate?: string;
  category?: string;
}

// 공유 결제 내역 가져오기
export const getSharedPayments = async ({
  travelId,
  page = 0,
  sortBy = 'latest',
  memberId,
  startDate,
  endDate,
  category,
}: GetSharedPaymentsParams) => {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    sortBy,
  });

  // 선택적 파라미터는 값이 있을 때만 추가
  if (memberId) searchParams.append('memberId', memberId.toString());
  if (startDate) searchParams.append('startDate', startDate);
  if (endDate) searchParams.append('endDate', endDate);
  if (category) searchParams.append('category', category);

  const response = await instance.get<PageResponse<SharedPayment>>(
    `/api/travels/${travelId}/payments?${searchParams.toString()}`,
    {
      cache: 'no-cache',
    },
  );

  return response;
};

interface chooseParticipantsParams {
  travelId: number;
  paymentId: number;
  travelMembersId: number[];
}

// 정산 인원 선택하기
export const chooseParticipants = async ({
  travelId,
  paymentId,
  travelMembersId,
}: chooseParticipantsParams) => {
  return instance.patch(
    `/api/travels/${travelId}/payments/${paymentId}/participants`,
    {
      body: JSON.stringify({
        travelMembersId,
      }),
    },
  );
};
