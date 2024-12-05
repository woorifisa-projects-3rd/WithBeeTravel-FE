export interface HoneyCapsule {
  sharedPaymentId: number;
  paymentDate: string;
  paymentImage: string | null;
  paymentComment: string | null;
  storeName: string;
  paymentAmount: number | null;
  foreignPaymentAmount: number | null;
  unit: string | null;
}
