import Image from 'next/image';
import { Button } from '@withbee/ui/button';
// import { ERROR_MESSAGES } from "@withbee/exception"; // 테스트용 코드
import styles from './page.module.css';

export default function Home() {
  // console.log(ERROR_MESSAGES["AUTH-001"]); // 테스트용 코드

  return <div className={styles.page}></div>;
}
