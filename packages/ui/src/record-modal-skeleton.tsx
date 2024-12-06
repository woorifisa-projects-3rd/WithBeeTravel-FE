import { motion } from 'framer-motion';
import styles from './record-modal-skeleton.module.css';

export const RecordModalSkeleton = () => {
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
      initial="hidden"
      animate="visible"
    >
      {/* Image Section */}
      <motion.div className={styles.skeletonImage} variants={itemVariants}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Main Image Toggle Section */}
      <motion.div className={styles.skeletonToggle} variants={itemVariants}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>

      {/* Text Area Section */}
      <motion.div className={styles.skeletonTextarea} variants={itemVariants}>
        <motion.div
          className={styles.shimmer}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
      </motion.div>
    </motion.div>
  );
};
