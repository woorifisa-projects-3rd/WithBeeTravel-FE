'use server';

import {
  DashboardResponse,
  ErrorResponse,
  LoginLogResponse,
  SuccessResponse,
} from '@withbee/types';
import { instance } from './instance';

export const getLoginLogs = async (
  page: number,
  size: number,
  loginLogType: string,
  userId: number, // userId는 필수
): Promise<SuccessResponse<LoginLogResponse> | ErrorResponse> => {
  // 로그인 로그 타입이 "ALL"일 경우 loginLogType 파라미터를 제외하고 쿼리 생성
  const url =
    loginLogType === 'ALL'
      ? `/api/admin/logs/all?userId=${userId}&page=${page}&size=${size}` // loginLogType이 "ALL"인 경우
      : `/api/admin/logs/all?userId=${userId}&page=${page}&size=${size}&loginLogType=${loginLogType}`; // 다른 경우

  try {
    const response = await instance.get<LoginLogResponse>(url, {
      requireAuth: false,
    });
    return response;
  } catch (error) {
    // 실패한 경우 ErrorResponse 반환
    // @ts-ignore
    return { error: 'Failed to fetch login logs' };
  }
};

export const getAdminDashbord = async (): Promise<
  SuccessResponse<DashboardResponse> | ErrorResponse
> => {
  const response = instance.get<DashboardResponse>(`/api/admin`, {
    requireAuth: false,
  });
  return response;
};
