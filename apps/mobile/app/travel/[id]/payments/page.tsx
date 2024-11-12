import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import styles from './page.module.css';
import { Button } from '@withbee/ui/button';
import TabGroup from '@withbee/ui/tab-group';
import { Payment } from '@withbee/ui/payment';

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
      <div className={styles.subContainer}>
        <Image src="/setting.png" alt="edit" width={28} height={28} />
        <Button label="불러오기" size={'small'} />
        <Button label="직접 추가" size={'small'} primary={false} />
      </div>
      <TabGroup />
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
