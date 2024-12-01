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

  // 알림이 보이는 상태에서만 컴포넌트를 렌더링하도록 조건부 처리
  if (!isVisible) {
    return null; // 알림이 닫히면 null을 반환하여 컴포넌트가 렌더링되지 않게 함
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
