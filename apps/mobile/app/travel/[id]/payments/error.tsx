'use client';

// import { useToast } from '@withbee/hooks/useToast';
// import { useEffect } from 'react';
import { PaymentError } from '@withbee/ui/payment-error';
import styles from './page.module.css';

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  // const { showToast } = useToast();

  // useEffect(() => {
  //   showToast.error({
  //     message: error.message,
  //   });
  // }, [error, showToast]);

  console.error(error);

  return (
    <div className={styles.errorContainer}>
      <PaymentError
        message1="해당하는 카테고리의"
        message2="결제 내역이 존재하지 않아요."
      />
    </div>
  );
}
