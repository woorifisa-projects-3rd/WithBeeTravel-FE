'use server';

import {
  DashboardResponse,
  ErrorResponse,
  LoginLogResponse,
  SuccessResponse,
  UserResponse,
} from '@withbee/types';
import { instance } from './instance';

export const getLoginLogs = async (
  page: number,
  size: number,
  loginLogType: string,
  userId: number,
): Promise<SuccessResponse<LoginLogResponse> | ErrorResponse> => {
  const url =
    loginLogType === 'ALL'
      ? `/api/admin/logs/all?userId=${userId}&page=${page}&size=${size}` // loginLogType이 "ALL"인 경우
      : `/api/admin/logs/all?userId=${userId}&page=${page}&size=${size}&loginLogType=${loginLogType}`; // 다른 경우

  try {
    const response = await instance.get<LoginLogResponse>(url, {
      // requireAuth: false,
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
    // requireAuth: false,
  });
  return response;
};

export const getUserList = async (
  page: number,
  size: number,
  name?: string,
): Promise<SuccessResponse<UserResponse> | ErrorResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (name) {
    params.append('name', name);
  }
  const url = `/api/admin/users?${params.toString()}`;
  const response = instance.get<UserResponse>(url, {
    // requireAuth: false,
  });
  return response;
};
