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
}

export interface ParticipatingMember {
  id: number;
  profileImage: number;
}
