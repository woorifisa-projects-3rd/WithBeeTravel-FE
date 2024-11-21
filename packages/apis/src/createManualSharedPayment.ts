import { instance } from './instance';
import { ManualPaymentFormData } from '../../ui/src/manual-shared-payment-form';
import { SuccessResponse } from '@withbee/types';

export const createManualSharedPayment = async (
  travelId: string,
  formData: ManualPaymentFormData,
) => {
  const formDataToSend = new FormData();

  // 필수값
  formDataToSend.append('paymentDate', `${formData.date} ${formData.time}`);
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
