'use client';

import { useToast } from '@withbee/hooks/useToast';
// import { useEffect } from 'react';
import { PaymentError } from '@withbee/ui/payment-error';

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  const { showToast } = useToast();

  // useEffect(() => {
  //   showToast.error({
  //     message: error.message,
  //   });
  // }, [error, showToast]);

  console.error(error);

  return (
    <PaymentError
      message1="해당하는 카테고리의"
      message2="결제 내역이 존재하지 않아요."
    />
  );
}
