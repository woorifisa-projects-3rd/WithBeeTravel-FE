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

  const { showToast, formValidation } = useToast();
  const handleSubmit = async () => {
    // 결제일자 입력 검증
    if (!validateInputForm('date')) {
      formValidation.invalidPaymentDate();
      return;
    }
    // 결제 시간 입력 검증
    if (!validateInputForm('time')) {
      formValidation.invalidPaymentTime();
      return;
    }
    // 상호명 입력 검증
    if (!validateInputForm('storeName')) {
      formValidation.invalidPaymentStoreName();
      return;
    }
    // 결제 금액 입력 검증
    if (
      (formData.currencyUnit !== 'KRW' &&
        !validateInputForm('foreignPaymentAmount')) ||
      !validateInputForm('paymentAmount')
    ) {
      formValidation.invalidPaymentAmount();
      return;
    }

    // 결제 내역 저장 요청
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

  const validateInputForm = (type: string): boolean => {
    if (type === 'date' && formData.date === '') return false;
    else if (type === 'time' && formData.time === '') return false;
    else if (type === 'storeName' && formData.storeName === '') return false;
    else if (type === 'paymentAmount' && formData.paymentAmount === 0)
      return false;
    else if (
      type === 'foreignPaymentAmount' &&
      formData.foreignPaymentAmount === 0
    )
      return false;

    return true;
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
