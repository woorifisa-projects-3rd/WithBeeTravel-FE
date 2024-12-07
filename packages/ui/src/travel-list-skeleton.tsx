'use client';

import { motion } from 'framer-motion';
import styles from './travel-list-skeleton.module.css';

interface TravelListSkeletonProps {
  count?: number;
}

export const TravelListSkeleton = ({ count = 3 }: TravelListSkeletonProps) => {
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
      className={styles.skeletonWrap}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.cardDaySkeleton}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </div>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={styles.skeletonCard}
          variants={itemVariants}
        >
          {/* 이미지 섹션 */}
          <div className={styles.skeletonImage}>
            <motion.div
              className={styles.shimmer}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </div>

          {/* 텍스트 섹션 */}
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className={styles.skeletonSubtitle}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
