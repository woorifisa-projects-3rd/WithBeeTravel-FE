import { instance } from './instance';
import { ManualPaymentFormData } from '../../ui/src/manual-shared-payment-form';
import { SuccessResponse } from '@withbee/types';

export const createManualSharedPayment = async (
  travelId: string,
  formData: ManualPaymentFormData,
) => {
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

  const formDataToSend = new FormData();

  // 필수값
  formDataToSend.append(
    'paymentDate',
    getPaymentDate(formData.date, formData.time),
  );
  formDataToSend.append('storeName', formData.storeName);
  formDataToSend.append('paymentAmount', formData.paymentAmount.toString());
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
    formDataToSend.append('exchangeRate', formData.exchangeRate.toString());

  const response = await instance.post<SuccessResponse<undefined>>(
    `/api/travels/${travelId}/payments/manual`,
    {
      body: formDataToSend,
      isMultipart: true, // multipart/form-data로 전송
    },
  );
  return response;
};
