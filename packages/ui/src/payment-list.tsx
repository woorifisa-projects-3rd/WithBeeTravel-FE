'use client';

import type {
  PageResponse,
  SharedPayment,
  SortBy,
  TravelHome,
} from '@withbee/types';
import styles from './payment-list.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { getSharedPayments } from '@withbee/apis';
import useSWRInfinite from 'swr/infinite';
import dayjs from 'dayjs';
import { Payment } from './payment';
import { ERROR_MESSAGES } from '@withbee/exception';
import { useToast } from '@withbee/hooks/useToast';
import { PaymentSkeleton } from './payment-skeleton';
import { usePaymentParams } from '@withbee/hooks/usePaymentParams';
import { PaymentError } from './payment-error';

interface PaymentListProps {
  travelId: number;
  initialPayments?: PageResponse<SharedPayment> | undefined;
  travelInfo: TravelHome;
}

export default function PaymentList({
  travelId,
  initialPayments,
  travelInfo,
}: PaymentListProps) {
  const { params, updateParam } = usePaymentParams();
  const { sortBy, startDate, endDate, memberId, category } = params;
  const { showToast } = useToast();

  const { travelStartDate, travelEndDate } = travelInfo;

  // Intersection Observer로 특정 요소가 화면에 보이는지 감지
  const { ref, inView } = useInView({
    threshold: 0.2, // 요소가 20% 보일 때 감지
  });

  const getKey = (pageIndex: number) => {
    const params = {
      travelId,
      page: pageIndex,
      sortBy: sortBy as SortBy,
      startDate: startDate || travelStartDate,
      endDate: endDate || travelEndDate,
      ...(memberId !== 0 && { memberId }),
      ...(category !== '전체' && { category }),
    };

    // 모든 파라미터를 포함한 상세한 캐시 키
    const cacheKey = `sharedPayments-${travelId}-${sortBy}-${startDate || travelStartDate}-${
      endDate || travelEndDate
    }-${memberId}-${category}-${pageIndex}`;

    return {
      params,
      cacheKey,
    };
  };

  // SWR Infinite로 페이지네이션 데이터 관리
  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite(
      (pageIndex) => getKey(pageIndex).cacheKey,
      async (key: string, pageIndex: number) => {
        const response = await getSharedPayments(getKey(pageIndex).params);

        if ('code' in response) {
          throw response;
        }

        return response.data;
      },
      {
        fallbackData: initialPayments ? [initialPayments] : undefined,
        suspense: true,
        onError: (err) => {
          if ('code' in err) {
            if (err.code === 'VALIDATION-003') {
              if (startDate && endDate) {
                if (new Date(startDate) > new Date(endDate)) {
                  // URL 파라미터 업데이트
                  updateParam('endDate', startDate);
                } else {
                  updateParam('startDate', endDate);
                }
              }
              showToast.warning({
                message:
                  ERROR_MESSAGES[err.code as keyof typeof ERROR_MESSAGES],
              });
            }
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
  }, [sortBy, startDate, endDate, setSize, memberId, category]);

  // travelInfo에서 받아온 startDate와 endDate를 searchParams에 반영
  useEffect(() => {
    if (!startDate && !endDate) {
      updateParam('startDate', travelStartDate);
      updateParam('endDate', travelEndDate);
    }
  }, []);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <PaymentError
          message1="해당하는 카테고리의"
          message2="결제 내역이 존재하지 않아요."
        />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isLoading ? (
        <PaymentSkeleton count={2} />
      ) : (
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
                    {payments.map((payment) => (
                      <Payment
                        key={payment.id}
                        travelId={travelId}
                        paymentInfo={payment}
                        travelInfo={travelInfo}
                      />
                    ))}
                  </div>
                ))
              : // 금액순일 때는 그룹화 없이 바로 렌더링
                payments.map((payment) => (
                  <>
                    <Payment
                      key={payment.id}
                      travelId={travelId}
                      paymentInfo={payment}
                      travelInfo={travelInfo}
                    />
                  </>
                ))}
            <div ref={ref} />
          </motion.div>
        </section>
      )}

      {!isLoading && isValidating && !error && size > 1 && (
        <PaymentSkeleton count={2} />
      )}
    </AnimatePresence>
  );
}
