import { instance } from './instance';
import type { TravelMember } from '@withbee/types';

export const createTravel = async (
  travelName: string,
  isDomesticTravel: Boolean,
  travelCountries: string[],
  travelStartDate: string,
  travelEndDate: string,
) => {
  return await instance.post(`/api/travels`, {
    body: JSON.stringify({
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    }),
  });
};

// 여행 멤버 불러오기
export const getTravelMembers = async (travelId: number) => {
  return await instance.get<TravelMember[]>(`/api/travels/${travelId}/members`);
};
