'use client'
import React from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { Button, ButtonProps } from '@withbee/ui/button';
import { useRouter } from 'next/navigation';



interface BankingAccount {
  id: number;
  accountNumber: string;
  product: string;
  balance: number;
}



export default function BankingPage() {
  const router = useRouter();

  const transactions: BankingAccount[] = [
    {
      id: 1,
      accountNumber:'1111179185326',
      product: 'WON뱅킹',
      balance: 190000,
    },
    {
      id: 2,
      accountNumber: '15784623168',
      product: 'WON뱅킹',
      balance: 8900,
    },
    {
      id: 3,
      accountNumber:'19975247003',
      product: 'WON뱅킹',
      balance: 27210779,
    },
  ];
  const totalBalance = transactions.reduce((total, transaction) => total + transaction.balance, 0);


  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };




  return (
    <div className={styles.container}>
      <Title label = "뱅킹 홈"></Title>
      <div className={styles.space}></div>
      <Button
      size="medium" 
      label="계좌 만들러 가기"/>
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
  {transactions.map((transaction) => (
    <div key={transaction.id} className={styles.transactionItem}>
      <div className={styles.transactionInfo}>
        <div className={styles.accountType}>
          {transaction.product}
        </div>
        <div className={styles.accountNumber}>{transaction.accountNumber}</div>
      </div>

      {/* 송금 버튼을 금액 위에 배치하고 오른쪽 정렬 */}
      <div className={styles.transactionDetails}>
        <div className={styles.sendButtonContainer}>
          <Button
            size="xsmall"
            label="송금"
            onClick={() => router.push(`/banking/${transaction.id}/transfer`)}
            
          ></Button>
        </div>

        {/* 금액을 오른쪽 정렬 */}
        <div className={styles.amount}>
          {formatNumber(transaction.balance)}원
        </div>
      </div>
    </div>
  ))}
</div>


    </div>
  );
}