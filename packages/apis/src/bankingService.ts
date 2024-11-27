'use server';

import { instance } from './instance';
import {
  ErrorResponse,
  SuccessResponse,
  AccountInfo,
  PinNumberResponse,
  CreateAccount,
  PinNumberRequest,
  AccountHistory,
  DepositRequest,
  AccountNumberRequest,
  TargetName,
  WibeeCardResponse,
  accountType,
  connectedAccountType,
} from '@withbee/types';

// 보유 계좌 목록 불러오기
export const getAccounts = async (): Promise<
  SuccessResponse<AccountInfo[]> | ErrorResponse
> => {
  const response = instance.get<AccountInfo[]>(`/api/accounts`);
  return response;
};

// 계좌 생성
export const createAccount = async (
  product: String,
): Promise<SuccessResponse<CreateAccount> | ErrorResponse> => {
  const response = instance.post<CreateAccount>(`/api/accounts`, {
    body: JSON.stringify({ product }),
  });
  return response;
};

// 계좌 존재 검증
export const verifyAccount = async (accountNumber: string) => {
  const response = instance.post<AccountNumberRequest>('/api/accounts/verify', {
    body: JSON.stringify({ accountNumber }),
  });
  return response;
};

// 핀번호 잠금 상태 확인
export const getUserState = async (): Promise<
  SuccessResponse<PinNumberResponse> | ErrorResponse
> => {
  const response = instance.get<PinNumberResponse>(`/api/verify/user-state`);
  return response;
};

// 핀번호 검증
export const verifyPin = async (
  Pin: String,
): Promise<SuccessResponse<PinNumberRequest> | ErrorResponse> => {
  const response = instance.post<PinNumberRequest>(`/api/verify/pin-number`, {
    body: JSON.stringify({ pinNumber: Pin }),
  });
  console.log('핀번호 검증 ', response);

  return response;
};

//계좌 정보 가져오기
export const getAccountInfo = async (
  id: number,
): Promise<SuccessResponse<AccountInfo> | ErrorResponse> => {
  const response = instance.get<AccountInfo>(`/api/accounts/${id}/info`);
  return response;
};

// 거래 내역 가져오기
export const getAccountHistories = async (
  id: number,
): Promise<SuccessResponse<AccountHistory[]> | ErrorResponse> => {
  const response = instance.get<AccountHistory[]>(`/api/accounts/${id}`);
  return response;
};

//계좌번호로 사용자 이름 가져오기
export const getAccountOwnerName = async (
  targetAccountNumber: string,
): Promise<SuccessResponse<TargetName> | ErrorResponse> => {
  const response = instance.post<TargetName>(`/api/accounts/find-user`, {
    body: JSON.stringify({
      accountNumber: targetAccountNumber,
    }),
  });
  return response;
};

// 입금 하기
export const deposit = async (
  myAccountId: number,
  amount: number,
  rqspeNm: String,
) => {
  const response = instance.post<DepositRequest>(
    `/api/accounts/${myAccountId}/deposit`,
    {
      body: JSON.stringify({ amount, rqspeNm }),
    },
  );
  return response;
};

// 위비카드여부확인
export const getIsCard = async (): Promise<
  SuccessResponse<connectedAccountType> | ErrorResponse
> => {
  const response = await instance.get<connectedAccountType>(
    '/api/travels/accounts',
  );
  return response;
};

export const getAccountList = async (): Promise<
  SuccessResponse<accountType> | ErrorResponse
> => {
  const response = await instance.get<accountType>('/api/accounts');
  return response;
};

export const postConnectedAccount = async (
  accountId: number,
  isWibeeCard: boolean,
): Promise<SuccessResponse<connectedAccountType> | ErrorResponse> => {
  const response = await instance.post<connectedAccountType>(
    '/api/travels/accounts',
    {
      body: JSON.stringify({
        accountId,
        isWibeeCard,
      }),
    },
  );
  return response;
};

// 송금하기
export const transfer = async (
  accountId: number,
  amount: number,
  accountNumber: String,
  rqspeNm: String,
) => {
  const response = instance.post(`/api/accounts/${accountId}/transfer`, {
    body: JSON.stringify({
      accountId: accountId,
      amount: amount,
      accountNumber: accountNumber,
      rqspeNm: rqspeNm,
    }),
  });
  return response;
};

// 위비카드인지 확인
export const checkWibee = async (
  myAccountId: Number,
): Promise<SuccessResponse<WibeeCardResponse> | ErrorResponse> => {
  const response = instance.get<WibeeCardResponse>(
    `/api/accounts/${myAccountId}/check-wibee`,
  );
  return response;
};

// 거래내역 추가
export const registerPayment = async (
  myAccountId: number,
  payAm: Number,
  rqspeNm: String,
  isWibeeCard: boolean,
) => {
  const response = instance.post(`/api/accounts/${myAccountId}/payment`, {
    body: JSON.stringify({
      payAm: payAm,
      rqspeNm: rqspeNm,
      isWibeeCard: isWibeeCard,
    }),
  });
  return response;
};
