import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './payment-error.module.css';

export const PaymentError = () => {
  return (
    <motion.div
      className={styles.errorContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Image
        src="/imgs/friends/notfound.png"
        alt="에러 이미지"
        width={140}
        height={140}
        className={styles.errorImage}
      />
      <div>
        <p className={styles.errorText}>해당하는 카테고리의</p>
        <p className={styles.errorText}>공동결제내역이 존재하지 않아요.</p>
      </div>
    </motion.div>
  );
};
