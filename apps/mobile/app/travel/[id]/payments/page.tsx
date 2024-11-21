import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import ItemGroup from '@withbee/ui/item-group';
import { Menu } from '@withbee/ui/menu';
import { PaymentErrorBoundary } from '@withbee/ui/payment-error-boundary';
import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments, getTravelMembers } from '@withbee/apis';

interface TravelPageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: TravelPageProps) {
  const { id } = params;
  const travelMembers = await getTravelMembers(Number(id));
  const sharedPayments = await getSharedPayments({ travelId: Number(id) });
  let initialData = null;

  if ('data' in sharedPayments && 'data' in travelMembers) {
    initialData = {
      travelMembers: travelMembers.data,
      payments: sharedPayments.data!,
    };
  }

  return (
    <main className={styles.container}>
      <Title label="공동 결제 내역" />
      <Menu
        className={styles.menu}
        travelMembers={initialData!.travelMembers!}
      />
      <ItemGroup />
      <PaymentErrorBoundary>
        <Suspense
          fallback={
            <>
              {[1, 2, 3].map((index) => (
                <PaymentSkeleton key={index} />
              ))}
            </>
          }
        >
          {/* Fallback data is required when using suspense in SSR. */}
          <PaymentList travelId={Number(id)} initialData={initialData} />
        </Suspense>
      </PaymentErrorBoundary>
    </main>
  );
}
