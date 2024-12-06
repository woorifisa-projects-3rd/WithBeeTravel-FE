'use client';

import styles from './page.module.css';
import WibeeCardPayment from '@withbee/ui/wibee-card-payment';
import { WibeeCardHistoryListResponse } from '@withbee/types';
import { Title } from '@withbee/ui/title';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';
import { useToast } from '@withbee/hooks/useToast';
import { useState, useEffect } from 'react';
import { BottomModal } from '@withbee/ui/modal';
import DatePickerModal from '@withbee/ui/date-picker-modal';
import { formatDate, getDateObject } from '@withbee/utils';
import { validators } from '@withbee/utils';
import {
  getWibeeCardHistory,
  postWibeeCardToSharedPayment,
} from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface WibeeCardProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: WibeeCardProps) {
  const { id } = params;
  const router = useRouter();
  const [data, setData] = useState<WibeeCardHistoryListResponse | undefined>();

  const [selectedHistoryIds, setSelectedHistoryIds] = useState<number[]>([]);
  const { showToast, formValidation } = useToast();
  const [isPending, startTransition] = useTransition();

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
        .filter((history) => !history.addedSharedPayment) // addedSharedPayment가 false인 항목만 필터링
        .map((history) => history.id); // 해당 항목들의 id만 추출

      setSelectedHistoryIds(unselectedIds); // 상태를 업데이트
    }
  };

  // 이미 추가된 결제 내역 선택 시 메세지
  const alreadyAddedError = (id: number): void => {
    showToast.info({ message: `이미 추가된 결제 내역입니다.` });
  };

  // 기간 선택 관련 변수
  const [periodStartDate, setPeriodStartDate] = useState<string | undefined>();
  const [periodEndDate, setPeriodEndDate] = useState<string | undefined>();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isStartDateModalOpen, setIsStartDateModalOpen] =
    useState<boolean>(false);
  const [isEndDateModalOpen, setIsEndDateModalOpen] = useState<boolean>(false);

  const handleDateSelect =
    (type: 'start' | 'end') =>
    (date: { year: number; month: number; day: number }) => {
      const formattedDate = formatDate(date);
      type === 'start'
        ? setPeriodStartDate(formattedDate)
        : setPeriodEndDate(formattedDate);
    };

  // 위비 카드 결제 내역 API 요청
  const handleGetWibeeCardHistories = async (
    startDate?: string,
    endDate?: string,
  ) => {
    const response = await getWibeeCardHistory(startDate, endDate);

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });
      throw new Error(response.code);
    }

    if (response.data) {
      setData(response.data);
      setPeriodStartDate(response.data.startDate);
      setPeriodEndDate(response.data.endDate);
    }
  };

  useEffect(() => {
    handleGetWibeeCardHistories();
  }, []);

  // 기간이 변경되었을 때 검증 후 결제 내역 다시 불러오기
  const handleChangePeriod = () => {
    setIsDateModalOpen(false);

    // 날짜 범위 검증
    const dateValidation = validators.paymentDates(
      periodStartDate,
      periodEndDate,
    );
    if (!dateValidation.isValid) {
      if (dateValidation.error === 'INVALID_ORDER') {
        formValidation.invalidDateOrder();
        // 기존의 날짜로 다시 변경
        setPeriodStartDate(data ? data.startDate : '');
        setPeriodEndDate(data ? data.endDate : '');
      }
      return;
    }

    // 기존의 날짜와 다르면 데이터 다시 요청
    if (periodStartDate !== data?.startDate || periodEndDate !== data?.endDate)
      handleGetWibeeCardHistories(periodStartDate, periodEndDate);
  };

  // 선택한 위비 카드 결제 내역 공동 결제 내역에 추가
  const handleSubmit = () => {
    startTransition(() => {
      void (async () => {
        const response = await postWibeeCardToSharedPayment(
          id,
          selectedHistoryIds,
        );

        if ('code' in response) {
          showToast.warning({
            message:
              ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
              'Unknown Error',
          });
          throw new Error(response.code);
        }

        router.push(`/travel/${id}/payments`);
      })();
    });
  };
  return (
    <div className={styles.container}>
      <Title label="위비 카드 결제 내역 불러오기" />
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <div className={styles.optionWrapper}>
            <Button
              label="전체 선택"
              size="xsmall"
              onClick={handleOverallSelectHistories}
            />
            <div className={styles.dateSelect}>
              <span>
                {data?.startDate?.split('-').join('.')} ~{' '}
                {data?.endDate?.split('-').join('.')}
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
              <li onClick={() => setIsStartDateModalOpen(true)}>
                시작일
                <span>{periodStartDate?.split('-').join('.')}</span>
              </li>
              <li onClick={() => setIsEndDateModalOpen(true)}>
                종료일
                <span>{periodEndDate?.split('-').join('.')}</span>
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
              history.addedSharedPayment
                ? alreadyAddedError
                : handleSelectHistories
            }
          />
        ))}
      </div>
      <div className={styles.submitButtonBackground}>
        <div className={styles.submitButtonWrapper}>
          <Button
            onClick={handleSubmit}
            label={isPending ? '추가 중...' : '선택 완료'}
            disabled={isPending}
          />
        </div>
      </div>
    </div>
  );
}
