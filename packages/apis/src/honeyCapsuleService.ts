'use server';
import { instance } from './instance';
import { SuccessResponse, ErrorResponse, HoneyCapsule } from '@withbee/types';

export const getHoneyCapsule = async (
  travelId: string,
): Promise<SuccessResponse<HoneyCapsule[]> | ErrorResponse> => {
  const response = await instance.get<HoneyCapsule[]>(
    `/api/travels/${travelId}/honeycapsule`,
  );

  return response;
};
