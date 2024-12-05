export interface WibeeCardHistory {
  id: number;
  date: string;
  paymentAmount: number;
  storeName: string;
  addedSharedPayment: boolean;
}

export interface WibeeCardHistoryListResponse {
  startDate: string;
  endDate: string;
  histories: WibeeCardHistory[];
}
