'use client'
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { Button } from '@withbee/ui/button';
import { useRouter } from 'next/navigation';

interface BankingAccount {
  id: number;
  accountNumber: string;
  product: string;
  balance: number;
}

export default function BankingPage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<BankingAccount[]>([]);

  useEffect(() => {
    // API 호출해서 데이터를 받아옴
    fetch('http://localhost:8080/accounts') // Spring Boot 서버 주소
      .then(response => response.json())
      .then(data => {
        // 받은 데이터를 BankingAccount 배열로 변환하여 상태에 저장
        const formattedData = data.map((item: any, index: number) => ({
          id: item.accountId, // id는 임의로 생성 (만약 실제 id가 있으면 그걸 사용)
          accountNumber: item.accountNumber,
          product: item.product,
          balance: item.balance,
        }));
        setAccounts(formattedData);
      });
  }, []);

  // 총 잔액 계산
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.container}>
      <Title label="뱅킹 홈" />
      <div className={styles.space}></div>
      <Button size="medium" label="계좌 만들러 가기" />
      <div className={styles.space}></div>

      <div className={styles.balanceSection}>
        <div className={styles.balanceHeader}>
          <span>총 잔액</span>
        </div>
        <div className={styles.totalBalance}>
          {formatNumber(totalBalance)}원
        </div>
      </div>

      <div className={styles.transactionList}>
        {accounts.map((transaction) => (
          <div key={transaction.id} className={styles.transactionItem}>
            <div className={styles.transactionInfo}>
              <div className={styles.accountType}>{transaction.product}</div>
              <div className={styles.accountNumber}>{transaction.accountNumber}</div>
            </div>

            {/* 송금 버튼을 금액 위에 배치하고 오른쪽 정렬 */}
            <div className={styles.transactionDetails}>
              <div className={styles.sendButtonContainer}>
                <Button
                  size="xsmall"
                  label="송금"
                  onClick={() => router.push(`/banking/${transaction.id}/transfer`)}
                />
              </div>

              {/* 금액을 오른쪽 정렬 */}
              <div className={styles.amount}>{formatNumber(transaction.balance)}원</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
