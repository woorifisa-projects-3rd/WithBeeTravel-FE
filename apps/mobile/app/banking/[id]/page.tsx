'use client';

import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Button } from '@withbee/ui/button';
import { instance } from '@withbee/apis';
import { error } from 'console';

interface AccountHistory {
  date: string;
  rcvAm: number;
  payAm: number;
  balance: number;
  rqspeNm: string;
}

interface AccountInfo {
  accountId: number;
  accountNumber: string;
  product: string;
  balance: number;
}

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [histories, setHistories] = useState<AccountHistory[]>([]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();

  
  useEffect(() => {
    if (id) {
      // 계좌 정보 가져오기
      (async() =>{
        const response = await instance.get<AccountInfo>(`/accounts/${id}/info`);
        console.log(response);

        if ('data' in response) {
          setAccountInfo(response.data);
        } else {
          
          console.error(response.message)
        }
        
      })();

      // 거래 내역 가져오기
      (async () => {
        const response = await instance.get<AccountHistory>(`/accounts/${id}`);
        console.log("상세 내역: ", response);
        
        setHistories(response.data); // 거래 내역 업데이트
              
      })();
    }
  }, [id]);

  const formatNumber = (num: number | null | undefined): string => {
    if (num == null) return '0'; // null 또는 undefined 처리
    return num.toLocaleString('ko-KR');
  };

  // 날짜 포맷 함수
  const formatDate = (date: string): string => {
    if (!date) return 'Invalid Date'; // 날짜가 없으면 기본 텍스트 반환
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24시간 형식으로 출력
    }).format(new Date(date));
  };

  return (
    <div className={styles.container}>
      <Title label="거래내역 조회" />

      {/* 계좌 정보 표시 */}
      {accountInfo ? (
        <div className={styles.accountDetails}>
          <div className={styles.accountInfo}>
            <div>{accountInfo.product}</div>
            <div>{accountInfo.accountNumber}</div>
            <div>{formatNumber(accountInfo.balance)} 원</div>
          </div>
        </div>
      ) : (
        <div>계좌 정보가 없습니다.</div> // `accountInfo`가 없을 경우 처리
      )}

      <div className={styles.default}>
        <Button
          label="송금"
          size={'medium'}
          onClick={() => router.push(`/banking/${id}/transfer`)}
        />
        <Button
          label="입금"
          size={'medium'}
          onClick={() => router.push(`/banking/${id}/deposit`)}
        />
      </div>

      {/* 거래 내역 표시 */}
      <div className={styles.transactionList}>
        {histories.map((history, index) => (
          <div key={index} className={styles.transactionItem}>
            <div className={styles.transactionDate}>
              {formatDate(history.date)}
            </div>

            {/* 상세 내역은 날짜 바로 아래로 위치 */}
            <div className={styles.detail}>{history.rqspeNm}</div>

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
