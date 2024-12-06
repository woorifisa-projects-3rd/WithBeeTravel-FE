'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import styles from './RealTimeMsg.module.css';
import { connectSSE } from '@withbee/apis';
import Link from 'next/link';

interface Notification {
  link: string;
  title: string;
  message: string;
}

export default function RealTimeMsg() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (
      status === 'authenticated' &&
      session?.user?.accessToken &&
      !accessToken
    ) {
      setAccessToken(session.user.accessToken);
    }
  }, [session, status, accessToken]);

  useEffect(() => {
    let eventSource: EventSourcePolyfill;

    if (accessToken) {
      (async () => {
        eventSource = await connectSSE(
          `${BASE_URL}/api/notifications/stream`,
          (rawData) => {
            try {
              const parsedNotification: Notification = JSON.parse(rawData);

              setNotifications((prev) => [...prev, parsedNotification]);
              setIsVisible(true);
              setIsAnimatingOut(false);

              const timer = setTimeout(() => {
                setIsAnimatingOut(true);

                const removeTimer = setTimeout(() => {
                  setIsVisible(false);
                  setNotifications((prev) => prev.slice(1));
                }, 1500);

                return () => {
                  clearTimeout(removeTimer);
                };
              }, 4000);

              return () => {
                clearTimeout(timer);
              };
            } catch (error) {
              console.error('Failed to parse notification:', error);
            }
          },
          () => console.log('SSE 연결 성공!!!!!!'),
          (error) => console.error('SSE 연결 실패:', error),
          accessToken,
        );
      })();
    }

    return () => {
      eventSource?.close();
    };
  }, [accessToken]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setNotifications((prev) => prev.slice(1));
    }, 1000); // 애니메이션 시간과 맞춤
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  const notification = notifications[0];
  if (!notification) {
    return null;
  }

  return (
    <div className={styles.background}>
      <div
        className={`
          ${styles.card} 
          ${isAnimatingOut ? styles['slide-out'] : styles.slideIn}
        `}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        <h3 className={styles.logTitle}>📢 {notification.title}</h3>
        <p
          className={styles.logMessage}
          dangerouslySetInnerHTML={{ __html: notification.message }}
        />
        {notification.link && (
          <Link
            href={`/${notification.link}`}
            className={styles.notificationLink}
          >
            자세히 보기
          </Link>
        )}
      </div>
    </div>
  );
}
