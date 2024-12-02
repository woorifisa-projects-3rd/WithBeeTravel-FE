'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import styles from './RealTimeMsg.module.css';
import { connectSSE } from '@withbee/apis';

export default function RealTimeMsg() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<string[]>([]);
  const [eventSource, setEventSource] = useState<EventSourcePolyfill | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const setupSSE = async () => {
      try {
        if (status === 'authenticated' && session?.user?.accessToken) {
          const accessToken = session.user.accessToken;
          console.log('accessToken', accessToken);

          const newEventSource = await connectSSE(
            'http://localhost:8080/api/notifications/stream',
            (data) => {
              if (isMounted) {
                setNotifications((prev) => [...prev, data]);
              }
            },
            () => console.log('SSE 연결 성공!'),
            (error) => console.error('SSE 연결 실패:', error),
            accessToken,
          );

          if (isMounted) {
            setEventSource(newEventSource);
          }
        }
      } catch (error) {
        console.error('SSE 설정 중 오류:', error);
      }
    };

    setupSSE();

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [session, status]);

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
