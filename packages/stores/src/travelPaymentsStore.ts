import { create } from 'zustand';

interface PaymentStore {
  sortBy: 'latest' | 'amount';
  setSortBy: (sort: 'latest' | 'amount') => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  sortBy: 'latest',
  setSortBy: (sort) => set({ sortBy: sort }),
}));
