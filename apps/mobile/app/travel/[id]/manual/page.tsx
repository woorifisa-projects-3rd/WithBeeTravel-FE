'use client';

import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import {
  ManualSharedPaymentForm,
  ManualPaymentFormData,
} from '@withbee/ui/manual-shared-payment-form';
import { useState, useEffect } from 'react';
import {
  createManualSharedPayment,
  getCurrencyUnitOptions,
} from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { useTransition } from 'react';
import { Button } from '@withbee/ui/button';

interface ManualRegisterSharedPaymentProps {
  params: {
    id: string;
  };
}

const getPaymentDate = (date: string, time: string): string => {
  const [amPm, hourMinute] = time.split(' ');

  // 시간 형식이 잘못된 경우 처리
  if (!hourMinute) {
    throw new Error('Invalid time format');
  }

  const [hourStr, minuteStr] = hourMinute.split(':');

  // 시간 또는 분이 없는 경우 처리
  if (!hourStr || !minuteStr) {
    throw new Error('Invalid time format');
  }

  let hour = parseInt(hourStr, 10);

  // 오전/오후 처리
  if (amPm === '오후' && hour !== 12) {
    hour += 12; // 오후는 12를 더해줌
  } else if (amPm === '오전' && hour === 12) {
    hour = 0; // 오전 12시는 자정이므로 0으로 처리
  }

  return `${date} ${hour.toString().padStart(2, '0')}:${minuteStr.padStart(2, '0')}`;
};

export default function Page({ params }: ManualRegisterSharedPaymentProps) {
  const { id } = params;
  const router = useRouter();
  const { showToast, formValidation } = useToast();
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
  const [currencyUnitOptions, setCurrencyUnitOptions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleGetCurrencyUnitOptions = async () => {
    const response = await getCurrencyUnitOptions(id);

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }

    if (response.data)
      setCurrencyUnitOptions(response.data.currencyUnitOptions);
  };

  useEffect(() => {
    // 통화 코드 목록 불러오기
    handleGetCurrencyUnitOptions();
  }, []);

  const handleSubmit = () => {
    startTransition(() => {
      void (async () => {
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

        const formDataToSend = new FormData();

        // 필수값
        formDataToSend.append(
          'paymentDate',
          getPaymentDate(formData.date, formData.time),
        );
        formDataToSend.append('storeName', formData.storeName);
        formDataToSend.append(
          'paymentAmount',
          formData.paymentAmount.toString(),
        );
        formDataToSend.append('currencyUnit', formData.currencyUnit);
        formDataToSend.append('isMainImage', formData.isMainImage.toString());
        formDataToSend.append(
          'paymentImage',
          formData.paymentImage ? formData.paymentImage : new Blob(),
        );
        formDataToSend.append('paymentComment', formData.paymentComment);

        if (formData.foreignPaymentAmount !== 0)
          formDataToSend.append(
            'foreignPaymentAmount',
            formData.foreignPaymentAmount.toString(),
          );

        if (formData.exchangeRate !== 0)
          formDataToSend.append(
            'exchangeRate',
            formData.exchangeRate.toString(),
          );

        // 결제 내역 저장 요청
        const response = await createManualSharedPayment(id, formDataToSend);

        if ('code' in response) {
          showToast.warning({
            message:
              ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
              'Unknown Error',
          });

          mutate((key: string) => key.startsWith(`sharedPayments-${id}`));
          throw new Error(response.code);
        }
      })();
    });
    router.back();
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
      <div className={styles.btnWrapper}>
        <Button
          onClick={handleSubmit}
          label={isPending ? '추가 중...' : '결제 내역 추가'}
          disabled={isPending}
        />
      </div>
    </div>
  );
}
