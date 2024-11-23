import { Button } from '@withbee/ui/button';
import '@withbee/styles';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';

export default function Home() {
  return (
    <div className={styles.container}>
      <Title label="카드 혜택" />
      <h1>윗비트래블</h1>
      <div>모두들 화이팅 합시다!!</div>
      <div className={styles.btnWrap}>
        <Button label="발급받기" />
      </div>
    </div>
  );
}
