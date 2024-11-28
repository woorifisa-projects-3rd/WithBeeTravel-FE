import styles from './honey-capsule.module.css';
import { HoneyCapsule } from '@withbee/types';

interface HoneyCapsuleBoxProps {
  data: HoneyCapsule;
}

export const HoneyCapsuleBox = ({ data }: HoneyCapsuleBoxProps) => {
  return (
    <div className={styles.container}>
      <div>{data.sharedPaymentId}</div>
      <div>{data.paymentDate}</div>
    </div>
  );
};
