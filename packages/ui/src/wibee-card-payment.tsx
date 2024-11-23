import styles from './wibee-card-payment.module.css';
import { WibeeCardHistory } from '@withbee/types';

interface WibeeCardProps {
  payment: WibeeCardHistory;
}

export default function WibeeCardPayment({ payment }: WibeeCardProps) {
  return <div className={styles.container}>{payment.id}</div>;
}
