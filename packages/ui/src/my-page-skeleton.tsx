import { motion } from 'framer-motion';
import styles from './my-page-skeleton.module.css';

export const MyPageSkeleton = () => {
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
    <div className={styles.content}>
      {/* Profile Image */}
      <motion.div className={styles.skeletonProfileImage}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Username */}
      <motion.div className={styles.skeletonUsername}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Logout Button */}
      <motion.div className={styles.skeletonLogout}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Account Section */}
      <div className={styles.changeAccountWrapper}>
        <motion.div className={styles.skeletonChangeAccountTitle}>
          <motion.div
            className={styles.shimmer}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>
        <motion.div className={styles.skeletonChangeAccountComment}>
          <motion.div
            className={styles.shimmer}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>
        <motion.div className={styles.skeletonAccount}>
          <motion.div
            className={styles.shimmer}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>
      </div>
    </div>
  );
};
