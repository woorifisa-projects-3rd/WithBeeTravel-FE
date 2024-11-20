import styles from './manual-shared-payment-form.module.css';

export interface ManualPaymentFormData {
  data: string;
  time: string;
  paymentAmount: number;
  foreignPaymentAmount: number | null;
  currencyUnit: string | 'KRW';
  exchangeRate: number | null;
  paymentImage: File | null;
  paymentComment: string | null;
  isMainImage: boolean | false;
}

interface ManualSharedPaymentFormProps {
  formData: ManualPaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ManualPaymentFormData>>;
}

export const ManualSharedPaymentForm = ({
  formData,
  setFormData,
}: ManualSharedPaymentFormProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, paymentImage: e.target.files[0] });
    }
  };

  return (
    <div className={styles.manualPayment}>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>결제일자</span>
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>결제 시간</span>
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>상호명</span>
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>결제 금액</span>
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>사진 추가</span>
        <input
          id="paymentImageFileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.paymentImage}
        />
        <label
          htmlFor="paymentImageFileInput"
          className={styles.paymentImageBox}
        ></label>
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>문구</span>
      </div>
    </div>
  );
};
