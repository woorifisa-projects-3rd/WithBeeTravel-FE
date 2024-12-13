'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import backIcon from './assets/back.png';
import NoMsg from './assets/title/bell.png';
import isMsg from './assets/title/isMsg.png';
import useSWR from 'swr';
import styles from './title.module.css';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getNotifications } from '@withbee/apis';
import { notificationStore } from '@withbee/stores';

interface TitleProps {
  label: string;
  disableBack?: boolean;
  isNotificationPage?: boolean;
}

export const Title = ({
  label,
  disableBack,
  isNotificationPage,
}: TitleProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasNotification, isUpdate, markNotification } = notificationStore();

  const { data: isMsgData } = useSWR('Notification', getNotifications, {
    refreshInterval: 1000,
  });

  const notificationIcon =
    pathname === '/notification'
      ? NoMsg // 알림 페이지면 NoMsg로 고정
      : hasNotification
        ? isMsg
        : NoMsg; // 다른 페이지면 기존 로직 유지

  useEffect(() => {
    if (
      isMsgData &&
      'data' in isMsgData &&
      Array.isArray(isMsgData?.data) &&
      isMsgData.data.length > 0
    ) {
      const curIds = isMsgData.data.map((notification) => notification.id);

      const storedIds = notificationStore.getState().newNotifications;

      // 새로운 알림 ID 필터링
      const newIds = curIds.filter((id) => !storedIds.includes(id));

      if (newIds.length > 0) {
        notificationStore
          .getState()
          .setNewNotifications([...storedIds, ...newIds]);
        isUpdate(true);
      }
    } else {
      isUpdate(false);
    }
  }, [isMsgData, isUpdate]);

  useEffect(() => {
    if (pathname === '/notification') {
      markNotification(); // 알림 페이지에 들어오면 읽음 처리
    }
  }, [pathname, markNotification]);

  const handleClick = () => {
    router.back();
  };

  return (
    <nav className={styles.nav}>
      {!disableBack && (
        <Image
          src={backIcon}
          alt="뒤로 가기"
          width={7}
          height={13}
          onClick={handleClick}
          className={styles.back}
        />
      )}
      <h1 className={styles.label}>{label}</h1>
      <Link href="/notification">
        <Image
          src={notificationIcon}
          alt="알림"
          width={20}
          height={20}
          className={styles.alarm}
        />
      </Link>
    </nav>
  );
};
