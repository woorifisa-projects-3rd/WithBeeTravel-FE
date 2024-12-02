import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments, getTravelHome } from '@withbee/apis';
import { ERROR_MESSAGES } from '@withbee/exception';
import { SettlementButton } from '@withbee/ui/settlement-button';

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
    throw new Error(
      ERROR_MESSAGES[travelHomeResponse.code as keyof typeof ERROR_MESSAGES],
    );
  }

  if ('code' in sharedPaymentsResponse) {
    throw new Error(
      ERROR_MESSAGES[
        sharedPaymentsResponse.code as keyof typeof ERROR_MESSAGES
      ],
    );
  }

  console.log(travelHomeResponse.data);

  return (
    <Suspense fallback={<PaymentSkeleton />}>
      <PaymentList
        travelId={Number(id)}
        initialPayments={sharedPaymentsResponse.data}
        travelInfo={travelHomeResponse.data!}
      />
      {new Date(travelHomeResponse.data?.travelEndDate!) < new Date() && (
        <SettlementButton travelInfo={travelHomeResponse.data!} />
      )}
    </Suspense>
  );
}
