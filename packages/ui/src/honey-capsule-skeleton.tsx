import { motion } from 'framer-motion';
import styles from './honey-capsule-skeleton.module.css';

export const HoneyCapsuleSkeleton = () => {
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
      <motion.div
        className={styles.skeletonWrapper}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Date Skeleton */}
        <motion.div className={styles.skeletonDate} variants={itemVariants}>
          <motion.div
            className={styles.shimmer}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>

        {/* HoneyCapsuleBox Skeleton */}
        <div className={styles.skeletonHoneyCapsule}>
          {Array.from({ length: 2 }).map((_, idx) => (
            <motion.div
              key={idx}
              className={styles.skeletonHoneyCapsuleBox}
              variants={itemVariants}
            >
              <motion.div
                className={styles.shimmer}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
};
