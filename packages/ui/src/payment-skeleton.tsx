'use client';

import { motion } from 'framer-motion';
import styles from './payment-skeleton.module.css';

export const PaymentSkeleton = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 각 아이템이 0.1초 간격으로 나타남
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
    <motion.div
      className={styles.skeletonWrapper}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className={styles.skeletonDate} variants={itemVariants}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={styles.skeletonItem}
          variants={itemVariants}
        >
          <div className={styles.skeletonLeft}>
            <div className={styles.skeletonProfile}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className={styles.skeletonContent}>
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
              <motion.div
                className={styles.skeletonSubtitle}
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
          <motion.div className={styles.skeletonAmount} variants={itemVariants}>
            <motion.div
              className={styles.shimmer}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};
