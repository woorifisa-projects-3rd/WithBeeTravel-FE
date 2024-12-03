import { motion } from 'framer-motion';
import styles from './notification-skeleton.module.css';

interface NotificationSkeletonProps {
  count?: number;
}

export const NotificationSkeleton = ({
  count = 3,
}: NotificationSkeletonProps) => {
  // 애니메이션을 위한 variants 정의
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 각 항목이 0.1초 간격으로 나타남
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
            <motion.div
              className={styles.skeletonLogTime}
              variants={itemVariants}
            >
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>

            <div className={styles.skeletonCardContent}>
              <motion.div
                className={styles.skeletonLogTitle}
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
                className={styles.skeletonLogMessage}
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
