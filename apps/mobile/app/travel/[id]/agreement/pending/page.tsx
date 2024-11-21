'use client';

import { Button } from '@withbee/ui/button';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default function Page({ params }: { params: Params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');

  const { title, message } = (() => {
    switch (errorCode) {
      case 'SETTLEMENT-010':
        return {
          title: '정산 보류',
          message:
            '여행 멤버의 계좌 잔액이 부족하여<br />정산이 보류되었습니다.<br />잔액 확인 후 다시 시도해주세요!',
        };
      case 'BANKING-001':
        return {
          title: '잔액 부족',
          message:
            '잔액이 부족합니다.<br /> 잔액 확인 후 다시 정산에 동의해주세요!',
        };
      default:
        return {
          title: '알 수 없는 오류',
          message: '알 수 없는 오류가 발생했습니다.',
        };
    }
  })();

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
            src={'/imgs/settlement/angryWibee.png'}
            alt="pending"
            width={150}
            height={200}
          />
        </motion.div>
        <p className={styles.title}>{title}</p>
        <p
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
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
