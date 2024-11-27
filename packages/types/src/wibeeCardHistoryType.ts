export interface WibeeCardHistory {
  id: number;
  date: string;
  paymentAmount: number;
  storeName: string;
  isAddedSharedPayment: boolean;
}

export interface WibeeCardHistoryListResponse {
  startDate: string;
  endDate: string;
  histories: WibeeCardHistory[];
}
