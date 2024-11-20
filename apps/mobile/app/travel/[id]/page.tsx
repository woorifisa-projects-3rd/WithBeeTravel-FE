'use client';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { FriendImage } from '@withbee/ui/friend-image';
import Image from 'next/image';
import { BarChart } from '@withbee/ui/chart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Page() {
  const router = useRouter();
  // TODO: Friends 컴포넌트화 필요
  return (
    <div className={styles.container}>
      <Title label="여행 홈" />
      <div className={styles.subContainer}>
        <div className={styles.subtitleContainer}>
          <p className={styles.date}>2022/12/25 ~ 2023/01/01</p>
          <div className={styles.subtitleWrapper}>
            <h2 className={styles.subtitle}>팀 호초루의 여행</h2>
            <button
              className={styles.button}
              onClick={() => router.push('/travel/form?mode=edit')}
            >
              <Image src="/edit.png" alt="edit" width={19} height={17.94} />
            </button>
          </div>
        </div>
        <div className={styles.imgWrapper}>{/* <Image /> */}</div>
        <div className={styles.tagWrapper}>
          <Item label="오스트리아" />
          <Item label="포르투갈" />
          <Item label="스위스" />
        </div>
        <div className={styles.friendsWrapper}>
          {[1, 2, 3, 4, 5].map((number) => (
            <FriendImage src={''} />
          ))}
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Link href="/travel/1/payments">
          <Button label="그룹 결제 내역" />
        </Link>
        <Button label="친구 초대" primary={false} />
      </div>
      <BarChart />
    </div>
  );
}
