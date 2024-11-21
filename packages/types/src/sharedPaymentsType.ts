export interface SharedPayment {
  id: number;
  adderProfileIcon: number;
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
