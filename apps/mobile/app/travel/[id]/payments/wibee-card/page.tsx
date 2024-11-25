'use client';

import styles from './page.module.css';
import WibeeCardPayment from '@withbee/ui/wibee-card-payment';
import { WibeeCardHistory } from '@withbee/types';
import { Title } from '@withbee/ui/title';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import { useToast } from '@withbee/hooks/useToast';
import { useState, useEffect } from 'react';
// import DatePickerModal from '@withbee/ui/date-picker-modal';

interface WibeeCardProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: WibeeCardProps) {
  const { id } = params;
  // const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const response: {
    data: {
      startDate: string;
      endDate: string;
      histories: WibeeCardHistory[];
    };
  } = {
    data: {
      startDate: '',
      endDate: '',
      histories: [
        {
          id: 1,
          date: '2024-11-19T14:20',
          paymentAmount: 50000,
          storeName: '명수네 떡볶이',
          isAddedSharedPayment: true,
        },
        {
          id: 2,
          date: '2024-11-20T13:29',
          paymentAmount: 120000,
          storeName: '호처루냉면',
          isAddedSharedPayment: false,
        },
        {
          id: 3,
          date: '2024-11-20T15:34',
          paymentAmount: 30000,
          storeName: '콩에진보드게임카페',
          isAddedSharedPayment: true,
        },
        {
          id: 4,
          date: '2024-11-19T14:20',
          paymentAmount: 50000,
          storeName: '명수네 떡볶이',
          isAddedSharedPayment: true,
        },
        {
          id: 5,
          date: '2024-11-20T13:29',
          paymentAmount: 120000,
          storeName: '호처루냉면',
          isAddedSharedPayment: false,
        },
        {
          id: 6,
          date: '2024-11-20T15:34',
          paymentAmount: 30000,
          storeName: '콩에진보드게임카페',
          isAddedSharedPayment: true,
        },
        {
          id: 7,
          date: '2024-11-19T14:20',
          paymentAmount: 50000,
          storeName: '명수네 떡볶이',
          isAddedSharedPayment: true,
        },
        {
          id: 8,
          date: '2024-11-20T13:29',
          paymentAmount: 120000,
          storeName: '호처루냉면',
          isAddedSharedPayment: false,
        },
        {
          id: 9,
          date: '2024-11-20T15:34',
          paymentAmount: 30000,
          storeName: '콩에진보드게임카페',
          isAddedSharedPayment: true,
        },
      ],
    },
  };
  const initialData = 'data' in response ? response.data.histories : null;

  const [selectedHistoryIds, setSelectedHistoryIds] = useState<number[]>([]);
  const { showToast } = useToast();
  const handleSelectHistories = (id: number): void => {
    setSelectedHistoryIds(
      (prevIds) =>
        prevIds.includes(id)
          ? prevIds.filter((prevId) => prevId !== id) // 이미 선택된 경우 제거
          : [...prevIds, id], // 선택되지 않은 경우 추가
    );
  };

  useEffect(() => {
    console.log(selectedHistoryIds);
  }, [selectedHistoryIds]);

  const alreadyAddedError = (id: number): void => {
    showToast.info({ message: `이미 추가된 결제 내역입니다.` });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <Title label="위비 카드 결제 내역 불러오기" />
          <div className={styles.optionWrapper}>
            <Button label="전체 선택" size="xsmall" />
            <div className={styles.dateSelect}>
              <span>2024.11.21 ~ 2024.11.23</span>
              <Item label="기간 선택" size="small" type="select" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.historyWrapper}>
        {initialData?.map((history) => (
          <WibeeCardPayment
            key={history.id}
            payment={history}
            handleSelectHistory={
              history.isAddedSharedPayment
                ? handleSelectHistories
                : alreadyAddedError
            }
          />
        ))}
      </div>
      <div className={styles.submitButtonBackground}>
        <div className={styles.submitButtonWrapper}>
          <Button label="선택 완료" />
        </div>
      </div>
    </div>
  );
}
