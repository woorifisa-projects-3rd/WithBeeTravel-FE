import { Button } from '@withbee/ui/button';
import { Tag } from '@withbee/ui/tag';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { FriendImage } from '@withbee/ui/friend-image';
import Image from 'next/image';
import { BarChart } from '@withbee/ui/chart';

export default function Page() {
  // TODO: Friends 컴포넌트화 필요
  return (
    <div className={styles.container}>
      <Title label="여행 홈" />
      <div className={styles.subContainer}>
        <div className={styles.subtitleContainer}>
          <p className={styles.date}>2022/12/25 ~ 2023/01/01</p>
          <div className={styles.subtitleWrapper}>
            <h2 className={styles.subtitle}>팀 호초루의 여행</h2>
            <Image src="/edit.png" alt="edit" width={19} height={17.94} />
          </div>
        </div>
        <div className={styles.imgWrapper}>{/* <Image /> */}</div>
        <div className={styles.tagWrapper}>
          <Tag label="오스트리아" />
          <Tag label="포르투갈" />
          <Tag label="스위스" />
        </div>
        <div className={styles.friendsWrapper}>
          {[1, 2, 3, 4, 5].map((number) => (
            <FriendImage number={number} />
          ))}
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button label="그룹 결제 내역" />
        <Button label="친구 초대" primary={false} />
      </div>
      <BarChart />
    </div>
  );
}
