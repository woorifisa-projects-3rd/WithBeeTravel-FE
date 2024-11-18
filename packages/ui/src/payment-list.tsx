'use client';

import type { PageResponse, SharedPayment } from '@withbee/types';
import styles from './payment-list.module.css';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { getSharedPayments } from '@withbee/apis';
import useSWRInfinite from 'swr/infinite';
import dayjs from 'dayjs';
import { Payment } from './payment';

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

interface PaymentListProps {
  travelId: number;
  initialData: PageResponse<SharedPayment> | null | undefined;
}

export default function PaymentList({
  travelId,
  initialData,
}: PaymentListProps) {
  // Intersection Observer로 특정 요소가 화면에 보이는지 감지
  const { ref, inView } = useInView({
    threshold: 0.1, // 요소가 10% 보일 때 감지
  });

  const getKey = (pageIndex: number) => {
    return `/api/travels/${travelId}/payments?page=${pageIndex - 1}`; // URL 형식으로 변경
  };

  // SWR Infinite로 페이지네이션 데이터 관리
  const { data, error, size, setSize, isLoading, isValidating } =
    useSWRInfinite(
      getKey,
      async (url) => {
        const response = await getSharedPayments({
          travelId,
          page: parseInt(url.split('page=')[1]!, 10), // URL에서 페이지 번호 추출
          sortBy: 'latest',
        });
        return response.data;
      },
      {
        fallbackData: initialData ? [initialData] : undefined,
        persistSize: true, // size 상태 유지
      },
    );

  // 모든 페이지의 결제내역을 하나의 배열로 합치기
  const payments = data?.flatMap((page) => page?.content ?? []) ?? [];
  // 날짜별로 그룹화
  const groupedPayments = groupPaymentsByDate(payments);

  // 다음 페이지 로드 조건 체크
  useEffect(() => {
    const isLastPage = data && data[data.length - 1]?.last;
    const shouldLoadMore = inView && !isLoading && !isValidating && !isLastPage;

    if (shouldLoadMore) {
      console.log('Loading next page:', size + 1);
      setSize(size + 1);
    }
  }, [inView, isLoading, isValidating, data, size, setSize]);

  return (
    <section className={styles.paymentContainer}>
      {groupedPayments.map(([date, payments]) => (
        <div className={styles.paymentWrapper} key={date}>
          <span className={styles.date}>{date}</span>
          {payments.map((payment) => (
            <Payment key={payment.sharedPaymentId} paymentInfo={payment} />
          ))}
        </div>
      ))}

      {/* 이 요소가 화면에 보이면 다음 데이터를 로드 */}
      <div ref={ref} className={styles.loadingTrigger}>
        {isValidating && <div className={styles.loading}>Loading...</div>}
      </div>

      {data && data[data.length - 1]?.last && (
        <div className={styles.noMore}>더 이상 결제 내역이 없습니다</div>
      )}
    </section>
  );
}
