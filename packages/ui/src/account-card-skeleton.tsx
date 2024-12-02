import { motion } from 'framer-motion';
import styles from './account-card-skeleton.module.css';

export const AccountCardSkeleton = () => {
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear',
      },
    },
  };

  return (
    <div className={styles.skeletonWrapper}>
      {/* 계좌 정보 영역 */}
      <div className={styles.accountInfo}>
        <div className={styles.topSection}>
          <div className={styles.titleSection}>
            <motion.div className={styles.accountTitle}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
            <motion.div className={styles.accountNumber}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </div>
          <motion.div className={styles.historyButton}>
            <motion.div
              className={styles.shimmer}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        </div>

        {/* 잔액 영역 */}
        <motion.div className={styles.balance}>
          <motion.div
            className={styles.shimmer}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>

        {/* 버튼 영역 */}
        <div className={styles.buttonGroup}>
          <motion.div className={styles.button}>
            <motion.div
              className={styles.shimmer}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
          <motion.div className={styles.button}>
            <motion.div
              className={styles.shimmer}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
