'use server';

import { instance } from './instance';
import { ErrorResponse, SuccessResponse } from '@withbee/types';

export interface Notification {
  id: number;
  logTime: string;
  logTitle: string;
  logMessage: string;
  link: string | null;
}

export interface Notifications {
  Notifications: Notification[];
}

export const getNotifications = async (): Promise<
  SuccessResponse<Notifications> | ErrorResponse
> => {
  const response = instance.get<Notifications>(`/api/notifications`, {
    cache: 'no-store',
  });
  return response;
};
