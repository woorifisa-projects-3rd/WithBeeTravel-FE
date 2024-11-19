import { create } from 'zustand';

interface PaymentStore {
  sortBy: 'latest' | 'amount';
  setSortBy: (sort: 'latest' | 'amount') => void;
  startDate: string;
  setStartDate: (date: { year: number; month: number; day: number }) => void;
  endDate: string;
  setEndDate: (date: { year: number; month: number; day: number }) => void;
}

// YYYY-MM-DD 형식으로 변환
// const today = new Date().toISOString().split('T')[0];
const today = '2024-06-02';

export const usePaymentStore = create<PaymentStore>((set) => ({
  sortBy: 'latest',
  setSortBy: (sort) => set({ sortBy: sort }),
  startDate: today!,
  endDate: today!,
  setStartDate: (date) =>
    set({
      startDate: `${date.year}-${date.month}-${date.day}`,
    }),
  setEndDate: (date) =>
    set({
      endDate: `${date.year}-${date.month}-${date.day}`,
    }),
}));
