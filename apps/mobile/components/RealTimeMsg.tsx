'use client';

import React, { useEffect, useState } from 'react';
import { connectSSE } from '@withbee/apis';
import styles from './RealTimeMsg.module.css';
import { EventSourcePolyfill } from 'event-source-polyfill';

export default function RealTimeMsg() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let eventSource: EventSourcePolyfill;

    (async () => {
      eventSource = await connectSSE(
        '/api/notifications/stream',
        (event) => {
          setNotifications((prev) => [...prev, event.data]);
        },
        () => console.log('SSE 연결 성공!'),
        (error) => console.error('SSE 연결 실패:', error),
      );
    })();

    return () => {
      eventSource?.close();
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.background}>
      <div className={`${styles.card} ${styles.slideIn}`}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
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
