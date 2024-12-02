import { motion } from 'framer-motion';
import styles from './payment-history-skeleton.module.css';

interface TransactionHistorySkeletonProps {
  count?: number;
}

export const TransactionHistorySkeleton = ({
  count = 3,
}: TransactionHistorySkeletonProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

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
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={styles.skeletonWrapper}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.skeletonItem} variants={itemVariants}>
            <div className={styles.skeletonLeft}>
              <div className={styles.skeletonContent}>
                {/* 날짜 */}
                <motion.div
                  className={styles.skeletonDate}
                  variants={itemVariants}
                >
                  <motion.div
                    className={styles.shimmer}
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </motion.div>
                {/* 거래 종류 */}
                <motion.div
                  className={styles.skeletonTitle}
                  variants={itemVariants}
                >
                  <motion.div
                    className={styles.shimmer}
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                </motion.div>
              </div>
            </div>
            <div className={styles.skeletonRight}>
              {/* 금액 */}
              <motion.div
                className={styles.skeletonAmount}
                variants={itemVariants}
              >
                <motion.div
                  className={styles.shimmer}
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
              {/* 잔액 */}
              <motion.div
                className={styles.skeletonAmount}
                variants={itemVariants}
              >
                <motion.div
                  className={styles.shimmer}
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </>
  );
};
