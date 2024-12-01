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

  return <PaymentError />;
}
