import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import ItemGroup from '@withbee/ui/item-group';
import { Menu } from '@withbee/ui/menu';
import { PaymentErrorBoundary } from '@withbee/ui/payment-error-boundary';
import PaymentList from '@withbee/ui/payment-list';
import { Suspense } from 'react';
import { PaymentSkeleton } from '@withbee/ui/payment-skeleton';
import { getSharedPayments } from '@withbee/apis';

interface TravelPageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: TravelPageProps) {
  const { id } = params;
  const response = await getSharedPayments({ travelId: Number(id) });

  const initialData = 'data' in response ? response.data : null;

  return (
    <main className={styles.container}>
      <Title label="공동 결제 내역" />
      <Menu className={styles.menu} />
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
