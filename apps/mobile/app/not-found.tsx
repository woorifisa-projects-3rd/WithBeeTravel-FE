'use client';
import styles from './not-found.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function error() {
  return (
    <div>
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
            src="/imgs/friends/agreeWibee.png"
            alt="pending"
            width={180}
            height={180}
          />
        </motion.div>
        <div>
          <p className={styles.errorTitle}>404</p>
          <p className={styles.errorSubTitle}>PAGE NOT FOUND</p>
        </div>
        <div className={styles.divider} />
        <p className={styles.errorDescription}>잘못된 페이지 접근</p>
      </div>
    </div>
  );
}
