'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { Button } from '@withbee/ui/button';
import { useRouter } from 'next/navigation';
import { getAccounts, getUserState, instance } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { AccountInfo, PinNumberResponse } from '@withbee/types';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

export default function BankingPage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<AccountInfo[] | undefined>([]);

  const { showToast } = useToast();
  const [error, setError] = useState<boolean>(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const accountResponse = await getAccounts();
        if ('data' in accountResponse) {
          setAccounts(accountResponse.data);
          setError(false);
        } else {
          console.error('에러 코드 ', accountResponse.status);
        }
      } catch (error) {
        console.error('로그인 확인 중 오류 발생:', error);
        // TODO: 토스트 두 번 뜨는거 고쳐야 함
        router.push('/login');
        showToast.warning({ message: '로그인 후 이용가능해요!' });
      }
    };

    checkLogin();
  }, []);

  // 총 잔액 계산
  const totalBalance = (accounts ?? []).reduce(
    (total, account) => total + account.balance,
    0,
  );

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 송금 버튼 클릭 시 예외처리
  const handleTransferClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
    accountId: number,
  ) => {
    // 이벤트 버블링 방지
    event.stopPropagation();

    const response = await getUserState();
    if (Number(response.status) != 200) {
      showToast.error({ message: '핀번호 재설정 후 송금 가능' });
      return;
    }
    // 송금 페이지로 이동
    router.push(`/banking/${accountId}/transfer`);
  };

  const createAccountHandle = async () => {
    const response = await getUserState();
    if (Number(response.status) != 200) {
      showToast.error({ message: '핀번호 재설정 후 송금 가능' });
      return;
    }
    router.push(`/banking/create`);
  };

  return (
    <div className={styles.container}>
      <h2 className="title">뱅킹 홈</h2>
      <div className={styles.space}></div>
      <Button
        size="medium"
        label="통장 만들기"
        onClick={() => createAccountHandle()}
      />
      <div className={styles.space}></div>

      {/* Total Balance Section with motion */}
      <motion.div
        className={styles.balanceSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.balanceHeader}>
          <span>총 잔액</span>
        </div>
        <div className={styles.totalBalance}>
          <CountUp
            start={0}
            end={totalBalance}
            duration={0.8}
            separator=","
            suffix="원"
            decimals={0}
          />
        </div>
      </motion.div>

      {/* Account List Section with AnimatePresence and motion */}
      <motion.div
        className={styles.transactionList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence>
          {(accounts ?? []).map((transaction) => (
            <motion.div
              key={transaction.accountId}
              className={styles.transactionItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              onClick={() => router.push(`/banking/${transaction.accountId}`)}
            >
              <div className={styles.transactionInfo}>
                <div>
                  <div className={styles.accountType}>
                    {transaction.product}
                  </div>
                  <div className={styles.accountNumber}>
                    {transaction.accountNumber}
                  </div>
                </div>
                <div className={styles.buttonWrapper}>
                  <Button
                    size="xsmall"
                    label="송금"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleTransferClick(e, transaction.accountId)
                    }
                  />
                </div>
              </div>

              <div className={styles.transactionDetails}>
                <div className={styles.amount}>
                  {formatNumber(transaction.balance)}원
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
