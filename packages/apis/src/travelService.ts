import { instance } from './instance';
import {
  ErrorResponse,
  SuccessResponse,
  TravelCreateResponse,
} from '@withbee/types';

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
