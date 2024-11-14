'use client';

import { Title } from '@withbee/ui/title'; 
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';


interface AccountHistory {
  date: string;
  rcvAm: number;
  payAm: number;
  balance: number;
  rqspeNm: String;
}

export default function BankingPage() {
  const params = useParams();
  const id = params.id;

  const [histories, setHistories] = useState<AccountHistory[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/accounts/${id}`) // Spring Boot 서버 주소
        .then((response) => response.json())
        .then((data) => {
          // 받은 데이터를 BankingAccount 배열로 변환하여 상태에 저장
          const formattedData = data.map((item: any) => ({
            date: item.date,
            rcvAm: item.rcvAm,
            payAm: item.payAm,
            balance: item.balance,
            rqspeNm: item.rqspeNm,
          }));
          setHistories(formattedData);
        });
    }
  }, [id]); // 의존성 배열에 `id` 추가

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.container}>
      <Title label="거래내역 조회" />

      <div className={styles.transactionList}>
  {histories.map((history, index) => (
    <div key={index} className={styles.transactionItem}>
      <div className={styles.transactionDate}>
      {new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24시간 형식으로 출력
  }).format(new Date(history.date))}
      </div>

      {/* 상세 내역은 날짜 바로 아래로 위치 */}
      <div className={styles.detail}>
        {history.rqspeNm}
      </div>

      {/* 거래 내역 상세 */}
      <div className={styles.transactionDetails}>
        {/* 입금 / 출금 금액 */}
        {history.rcvAm === 0 || history.rcvAm == null ? (
          <div className={styles.payAmount}>
            <span className={styles.outflowLabel}>출금 : </span>
            {formatNumber(history.payAm)}원
          </div>
        ) : (
          <div className={styles.rcvAmount}>
            <span className={styles.inflowLabel}>입금 : </span>
            {formatNumber(history.rcvAm)}원
          </div>
        )}

        <div className={styles.balance}>
          잔액: {formatNumber(history.balance)}원
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}