import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments, getTravelMembers } from '@withbee/apis';
import { TravelStoreInitializer } from '@withbee/stores';
import { ERROR_MESSAGES } from '@withbee/exception';
import { Button } from '@withbee/ui/button';
import styles from './page.module.css';

interface TravelPageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: TravelPageProps) {
  const { id } = params;
  const isLeader = false;
  const [travelMembersResponse, sharedPaymentsResponse] = await Promise.all([
    getTravelMembers(Number(id)),
    getSharedPayments({ travelId: Number(id) }),
  ]);

  if ('code' in travelMembersResponse || 'code' in sharedPaymentsResponse) {
    throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
  }

  return (
    <>
      <TravelStoreInitializer travelMembers={travelMembersResponse.data} />
      <Suspense fallback={<PaymentSkeleton />}>
        <PaymentList
          travelId={Number(id)}
          initialPayments={sharedPaymentsResponse.data}
        />
        {/* <div className={styles.btnWrapper}>
          <Button
            label="정산 시작하기" // 동의하러 가기 | 정산 현황 확인 | 정산 시작하기
            primary={false}
            // size="large"
            className={styles.info}
            shadow={true}
          />
        </div> */}
      </Suspense>
    </>
  );
}
