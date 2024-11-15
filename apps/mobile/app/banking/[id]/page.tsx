'use client';

import { Title } from '@withbee/ui/title'; 
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Button } from '@withbee/ui/button';

interface AccountHistory {
  date: string;
  rcvAm: number;
  payAm: number;
  balance: number;
  rqspeNm: string;
}

interface AccountInfo {
  accountNumber: string;
  accountName: string;
  balance: number;
}

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [histories, setHistories] = useState<AccountHistory[]>([]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가

  useEffect(() => {
    if (id) {
      setLoading(true); // 로딩 시작

      // 계좌 정보 가져오기
      fetch(`http://localhost:8080/accounts/${id}/info`)
        .then((response) => response.json())
        .then((data) => {
          const formatData = {
            accountNumber: data.accountNumber,
            accountName: data.product,
            balance: data.balance,
          };
          setAccountInfo(formatData);
        })
        .catch((error) => {
          console.error('계좌 정보 가져오기 오류:', error);
          setAccountInfo(null); // 계좌 정보 오류 시 null 처리
        });

      // 거래 내역 가져오기
      fetch(`http://localhost:8080/accounts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((item: any) => ({
            date: item.date,
            rcvAm: item.rcvAm,
            payAm: item.payAm,
            balance: item.balance,
            rqspeNm: item.rqspeNm,
          }));
          setHistories(formattedData);
        })
        .catch((error) => {
          console.error('거래 내역 가져오기 오류:', error);
          setHistories([]); // 거래 내역 오류 시 빈 배열 처리
        })
        .finally(() => {
          setLoading(false); // 로딩 종료
        });
    }
  }, [id]); // 의존성 배열에 id 추가

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

  // 로딩 중 처리
  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <Title label="거래내역 조회" />

      {/* 계좌 정보 표시 */}
      {accountInfo ? (
        <div className={styles.accountDetails}>
          <div className={styles.accountInfo}>
            <div> {accountInfo.accountName}</div>
            <div> {accountInfo.accountNumber}</div>
            <div> {formatNumber(accountInfo.balance)} 원</div>
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
