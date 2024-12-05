import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments, getTravelHome } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import { SettlementButton } from '@withbee/ui/settlement-button';
import dayjs from 'dayjs';

dayjs.locale('ko');

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

  if ('code' in travelHomeResponse) {
    console.error('Travel home error:', travelHomeResponse); // 로깅 추가
    throw new Error(
      ERROR_MESSAGES[travelHomeResponse.code as keyof typeof ERROR_MESSAGES],
    );
  }

  if ('code' in sharedPaymentsResponse) {
    console.error('Shared payments error:', sharedPaymentsResponse); // 로깅 추가
    throw new Error(
      ERROR_MESSAGES[
        sharedPaymentsResponse.code as keyof typeof ERROR_MESSAGES
      ],
    );
  }

  // console.log(travelHomeResponse.data);

  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentList
        travelId={Number(id)}
        initialPayments={sharedPaymentsResponse.data}
        travelInfo={travelHomeResponse.data!}
      />
      {travelHomeResponse.data?.travelEndDate &&
        dayjs(travelHomeResponse.data.travelEndDate).isBefore(dayjs()) && (
          <SettlementButton travelInfo={travelHomeResponse.data} />
        )}
    </Suspense>
  );
}
