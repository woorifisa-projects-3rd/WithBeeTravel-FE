'use server';

import { instance } from './instance';
import {
  ErrorResponse,
  SuccessResponse,
  accountType,
  connectedAccountType,
} from '@withbee/types';

export const getAccounts = async (): Promise<
  SuccessResponse<accountType> | ErrorResponse
> => {
  const response = await instance.get<accountType>('/api/accounts');
  return response;
};

export const postConnectedAccount = async (
  accountId: number,
  connectedAccountId: string,
  wibeeCardAccountId: string,
  isWibeeCard: boolean,
): Promise<SuccessResponse<connectedAccountType> | ErrorResponse> => {
  const response = await instance.post<connectedAccountType>(
    '/api/travels/accounts',
    {
      body: JSON.stringify({
        accountId,
        connectedAccountId,
        wibeeCardAccountId,
        isWibeeCard,
      }),
    },
  );
  return response;
};
