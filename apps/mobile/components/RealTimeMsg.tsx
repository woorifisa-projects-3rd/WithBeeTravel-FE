'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // NextAuth 세션 훅
import { EventSourcePolyfill } from 'event-source-polyfill';
import styles from './RealTimeMsg.module.css';
import { connectSSE } from '@withbee/apis';

export default function RealTimeMsg() {
  const { data: session, status } = useSession(); // 세션 정보 가져오기
  const [notifications, setNotifications] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  console.log(notifications);

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
    console.log(accessToken);

    if (accessToken) {
      (async () => {
        eventSource = await connectSSE(
          'http://localhost:8080/api/notifications/stream',
          (data) => {
            console.log(data);

            setNotifications((prev) => [...prev, data]);
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

  return (
    <div className={styles.background}>
      <div className={`${styles.card} ${styles.slideIn}`}>
        <h1 className={styles.logTitle}>실시간 알림</h1>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className={styles.logMessage}>
              {notification}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
