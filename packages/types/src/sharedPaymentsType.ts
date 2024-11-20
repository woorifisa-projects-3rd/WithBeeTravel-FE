export interface SharedPayment {
  sharedPaymentId: number;
  adderProfileIcon: string;
  paymentAmount: number;
  foreignPaymentAmount: number;
  exchangeRate: number;
  unit: string;
  storeName: string;
  isAllMemberParticipated: boolean;
  participatingMembers: number[];
  isManuallyAdded: boolean;
  paymentDate: string;
}
