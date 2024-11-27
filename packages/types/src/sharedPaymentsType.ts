export interface SharedPayment {
  id: number;
  adderProfileIcon: number;
  paymentAmount: number;
  foreignPaymentAmount: number;
  exchangeRate: number;
  unit: string;
  storeName: string;
  isAllMemberParticipated: boolean;
  participatingMembers: ParticipatingMember[];
  isManuallyAdded: boolean;
  paymentDate: string;
  category: string;
}

export interface ParticipatingMember {
  id: number;
  profileImage: number;
}

export interface SharedPaymentRecordRequest {
  sharedPaymentId: number;
  paymentImage: string;
  paymentComment: string;
}

export interface SharedPaymentRecordResponse {
  paymentImage: File | null;
  paymentComment: string | undefined;
  isMainImage: boolean;
}
