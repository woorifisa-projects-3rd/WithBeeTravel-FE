'use client';

import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { useToast } from '@withbee/hooks/useToast';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  const { showToast } = useToast();

  useEffect(() => {
    showToast.error({
      message: error.message,
    });
  }, [error, showToast]);

  console.error(error);

  return <PaymentSkeleton />;
}
