'use server';

import { instance } from './instance';
import {
  SuccessResponse,
  ErrorResponse,
  WibeeCardHistoryListResponse,
} from '@withbee/types';

export const getWibeeCardHistory = async (
  startDate?: string,
  endDate?: string,
): Promise<SuccessResponse<WibeeCardHistoryListResponse> | ErrorResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = instance.get<WibeeCardHistoryListResponse>(
    `/api/accounts/wibeeCardHistory${params.toString() ? `?${params.toString()}` : ''}`,
  );

  return response;
};

export const postWibeeCardToSharedPayment = async (
  travelId: string,
  historyId: number[],
) => {
  const historyRequest = {
    historyId,
  };

  const response = await instance.post<SuccessResponse<undefined>>(
    `/api/travels/${travelId}/payments/manual-wibee-card`,
    {
      body: JSON.stringify(historyRequest),
    },
  );
  return response;
};
