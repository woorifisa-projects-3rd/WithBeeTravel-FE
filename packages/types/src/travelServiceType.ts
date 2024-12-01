export interface TravelCreateResponse {
  travelId: number;
  travelName: string;
  isDomesticTravel: boolean;
  travelCountries: string[];
  travelStartDate: string;
  travelEndDate: string;
}

// 초대코드타입
export interface InviteCode {
  travelId: number;
  inviteCode: String;
}
