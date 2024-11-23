import styles from './manual-shared-payment-form.module.css';
import plusIcon from './assets/plus.png';
import arrowDownIcon from './assets/arrow_down.png';
import clockIcon from './assets/clock.png';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import DatePickerModal from './date-picker-modal';
import { formatDate, formatTime } from '@withbee/utils';
import { TimePickerModal } from './time-picker-modal';
import { CurrencyUnitPickerModal } from './currency-unit-picker-modal';
import { Button } from './button';
import { getCurrencyData } from '@withbee/apis';

export interface ManualPaymentFormData {
  date: string;
  time: string;
  storeName: string;
  paymentAmount: number;
  foreignPaymentAmount: number;
  currencyUnit: string;
  exchangeRate: number;
  paymentImage: File | null;
  paymentComment: string;
  isMainImage: boolean;
}

interface ManualSharedPaymentFormProps {
  formData: ManualPaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<ManualPaymentFormData>>;
  currencyUnitOptions: string[];
  handleSubmitForm: () => Promise<void>;
}

export const ManualSharedPaymentForm = ({
  formData,
  setFormData,
  currencyUnitOptions,
  handleSubmitForm,
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

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paymentAmount =
      e.target.value === ''
        ? 0
        : parseInt(e.target.value) < 0
          ? 0
          : parseInt(e.target.value);
    setFormData({
      ...formData,
      paymentAmount: paymentAmount,
    });
  };

  const handleForeignPaymentChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const foreignPaymentAmount =
      e.target.value === ''
        ? 0
        : parseFloat(e.target.value) < 0
          ? 0
          : parseFloat(e.target.value);
    setFormData({
      ...formData,
      foreignPaymentAmount,
    });
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

  // currencyUnit이 변경될 때마다 getCurrencyData를 호출하여 환율 데이터 가져오기
  useEffect(() => {
    const fetchCurrencyData = async () => {
      if (formData.currencyUnit !== 'KRW') {
        // 'KRW'일 경우 요청하지 않음
        const exchangeRate = await getCurrencyData(
          formData.date === '' ? 'latest' : formData.date,
          'v1',
          formData.currencyUnit,
        );
        if (exchangeRate !== null) {
          setFormData((prev) => ({
            ...prev,
            exchangeRate,
          }));
        }
      }
    };
    fetchCurrencyData();
  }, [formData.currencyUnit, formData.date]);

  useEffect(() => {
    const calculatedPaymentAmount = Math.floor(
      formData.foreignPaymentAmount * formData.exchangeRate,
    );
    setFormData((prev) => ({
      ...prev,
      paymentAmount: calculatedPaymentAmount,
    }));
  }, [formData.exchangeRate, formData.foreignPaymentAmount]);

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
          <p className={formData.time === '' ? styles.emptyInput : ''}>
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
          value={formData.storeName ?? ''}
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
              value={formData.paymentAmount === 0 ? '' : formData.paymentAmount}
              onChange={handlePaymentChange}
              className={styles.input}
            />
          ) : (
            <input
              type="number"
              placeholder="화폐 단위를 설정해주세요."
              value={
                formData.foreignPaymentAmount === 0
                  ? ''
                  : formData.foreignPaymentAmount
              }
              onChange={handleForeignPaymentChange}
              className={styles.paymentInput}
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
        <div className={styles.exchangeRate}>
          {formData.foreignPaymentAmount !== 0 && (
            <div>
              <span>₩ </span>
              <span>{formData.paymentAmount?.toLocaleString()}</span>
            </div>
          )}
        </div>
        {isUnitModalOpen && (
          <CurrencyUnitPickerModal
            title="화폐 단위 선택"
            isOpen={isUnitModalOpen}
            currencyUnits={currencyUnitOptions}
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
