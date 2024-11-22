import { PaymentErrorBoundary } from '@withbee/ui/payment-error-boundary';
import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments, getTravelMembers } from '@withbee/apis';
import { TravelStoreInitializer } from '@withbee/stores';
import { ERROR_MESSAGES } from '@withbee/exception';

interface TravelPageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: TravelPageProps) {
  const { id } = params;
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
      </Suspense>
    </>
  );
}
