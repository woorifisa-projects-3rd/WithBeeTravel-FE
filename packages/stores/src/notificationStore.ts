import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Zustand 스토어 업데이트
interface NotificationState {
  hasNotification: boolean;
  newNotifications: number[];
  markNotification: () => void;
  isUpdate: (status: boolean) => void;
  setNewNotifications: (ids: number[]) => void;
}

export const notificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      hasNotification: false,
      newNotifications: [], // 초기값 설정

      markNotification: () =>
        set((state) => ({
          hasNotification: false,
        })),

      isUpdate: (status: boolean) => set({ hasNotification: status }),
      setNewNotifications: (ids: number[]) => set({ newNotifications: ids }),
    }),
    {
      name: 'notification-storage',
    },
  ),
);
