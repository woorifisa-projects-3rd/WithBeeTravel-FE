import { Title } from '@withbee/ui/title';
import styles from './page.module.css';
import ItemGroup from '@withbee/ui/item-group';
import { Payment } from '@withbee/ui/payment';
import { Menu } from '@withbee/ui/menu';

interface TravelPageProps {
  params: {
    id: string;
  };
}
export default function Page({ params }: TravelPageProps) {
  const { id } = params;

  console.log('id:', id);

  return (
    <main className={styles.container}>
      <Title label="공동 결제 내역" />
      <Menu className={styles.menu} />
      <ItemGroup />
      <section className={styles.paymentContainer}>
        {[5, 4, 3].map((day) => (
          <div className={styles.paymentWrapper}>
            <span className={styles.date}>11월 {day}일</span>
            <Payment />
            <Payment />
            <Payment />
          </div>
        ))}
      </section>
    </main>
  );
}
