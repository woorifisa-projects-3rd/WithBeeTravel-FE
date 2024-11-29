import styles from './honey-capsule.module.css';
import { HoneyCapsule } from '@withbee/types';
import Image from 'next/image';
import { Item } from './item';

interface HoneyCapsuleBoxProps {
  data: HoneyCapsule;
}

export const HoneyCapsuleBox = ({ data }: HoneyCapsuleBoxProps) => {
  return (
    <div className={styles.container}>
      {data.paymentImage !== null ? (
        <div className={styles.imageWrapper}>
          <Image
            src={data.paymentImage}
            alt="여행 기록 이미지"
            className={styles.image}
            layout="fill"
          />
        </div>
      ) : (
        ''
      )}
      <div className={styles.content}>
        <span className={styles.date}>{data.paymentDate.slice(11, 16)}</span>
        <span className={styles.comment}>{data.paymentComment}</span>
        <div className={styles.tags}>
          <Item label={data.storeName} />
          {data.paymentAmount !== null ? (
            <Item size="small" label={`${data.paymentAmount.toString()} KRW`} />
          ) : data.foreignPaymentAmount !== null && data.unit ? (
            <Item
              size="small"
              label={`${data.foreignPaymentAmount.toString()} ${data.unit}`}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};
