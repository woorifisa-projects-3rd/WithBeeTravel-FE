import styles from './page.module.css';
import WibeeCardPayment from '@withbee/ui/wibee-card-payment';
import { WibeeCardHistory } from '@withbee/types';
import { Title } from '@withbee/ui/title';
import { Button } from '@withbee/ui/button';
import { Item } from '@withbee/ui/item';

interface WibeeCardProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: WibeeCardProps) {
  const { id } = params;
  const response: { data: WibeeCardHistory[] } = {
    data: [
      {
        id: 1,
        date: '2024-11-19T14:20',
        paymentAmount: 50000,
        storeName: '명수네 떡볶이',
        isAddedSharedPayment: true,
      },
      {
        id: 2,
        date: '2024-11-20T13:29',
        paymentAmount: 120000,
        storeName: '호처루냉면',
        isAddedSharedPayment: false,
      },
      {
        id: 3,
        date: '2024-11-20T15:34',
        paymentAmount: 30000,
        storeName: '콩에진보드게임카페',
        isAddedSharedPayment: true,
      },
      {
        id: 1,
        date: '2024-11-19T14:20',
        paymentAmount: 50000,
        storeName: '명수네 떡볶이',
        isAddedSharedPayment: true,
      },
      {
        id: 2,
        date: '2024-11-20T13:29',
        paymentAmount: 120000,
        storeName: '호처루냉면',
        isAddedSharedPayment: false,
      },
      {
        id: 3,
        date: '2024-11-20T15:34',
        paymentAmount: 30000,
        storeName: '콩에진보드게임카페',
        isAddedSharedPayment: true,
      },
      {
        id: 1,
        date: '2024-11-19T14:20',
        paymentAmount: 50000,
        storeName: '명수네 떡볶이',
        isAddedSharedPayment: true,
      },
      {
        id: 2,
        date: '2024-11-20T13:29',
        paymentAmount: 120000,
        storeName: '호처루냉면',
        isAddedSharedPayment: false,
      },
      {
        id: 3,
        date: '2024-11-20T15:34',
        paymentAmount: 30000,
        storeName: '콩에진보드게임카페',
        isAddedSharedPayment: true,
      },
    ],
  };
  const initialData = 'data' in response ? response.data : null;

  return (
    <div className={styles.container}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <Title label="위비 카드 결제 내역 불러오기" />
          <div className={styles.optionWrapper}>
            <Button label="전체 선택" size="xsmall" />
            <div className={styles.dateSelect}>
              <span>2024.11.21 ~ 2024.11.23</span>
              <Item label="기간 선택" size="small" type="select" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.historyWrapper}>
        {initialData?.map((history) => (
          <WibeeCardPayment key={history.id} payment={history} />
        ))}
      </div>
      <div className={styles.submitButtonBackground}>
        <div className={styles.submitButtonWrapper}>
          <Button label="선택 완료" />
        </div>
      </div>
    </div>
  );
}
