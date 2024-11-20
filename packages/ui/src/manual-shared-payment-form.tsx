import styles from './manual-shared-payment-form.module.css';
import plusIcon from './assets/plus.png';
import arrowDownIcon from './assets/arrow_down.png';
import clockIcon from './assets/clock.png';
import Image from 'next/image';
import { useState } from 'react';
import DatePickerModal from './date-picker-modal';
import { formatDate } from '../../../packages/utils/dateUtils';
import { formatTime } from '../../../packages/utils/timeUtils';
import { TimePickerModal } from './time-picker-modal';
import { CurrencyUnitPickerModal } from './currency-unit-picker-modal';
import { Button } from './button';

export interface ManualPaymentFormData {
  date: string;
  time: string;
  storeName: string;
  paymentAmount: number;
  foreignPaymentAmount: number;
  currencyUnit: string | 'KRW';
  exchangeRate: number | undefined;
  paymentImage: File | undefined;
  paymentComment: string | undefined;
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
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleDateSelect = (date: {
    year: number;
    month: number;
    day: number;
  }) => {
    const formattedDate = formatDate(date);
    setFormData((formDate) => ({
      ...formDate,
      date: formattedDate,
    }));
  };

  const handleTimeSelect = (time: { hour: number; minute: number }) => {
    const formattedTime = formatTime(time);
    setFormData((formDate) => ({
      ...formDate,
      time: formattedTime,
    }));
  };

  const handleCurrencyUnitSelect = (currencyUnit: string) => {
    setFormData((formDate) => ({
      ...formDate,
      currencyUnit: currencyUnit,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, paymentImage: e.target.files[0] });
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getDateObject = (dateString: string) => {
    const date = new Date(dateString);

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  };

  const getTimeObject = (
    timeString: string,
  ): { hour: number | undefined; minute: number | undefined } => {
    const [hour, minute] = timeString.split(':').map(Number);
    return {
      hour,
      minute,
    };
  };

  const handleSubmitForm = () => {};

  return (
    <div className={styles.manualPayment}>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>결제일자</span>
        <div
          className={`${styles.input} ${styles.rowInput}`}
          onClick={() => setIsDateModalOpen(true)}
        >
          <p className={formData.date === '' ? styles.emptyInput : ''}>
            {formData.date === '' ? 'YYYY-MM-DD' : formData.date}
          </p>
          <span className={styles.customIcon}>
            <Image
              src="/imgs/travelform/cal.png"
              alt="달력 아이콘"
              width={21}
              height={21}
            />
          </span>
          <DatePickerModal
            title="결제일자 입력"
            isOpen={isDateModalOpen}
            initialDate={getDateObject(formData.date)}
            onSelectDate={handleDateSelect}
            onClose={() => setIsDateModalOpen(false)}
          />
        </div>
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>결제 시간</span>
        <div
          className={`${styles.input} ${styles.rowInput}`}
          onClick={() => setIsTimeModalOpen(true)}
        >
          <p className={formData.date === '' ? styles.emptyInput : ''}>
            {formData.time === '' ? 'HH:MM' : formData.time}
          </p>
          <span className={styles.customIcon}>
            <Image
              src={clockIcon}
              alt="결제 시간 입력"
              width={21}
              height={21}
            />
          </span>
        </div>
        {isTimeModalOpen && (
          <TimePickerModal
            title="결제 시간 입력"
            isOpen={isTimeModalOpen}
            initialTime={getTimeObject(formData.time)}
            onSelectTime={handleTimeSelect}
            onClose={() => setIsTimeModalOpen(false)}
          />
        )}
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>상호명</span>
        <input
          type="text"
          placeholder="상호명을 입력해주세요."
          value={formData.storeName}
          onChange={(e) =>
            setFormData({ ...formData, storeName: e.target.value })
          }
          className={styles.input}
        />
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>결제 금액</span>
        <div className={`${styles.input} ${styles.rowInput}`}>
          {formData.currencyUnit === 'KRW' ? (
            <input
              type="number"
              placeholder="화폐 단위를 설정해주세요."
              value={formData.paymentAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentAmount: parseInt(e.target.value),
                })
              }
              className={styles.input}
            />
          ) : (
            <input
              type="number"
              placeholder="화폐 단위를 설정해주세요."
              value={formData.foreignPaymentAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  foreignPaymentAmount: parseFloat(e.target.value),
                })
              }
              className={styles.input}
            />
          )}
          <div
            className={styles.selectUnitWrapper}
            onClick={() => setIsUnitModalOpen(true)}
          >
            <span>{formData.currencyUnit}</span>
            <Image
              src={arrowDownIcon}
              alt="화폐 단위 선택 아이콘"
              width={13}
              height={7}
            />
          </div>
        </div>
        {isUnitModalOpen && (
          <CurrencyUnitPickerModal
            title="화폐 단위 선택"
            isOpen={isUnitModalOpen}
            currencyUnits={['KRW', 'USD', 'KRW', 'kRW']}
            onSelectCurrency={handleCurrencyUnitSelect}
            onClose={() => setIsUnitModalOpen(false)}
          />
        )}
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
        >
          {imageSrc === null ? (
            <Image
              src={plusIcon}
              alt="이미지를 선택하세요"
              className={styles.imagePreview}
            />
          ) : (
            <Image
              src={imageSrc}
              alt="업로드된 이미지 미리보기"
              className={styles.imagePreview}
              width={280}
              height={207}
            />
          )}
        </label>
      </div>
      <div className={styles.formWrapper}>
        <span className={styles.formTitle}>문구</span>
        <textarea
          value={formData.paymentComment}
          onChange={(e) =>
            setFormData({
              ...formData,
              paymentComment: e.target.value,
            })
          }
          placeholder="문구를 작성해주세요."
          className={styles.recordComment}
          maxLength={100}
        />
      </div>
      <Button onClick={handleSubmitForm} label="결제 내역 추가" />
    </div>
  );
};
