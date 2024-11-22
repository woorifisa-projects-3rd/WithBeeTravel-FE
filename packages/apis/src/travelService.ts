import { instance } from './instance';
import {
  ErrorResponse,
  SuccessResponse,
  TravelCreateResponse,
} from '@withbee/types';

// 여행 생성
export const createTravel = async (
  travelName: string,
  isDomesticTravel: Boolean,
  travelCountries: string[],
  travelStartDate: string,
  travelEndDate: string,
): Promise<SuccessResponse<TravelCreateResponse> | ErrorResponse> => {
  const response = instance.post<TravelCreateResponse>('/api/travels', {
    body: JSON.stringify({
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    }),
  });

  return response;
};

// 여행 편집
export const editTravel = async (
  travelId: number,
  travelName: number,
  isDomesticTravel: Boolean,
  travelCountries: string[],
  travelStartDate: string,
  travelEndDate: string,
) => {
  return instance.patch(`/api/travels/${travelId}`, {
    body: JSON.stringify({
      travelId,
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    }),
  });
};
