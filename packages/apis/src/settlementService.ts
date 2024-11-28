'use server';

import { instance } from './instance';
import { ErrorResponse, SuccessResponse } from '@withbee/types';

interface MyTotalPayment {
  name: string;
  totalPaymentCost: number;
  ownPaymentCost: number;
  actualBurdenCost: number;
  agreed: boolean;
}

interface MyDetailPayment {
  id: number;
  paymentAmount: number;
  requestedAmount: number;
  storeName: string;
  paymentDate: string;
}

interface Other {
  id: number;
  name: string;
  totalPaymentCost: number;
  agreed: boolean;
}

export interface SettlementDetails {
  myTotalPayment: MyTotalPayment;
  disagreeCount: number;
  myDetailPayments: MyDetailPayment[];
  others: Other[];
}

// 정산 요청하기
export const requestSettlement = async (
  travelId: number,
): Promise<SuccessResponse<SettlementDetails> | ErrorResponse> => {
  const response = await instance.post<SettlementDetails>(
    `/api/travels/${travelId}/settlements`,
  );
  console.log(response, '정산 요청하기');
  return response;
};

// 세부 정산 내역 조회하기
export const getSettlementDetails = async (
  travelId: number,
): Promise<SuccessResponse<SettlementDetails> | ErrorResponse> => {
  const response = await instance.get<SettlementDetails>(
    `/api/travels/${travelId}/settlements`,
    {
      cache: 'no-store',
    },
  );
  return response;
};

// 정산 동의하기
export const agreeSettlement = async (
  travelId: number,
): Promise<SuccessResponse<SettlementDetails> | ErrorResponse> => {
  const response = await instance.post<SettlementDetails>(
    `/api/travels/${travelId}/settlements/agreement`,
    {
      cache: 'no-store',
    },
  );
  return response;
};

// 정산 취소
export const cancelSettlement = async (travelId: number) => {
  return await instance.delete(`/api/travels/${travelId}/settlements`);
};
