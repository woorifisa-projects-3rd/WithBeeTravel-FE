import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments, getTravelHome } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';

interface TravelPageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: TravelPageProps) {
  const { id } = params;
  const [travelHomeResponse, sharedPaymentsResponse] = await Promise.all([
    getTravelHome(Number(id)),
    getSharedPayments({ travelId: Number(id) }),
  ]);

  if ('code' in travelHomeResponse || 'code' in sharedPaymentsResponse) {
    throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
  }

  console.log('travelHomeResponse from payments page: ', travelHomeResponse);

  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentList
        travelId={Number(id)}
        initialPayments={sharedPaymentsResponse.data}
        travelInfo={travelHomeResponse.data!}
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
  );
}
