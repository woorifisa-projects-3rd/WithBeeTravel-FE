import { ErrorResponse, SuccessResponse, instance } from './instance';

interface MyTotalPayment {
  name: string;
  totalPaymentCost: number;
  ownPaymentCost: number;
  actualBurdenCost: number;
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
  myDetailPayments: MyDetailPayment[];
  others: Other[];
}

// 세부 정산 내역 조회하기
export const getSettlementDetails = async (
  travelId: number,
): Promise<SuccessResponse<SettlementDetails> | ErrorResponse> => {
  const response = instance.get<SettlementDetails>(
    `/api/travels/${travelId}/settlements`,
    {
      cache: 'no-store',
    },
  );
  return response;
};
