import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import TabGroup from '@withbee/ui/tab-group';
import { Payment } from '@withbee/ui/payment';
import { Menu } from '@withbee/ui/menu';
import { getSharedPayments } from '@withbee/apis';
import PaymentList from '@withbee/ui/payment-list';

interface TravelPageProps {
  params: {
    id: string;
  };
}
export default async function Page({ params }: TravelPageProps) {
  const { id } = params;
  const response = await getSharedPayments({ travelId: Number(id) });

  return (
    <main className={styles.container}>
      <Title label="공동 결제 내역" />
      <Menu className={styles.menu} />
      <TabGroup />
      <PaymentList travelId={Number(id)} initialData={response.data} />
    </main>
  );
}
