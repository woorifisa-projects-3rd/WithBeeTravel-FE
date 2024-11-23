'use client';

import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import {
  ManualSharedPaymentForm,
  ManualPaymentFormData,
} from '@withbee/ui/manual-shared-payment-form';
import { useState } from 'react';
import { createManualSharedPayment } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useRouter } from 'next/navigation';

interface ManualRegisterSharedPaymentProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: ManualRegisterSharedPaymentProps) {
  const { id } = params;
  const router = useRouter();
  const [formData, setFormData] = useState<ManualPaymentFormData>({
    date: '',
    time: '',
    storeName: '',
    paymentAmount: 0,
    foreignPaymentAmount: 0,
    currencyUnit: 'KRW',
    exchangeRate: 0,
    paymentImage: null,
    paymentComment: '',
    isMainImage: false,
  });
  const [currencyUnitOptions, setCurrencyUnitOptions] = useState([
    'USD',
    'EUR',
    'JPY',
    'CNY',
    'KRW',
    'GBP',
    'AUD',
    'CAD',
    'NZD',
    'MXN',
    'INR',
    'BRL',
    'ZAR',
    'SEK',
    'NOK',
    'DKK',
    'CHF',
    'HKD',
    'SGD',
    'THB',
    'TRY',
    'MYR',
    'PHP',
    'AED',
    'SAR',
    'KWD',
    'BHD',
    'QAR',
    'OMR',
    'JOD',
    'LBP',
    'EGP',
    'IDR',
    'PKR',
    'TWD',
    'VND',
    'COP',
    'PEN',
    'CLP',
    'ARS',
  ]);

  const { showToast } = useToast();
  const handleSubmit = async () => {
    const response = await createManualSharedPayment(id, formData);

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }

    router.push(`/travel/${id}/payments`);
  };

  return (
    <div>
      <Title label="결제 내역 직접 추가" />
      <ManualSharedPaymentForm
        formData={formData}
        setFormData={setFormData}
        currencyUnitOptions={currencyUnitOptions}
        handleSubmitForm={handleSubmit}
      />
    </div>
  );
}
