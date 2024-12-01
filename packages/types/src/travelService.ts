export interface InviteCode {
  travelId: number;
  inviteCode: string;
}

export interface TravelList {
  travelId: number;
  travelName: string;
  travelStartDate: string;
  travelEndDate: string;
  travelMainImage: string;
  profileImage: number;
}

export interface TravelFormData {
  travelId: number;
  travelName: string;
  isDomesticTravel: boolean;
  travelCountries: string[];
  travelStartDate: string;
  travelEndDate: string;
}

export type TravelMode = 'create' | 'edit';

export interface TravelFormProps {
  mode: TravelMode;
  travelData?: TravelFormData;
  onSubmit: (formData: TravelFormData) => void;
}
