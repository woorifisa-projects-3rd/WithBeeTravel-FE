export interface TravelMember {
  id: number;
  profileImage: number;
  name: string;
}

type CategoryType =
  | '교통'
  | '식비'
  | '숙박'
  | '관광'
  | '액티비티'
  | '쇼핑'
  | '항공'
  | '기타';

export interface TravelHome {
  id: number;
  travelName: string;
  travelStartDate: string;
  travelEndDate: string;
  isDomesticTravel: boolean;
  countries: string[];
  mainImage: string;
  statistics: {
    [K in CategoryType]?: number;
  };
  travelMembers: TravelMember[];
  captain: boolean;
  isAgreed: boolean;
  settlementStatus: 'PENDING' | 'ONGOING' | 'DONE';
}
