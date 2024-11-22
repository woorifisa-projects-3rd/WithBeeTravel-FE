export interface TravelFormResponse {
  travelId: number;
  travelName: string;
  isDomesticTravel: boolean;
  travelCountries: string[];
  travelStartDate: string;
  travelEndDate: string;
}

export interface InviteCode {
  travelId: number;
  inviteCode: string;
}