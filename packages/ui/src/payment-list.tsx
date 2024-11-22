'use client';

import type { PageResponse, SharedPayment, TravelMember } from '@withbee/types';
import styles from './payment-list.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { getSharedPayments } from '@withbee/apis';
import { usePaymentStore } from '@withbee/stores';
import useSWRInfinite from 'swr/infinite';
import dayjs from 'dayjs';
import { Payment } from './payment';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useToast } from '@withbee/hooks/useToast';
import { getDateObject } from '@withbee/utils';
import { PaymentSkeleton } from './payment-skeleton';

interface PaymentListProps {
  travelId: number;
  initialPayments?: PageResponse<SharedPayment> | undefined;
}

export default function PaymentList({
  travelId,
  initialPayments,
}: PaymentListProps) {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    isDateFiltered,
    memberId,
  } = usePaymentStore();
  const { showToast } = useToast();

  // Intersection Observer로 특정 요소가 화면에 보이는지 감지
  const { ref, inView } = useInView({
    threshold: 0.1, // 요소가 10% 보일 때 감지
  });

  const getKey = (pageIndex: number) => {
    const params = new URLSearchParams({
      page: pageIndex.toString(),
      sortBy,
      memberId: memberId.toString(),
    });

    // 날짜 필터가 적용된 경우에만 날짜 파라미터 추가
    if (isDateFiltered) {
      params.append('startDate', startDate);
      params.append('endDate', endDate);
    }

    return `/api/travels/${travelId}/payments?${params.toString()}`;
  };

  // SWR Infinite로 페이지네이션 데이터 관리
  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite(
      getKey,
      async (url) => {
        const response = await getSharedPayments({
          travelId,
          page: parseInt(url.split('page=')[1]!, 10), // URL에서 페이지 번호 추출
          sortBy,
          ...(isDateFiltered && { startDate, endDate }), // 조건부로 날짜 추가
          ...(memberId !== 0 && { memberId }), // 조건부로 멤버 추가
        });

        if ('code' in response) {
          throw response; // 에러 코드가 있는 응답은 그대로 throw
        }

        return response.data;
      },
      {
        fallbackData: initialPayments ? [initialPayments] : undefined,
        suspense: true,
        onError: (err) => {
          if ('code' in err) {
            if (err.code === 'VALIDATION-003') {
              if (new Date(startDate) > new Date(endDate)) {
                setEndDate(getDateObject(startDate));
              } else {
                setStartDate(getDateObject(endDate));
              }
            }
            showToast.warning({
              message: ERROR_MESSAGES[err.code as keyof typeof ERROR_MESSAGES],
            });
          } else {
            showToast.error({
              message: ERROR_MESSAGES['FETCH-FAILED'],
            });
          }
        },
      },
    );

  // 모든 페이지의 결제내역을 하나의 배열로 합치기
  const payments = data?.flatMap((page) => page?.content ?? []) ?? [];

  // 날짜별로 결제 내역을 그룹화하는 함수
  const groupPaymentsByDate = (payments: SharedPayment[]) => {
    // reduce를 사용해 날짜별로 결제내역을 그룹화
    const grouped = payments.reduce(
      (acc: Record<string, SharedPayment[]>, payment) => {
        // 각 결제의 날짜를 'YYYY년 MM월 DD일' 형식으로 변환
        const date = dayjs(payment.paymentDate).format('YYYY년 MM월 DD일');
        // 해당 날짜의 배열이 없으면 생성
        if (!acc[date]) {
          acc[date] = [];
        }
        // 결제내역을 해당 날짜 배열에 추가
        acc[date].push(payment);
        return acc;
      },
      {},
    );

    // Object.entries로 [날짜, 결제내역배열] 형태의 배열로 변환하고
    // 날짜 기준으로 내림차순 정렬
    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      return dayjs(dateB, 'YYYY년 MM월 DD일').diff(
        dayjs(dateA, 'YYYY년 MM월 DD일'),
      );
    });
  };

  // 다음 페이지 로드 조건 체크
  useEffect(() => {
    const isLastPage = data && data[data.length - 1]?.last;
    const hasError = error || data?.some((page) => page === null);
    const shouldLoadMore =
      inView && !isLoading && !isValidating && !isLastPage && !hasError;

    if (shouldLoadMore) {
      setSize(size + 1);
    }
  }, [inView, isLoading, isValidating, data, error, size, setSize]);

  // 정렬이나 날짜 필터가 변경될 때 리셋
  useEffect(() => {
    setSize(1);
  }, [sortBy, startDate, endDate, setSize]);

  return (
    <AnimatePresence>
      <section className={styles.paymentContainer}>
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {sortBy === 'latest'
            ? // 최신순일 때는 날짜별 그룹화
              groupPaymentsByDate(payments).map(([date, payments], index) => (
                <div
                  className={styles.paymentWrapper}
                  key={`payments-${index}`}
                >
                  <span className={styles.date}>{date}</span>
                  {payments.map((payment, idx) => (
                    <Payment
                      key={`payment-${payment.id}-${idx}`}
                      travelId={travelId}
                      paymentInfo={payment}
                    />
                  ))}
                </div>
              ))
            : // 금액순일 때는 그룹화 없이 바로 렌더링
              payments.map((payment) => (
                <Payment
                  key={payment.id}
                  travelId={travelId}
                  paymentInfo={payment}
                />
              ))}
        </motion.div>
      </section>

      {/* 이 요소가 화면에 보이면 다음 데이터를 로드 */}
      <div ref={ref}>
        {isValidating && !error && size > 1 && <PaymentSkeleton count={1} />}
      </div>
    </AnimatePresence>
  );
}
