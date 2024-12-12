import { motion } from 'framer-motion';
import styles from './wibee-card-skeleton.module.css';

interface WibeeCardPaymentSkeletonProps {
  count?: number;
}

export const WibeeCardSkeleton = ({
  count = 3,
}: WibeeCardPaymentSkeletonProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 각 스켈레톤이 0.1초 간격으로 나타남
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
      <motion.div
        className={styles.skeletonWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={styles.skeletonContainer}
          >
            <motion.div className={styles.skeletonInfo}>
              <motion.div className={styles.skeletonDate}>
                <motion.div
                  className={styles.shimmer}
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
              <motion.div className={styles.skeletonPaymentAmount}>
                <motion.div
                  className={styles.shimmer}
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
              <motion.div className={styles.skeletonStoreName}>
                <motion.div
                  className={styles.shimmer}
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
            </motion.div>
            <motion.div className={styles.skeletonCheck}>
              <motion.div className={styles.skeletonCircle}>
                <motion.div
                  className={styles.shimmer}
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
        {/* <motion.div
          className={styles.skeletonContainer}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className={styles.skeletonInfo} variants={itemVariants}>
            <motion.div className={styles.skeletonDate}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
            <motion.div className={styles.skeletonPaymentAmount}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
            <motion.div className={styles.skeletonStoreName}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </motion.div>
          <motion.div className={styles.skeletonCheck} variants={itemVariants}>
            <motion.div className={styles.skeletonCircle}>
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </motion.div>
        </motion.div>*/}
      </motion.div>
    </>
  );
};
