import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import '@withbee/styles';
import Image from 'next/image';
import { formatDateToKorean } from '@withbee/utils';
import Link from 'next/link';

export default function Page() {
  const notifications = [
    {
      id: 1,
      logTime: '2024/11/02 13:56:39',
      logTitle: '결제 내역 정리 요청',
      logMessage:
        '여행이 끝났어요! 🚗💨 함께 사용한 비용들을 정리해 볼까요? 공동 결제 내역을 확인하고 마무리해 주세요.',
      link: '/travel/1/payments',
    },
    {
      id: 2,
      logTime: '2024/11/03 18:24:59',
      logTitle: '정산 요청',
      logMessage:
        '팀 호초루에서 정산 요청을 보냈어요! 💸 함께한 비용을 확인하고, 나의 몫을 정산해 주세요.',
      link: '/travel/1/settlement',
    },
    {
      id: 3,
      logTime: '2024/11/03 18:50:59',
      logTitle: '정산 취소',
      logMessage: '팀 호초루의 정산 요청이 취소되었습니다. 😌 ',
      link: null,
    },
    {
      id: 4,
      logTime: '2024/11/05 18:24:59',
      logTitle: '정산 재요청',
      logMessage:
        '아직 정산이 완료되지 않았어요! 😅 혹시 잊으신 건 아닌가요? 빠르게 정산을 완료해 주세요.',
      link: '/travel/1/settlement',
    },
    {
      id: 5,
      logTime: '2024/11/07 18:24:59',
      logTitle: '정산 완료',
      logMessage:
        '정산이 완료되었습니다! 🎉 모두와 나눠야 할 금액이 처리되었어요. 다음 여행도 기대해요!',
      link: null,
    },
  ];

  const sortedNotifications = notifications.sort((a, b) => b.id - a.id);

  return (
    <div className={styles.container}>
      <header>
        <Title label="알림함" />
      </header>
      <div className={styles.content}>
        <ul>
          {sortedNotifications.map((notification) => (
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
                        target="_blank"
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
                <div className={styles.logMessage}>
                  {notification.logMessage}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
