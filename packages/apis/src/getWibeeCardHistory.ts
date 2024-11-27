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

  const response = await instance.get<WibeeCardHistoryListResponse>(
    `/api/accounts/wibeeCardHistory${params.toString() ? `?${params.toString()}` : ''}`,
  );
  return response;
};
