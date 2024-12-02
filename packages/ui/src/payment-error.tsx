import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './payment-error.module.css';

interface PaymentErrorProps {
  message1: string;
  message2?: string;
}

export const PaymentError = ({ message1, message2 }: PaymentErrorProps) => {
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
        <p className={styles.errorText}>{message1}</p>
        <p className={styles.errorText}>{message2}</p>
      </div>
    </motion.div>
  );
};
