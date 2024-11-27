'use client';

import styles from './page.module.css';
import WibeeCardPayment from '@withbee/ui/wibee-card-payment';
import { WibeeCardHistory } from '@withbee/types';
import { Title } from '@withbee/ui/title';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import { useToast } from '@withbee/hooks/useToast';
import { useState, useEffect } from 'react';
import { BottomModal } from '@withbee/ui/modal';
import DatePickerModal from '@withbee/ui/date-picker-modal';
import { formatDate, getDateObject } from '@withbee/utils';
import { validators } from '@withbee/utils';
import { getWibeeCardHistory } from '@withbee/apis';
import { handleWebpackExternalForEdgeRuntime } from 'next/dist/build/webpack/plugins/middleware-plugin';

interface WibeeCardProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: WibeeCardProps) {
  const { id } = params;
  const [data, setData] = useState<{
    startDate: string;
    endDate: string;
    histories: WibeeCardHistory[];
  }>();

  const [selectedHistoryIds, setSelectedHistoryIds] = useState<number[]>([]);
  const { showToast, formValidation } = useToast();

  // 결제 내역 선택 핸들러
  const handleSelectHistories = (id: number): void => {
    setSelectedHistoryIds(
      (prevIds) =>
        prevIds.includes(id)
          ? prevIds.filter((prevId) => prevId !== id) // 이미 선택된 경우 제거
          : [...prevIds, id], // 선택되지 않은 경우 추가
    );
  };

  // 전체 결제 내역 선택 핸들러
  const handleOverallSelectHistories = (): void => {
    if (data?.histories) {
      const unselectedIds = data.histories
        .filter((history) => !history.isAddedSharedPayment) // isAddedSharedPayment가 false인 항목만 필터링
        .map((history) => history.id); // 해당 항목들의 id만 추출

      setSelectedHistoryIds(unselectedIds); // 상태를 업데이트
    }
  };

  // 이미 추가된 결제 내역 선택 시 메세지
  const alreadyAddedError = (id: number): void => {
    showToast.info({ message: `이미 추가된 결제 내역입니다.` });
  };

  // 기간 선택 관련 변수
  const [startDate, setStartDate] = useState<string>(
    data ? data.startDate : '',
  );
  const [endDate, setEndDate] = useState<string>(data ? data.endDate : '');
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isStartDateModalOpen, setIsStartDateModalOpen] =
    useState<boolean>(false);
  const [isEndDateModalOpen, setIsEndDateModalOpen] = useState<boolean>(false);

  const handleDateSelect =
    (type: 'start' | 'end') =>
    (date: { year: number; month: number; day: number }) => {
      const formattedDate = formatDate(date);
      type === 'start'
        ? setStartDate(formattedDate)
        : setEndDate(formattedDate);
    };

  // 기간이 변경되었을 때 검증 후 결제 내역 다시 불러오기
  const handleChangePeriod = () => {
    setIsDateModalOpen(false);

    // 날짜 범위 검증
    const dateValidation = validators.paymentDates(startDate, endDate);
    if (!dateValidation.isValid) {
      if (dateValidation.error === 'INVALID_ORDER') {
        formValidation.invalidDateOrder();
        // 기존의 날짜로 다시 변경
        setStartDate(data ? data.startDate : '');
        setEndDate(data ? data.endDate : '');
      }
      return;
    }
  };

  // 위비 카드 결제 내역 API 요청
  const handleGetWibeeCardHistories = async () => {
    try {
      const response = await getWibeeCardHistory(startDate, endDate);

      if ('code' in response) {
        showToast.warning({ message: response.message });
      }

      if ('data' in response && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('결제 내역 불러오기 실패');
    }
  };

  useEffect(() => {
    handleGetWibeeCardHistories();
  }, [startDate, endDate]);

  return (
    <div className={styles.container}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <Title label="위비 카드 결제 내역 불러오기" />
          <div className={styles.optionWrapper}>
            <Button
              label="전체 선택"
              size="xsmall"
              onClick={handleOverallSelectHistories}
            />
            <div className={styles.dateSelect}>
              <span>
                {startDate?.split('-').join('.')} ~{' '}
                {endDate?.split('-').join('.')}
              </span>
              <Item
                label="기간 설정"
                size="small"
                type="select"
                onClick={() => setIsDateModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      {isDateModalOpen && (
        <div>
          <BottomModal
            isOpen={isDateModalOpen}
            onClose={handleChangePeriod}
            title="기간 설정"
            disableDrag={true}
          >
            <ul className={styles.list}>
              {/* <li onClick={handleSelectAllDate}>
                전체
                {selected.period === '전체' && (
                  <Image src={selectIcon} alt="select" width={25} height={25} />
                )}
              </li> */}
              <li onClick={() => setIsStartDateModalOpen(true)}>
                시작일
                <span>{startDate?.split('-').join('.')}</span>
              </li>
              <li onClick={() => setIsEndDateModalOpen(true)}>
                종료일
                <span>{endDate?.split('-').join('.')}</span>
              </li>
            </ul>
          </BottomModal>
          <DatePickerModal
            title="시작일"
            isOpen={isStartDateModalOpen}
            initialDate={data ? getDateObject(data.startDate) : undefined}
            onSelectDate={handleDateSelect('start')}
            onClose={() => setIsStartDateModalOpen(false)}
          />
          <DatePickerModal
            title="종료일"
            isOpen={isEndDateModalOpen}
            initialDate={data ? getDateObject(data.endDate) : undefined}
            onSelectDate={handleDateSelect('end')}
            onClose={() => setIsEndDateModalOpen(false)}
          />
        </div>
      )}

      <div className={styles.historyWrapper}>
        {data?.histories?.map((history) => (
          <WibeeCardPayment
            key={history.id}
            payment={history}
            isSelected={selectedHistoryIds.includes(history.id)}
            handleSelectHistory={
              history.isAddedSharedPayment
                ? alreadyAddedError
                : handleSelectHistories
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
