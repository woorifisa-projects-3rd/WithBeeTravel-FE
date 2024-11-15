import { instance } from './instance';

// 여행 생성
export const createTravel = async (
  travelName: number,
  isDomesticTravel: Boolean,
  travelCountries: string[],
  travelStartDate: string,
  travelEndDate: string,
) => {
  return instance.post(`/api/travels`, {
    body: JSON.stringify({
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    }),
  });
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
