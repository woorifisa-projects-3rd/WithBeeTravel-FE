import { motion } from 'framer-motion';
import styles from './notification-skeleton.module.css';

interface NotificationSkeletonProps {
  count?: number;
}

export const NotificationSkeleton = ({
  count = 3,
}: NotificationSkeletonProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: -20 }, // 위에서 아래로
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }, // 부드럽게 나타남
    },
  };

  return (
    <motion.div
      className={styles.skeletonContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={styles.skeletonCard}
          variants={cardVariants}
        >
          <div className={styles.skeletonLogTime}>
            <motion.div
              className={styles.shimmer}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 2.5, // 느린 애니메이션
                ease: 'linear',
              }}
            />
          </div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle}>
              <motion.div
                className={styles.shimmer}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: 'linear',
                }}
              />
            </div>
            <div className={styles.skeletonMessage}>
              <motion.div
                className={styles.shimmer}
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  ease: 'linear',
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
