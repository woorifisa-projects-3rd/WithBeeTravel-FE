'use client';

import React, { useEffect, useState } from 'react';
import { connectSSE } from '@withbee/apis';
import styles from './RealTimeMsg.module.css';

export default function RealTimeMsg() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = connectSSE(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/stream`,
      (data) => setNotifications((prev) => [...prev, data]),
      () => console.log('SSE 연결 성공'),
      (error) => console.error('SSE 연결 오류:', error),
    );

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className={styles.background}>
      {/* <div className={`${styles.card} ${styles.slideIn}`}>
        <h1 className={styles.logTitle}>실시간 알림</h1>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className={styles.logMessage}>
              {notification}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
