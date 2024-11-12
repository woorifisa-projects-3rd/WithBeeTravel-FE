'use client';

import { Button } from '@withbee/ui/button';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import agreeWibee from '../../../../../public/friends/agreeWibee.png';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Page() {
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
          <Image src={agreeWibee} alt="completed" width={208} height={222} />
        </motion.div>
        <p className={styles.title}>정산 동의 완료</p>
        <p className={styles.content}>
          모든 사람이 정산 동의 시, 자동 정산됩니다.
          <br />
          정산이 완료되면 PUSH 알림이 발송됩니다.
        </p>
      </div>
      <div className={styles.btnWrapper}>
        <Button label="돌아가기" />
      </div>
    </div>
  );
}
