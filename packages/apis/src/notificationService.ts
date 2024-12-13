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

export const getNotifications = async (): Promise<
  SuccessResponse<Notification[]> | ErrorResponse
> => {
  const response = instance.get<Notification[]>('/api/notifications');
  return response;
};
