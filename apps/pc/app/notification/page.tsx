import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import '@withbee/styles';
import Image from 'next/image';
import { formatDateToKorean } from '@withbee/utils';
import Link from 'next/link';
import { SuccessResponse } from '@withbee/types';
import { Notification, getNotifications } from '@withbee/apis';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const response = (await getNotifications()) as SuccessResponse<
    Notification[]
  >;

  const notifications = response.data || [];

  const sortedNotifications = notifications.sort(
    (a: Notification, b: Notification) => b.id - a.id,
  );

  return (
    <div className={styles.container}>
      <header>
        <Title label="알림함" />
      </header>
      <div className={styles.content}>
        {notifications.length === 0 && (
          <div className={styles.emptyPage}>
            <div>알림이 없습니다.</div>
          </div>
        )}
        {notifications.length > 0 && (
          <ul>
            {sortedNotifications.map((notification: Notification) => (
              <li key={notification.id} className={styles.cardContainer}>
                <div className={styles.logTime}>
                  {formatDateToKorean(new Date(notification.logTime))}
                </div>
                <div className={styles.card}>
                  <div className={styles.cardRow}>
                    <span className={styles.logTitle}>
                      {notification.logTitle}
                    </span>
                    {notification.link && (
                      <span className={styles.linkIcon}>
                        <Link
                          href={notification.link}
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/notifications/arrow.png"
                            alt="link icon"
                            width={12}
                            height={6}
                          />
                        </Link>
                      </span>
                    )}
                  </div>
                  <div
                    className={styles.logMessage}
                    dangerouslySetInnerHTML={{
                      __html: notification.logMessage.replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
