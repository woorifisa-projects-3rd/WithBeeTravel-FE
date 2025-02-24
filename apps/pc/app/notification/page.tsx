'use client';

import styles from './page.module.css';
import '@withbee/styles';
import { getNotifications, Notification } from '@withbee/apis';
import '@withbee/styles';
import Image from 'next/image';
import { formatDateToKorean } from '@withbee/utils';
import Link from 'next/link';
import useSWR from 'swr';
import { NotificationSkeleton } from '@withbee/ui/notification-skeleton';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = async () => {
  const response = await getNotifications();
  if ('data' in response) return response.data as Notification[];
  throw new Error(response.message);
};

export const dynamic = 'force-dynamic';

export default function Page() {
  const router = useRouter();

  // SWR 데이터 가져오기
  const { data: notifications, error: notificationError } = useSWR(
    '/api/notifications',
    fetcher,
    {
      refreshInterval: 10000,
    },
  );

  if (notificationError) {
    router.push('/not-found');
    return null;
  }

  const isLoading = !notifications && !notificationError; // 로딩 상태 확인

  const sortedNotifications = (notifications || []).sort((a, b) => b.id - a.id);

  return (
    <div className={styles.container}>
      <h2 className="title">알림함</h2>
      <div className={styles.content}>
        {isLoading && <NotificationSkeleton count={3} />}
        {!isLoading && sortedNotifications.length === 0 && (
          <motion.div
            className={styles.emptyPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Image
              src="/imgs/friends/notfound.png"
              alt="에러 이미지"
              width={140}
              height={140}
              className={styles.errorImage}
            />
            <div className={styles.errorText}>알림이 없습니다.</div>
          </motion.div>
        )}
        <AnimatePresence>
          {!isLoading && sortedNotifications.length > 0 && (
            <motion.ul
              key="content"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1, // 자식 요소가 순차적으로 나타나게 하는 설정
                  },
                },
              }}
            >
              {sortedNotifications.map((notification) => (
                <motion.li
                  key={notification.id}
                  className={styles.cardContainer}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  onClick={() => {
                    if (notification.link) {
                      router.push(notification.link);
                    }
                  }}
                >
                  <div className={styles.logTime}>
                    {formatDateToKorean(new Date(notification.logTime))}
                  </div>
                  <div
                    className={`${styles.card}  ${
                      notification.link ? styles.clickableCard : ''
                    }`}
                  >
                    <div className={styles.cardRow}>
                      <span className={styles.logTitle}>
                        {notification.logTitle}
                      </span>
                      {notification.link && (
                        <span className={styles.linkIcon}>
                          <Image
                            src="/notifications/arrow.png"
                            alt="link icon"
                            width={12}
                            height={6}
                          />
                        </span>
                      )}
                    </div>
                    <div
                      className={styles.logMessage}
                      dangerouslySetInnerHTML={{
                        __html: notification.logMessage.replace(
                          /\n/g,
                          '<br />',
                        ),
                      }}
                    />
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
