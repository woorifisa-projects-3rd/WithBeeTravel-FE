'use client';

import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import {
  ManualSharedPaymentForm,
  ManualPaymentFormData,
} from '@withbee/ui/manual-shared-payment-form';
import { useState } from 'react';

interface ManualRegisterSharedPaymentProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: ManualRegisterSharedPaymentProps) {
  const { id } = params;
  const [formData, setFormData] = useState<ManualPaymentFormData>({
    date: '',
    time: '',
    paymentAmount: 0,
    foreignPaymentAmount: null,
    currencyUnit: 'KRW',
    exchangeRate: null,
    paymentImage: null,
    paymentComment: '',
    isMainImage: false,
  });

  return (
    <div>
      <Title label="결제 내역 직접 추가" />
      <ManualSharedPaymentForm formData={formData} setFormData={setFormData} />
    </div>
  );
}
