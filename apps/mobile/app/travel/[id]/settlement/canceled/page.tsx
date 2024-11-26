'use client';

import { Button } from '@withbee/ui/button';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default function Page({ params }: { params: Params }) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Title label="" />
      <div className={styles.subtitleContainer}>
        <motion.div
          animate={{ y: [0, -10, 0] }} // 위아래로 움직이기
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Image
            className={styles.image}
            src={'/imgs/settlement/cancelWibee.png'}
            alt="pending"
            width={170}
            height={222}
          />
        </motion.div>
        <p className={styles.title}>정산 취소 완료</p>
        <p className={styles.content}>
          정산이 취소되었습니다.
          <br />
          여행 멤버들과 논의 후 다시 정산을 진행해주세요!
        </p>
      </div>
      <div className={styles.btnWrapper}>
        <Button
          label="돌아가기"
          onClick={() => router.push(`/travel/${params.id}/payments`)}
        />
      </div>
    </div>
  );
}
