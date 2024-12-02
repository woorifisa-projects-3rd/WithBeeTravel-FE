'use client';

import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { Button } from '@withbee/ui/button';
import {
  getAccountHistories,
  getAccountInfo,
  getUserState,
} from '@withbee/apis';
import { AnimatedBalance } from '../../../components/TotalBalanceCountUp';
import { TransactionHistorySkeleton } from '@withbee/ui/payment-history-skeleton';
import { AccountCardSkeleton } from '@withbee/ui/account-card-skeleton';
import { AccountHistory, AccountInfo } from '@withbee/types';
import dayjs from 'dayjs';
import { PaymentError } from '@withbee/ui/payment-error';
import useSWR from 'swr';

interface PinNumberResponse {
  failedPinCount: number;
  pinLocked: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // 계좌 정보 가져오기
  const {
    data: accountInfo,
    error: accountError,
    isLoading: accountIsLoading,
  } = useSWR<AccountInfo>(id ? `account-info-${id}` : null, {
    fetcher: async () => {
      const response = await getAccountInfo(Number(id));
      if ('data' in response) return response.data as AccountInfo;
      throw new Error(response.message);
    },
  });

  // 거래 내역 가져오기
  const {
    data: histories,
    error: historiesError,
    isLoading: historiesIsLoading,
  } = useSWR<AccountHistory[]>(id ? `account-histories-${id}` : null, {
    fetcher: async () => {
      const response = await getAccountHistories(Number(id));
      if ('data' in response) return response.data as AccountHistory[];
      throw new Error(response.message);
    },
  });

  // 에러 처리
  if (accountError || historiesError) {
    router.push('/not-found');
    return null;
  }

  const formatNumber = (num: number | null | undefined): string => {
    if (num == null) return '0';
    return num.toLocaleString('ko-KR');
  };

  const formatDate = (date: string): string => {
    if (!date) return 'Invalid Date';
    return dayjs(date).format('YYYY.MM.DD HH:mm:ss');
  };

  const handleTransferClick = async () => {
    const response = await getUserState();
    if (Number(response.status) !== 200) {
      alert('핀번호 재설정 후 이용 가능');
      return;
    }
    router.push(`/banking/${id}/transfer`);
  };

  return (
    <div className={styles.container}>
      <Title label="거래내역 조회" />

      <AnimatePresence>
        {accountIsLoading ? (
          <AccountCardSkeleton />
        ) : (
          accountInfo && (
            <motion.div
              className={styles.accountDetails}
              initial={{ opacity: 0, y: 0.4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.accountInfo}>
                <div className={styles.productAndButton}>
                  <div>
                    <div className={styles.productName}>
                      {accountInfo.product}
                    </div>
                    <div className={styles.accountNumber}>
                      {accountInfo.accountNumber}
                    </div>
                  </div>
                  <div className={styles.addHistory}>
                    <Button
                      primary={false}
                      label="+ 내역"
                      size="xsmall"
                      onClick={() => router.push(`/banking/${id}/payment`)}
                    />
                  </div>
                </div>

                <AnimatedBalance balance={accountInfo?.balance} />
                <div className={styles.default}>
                  <Button
                    primary={false}
                    label="입금"
                    size={'medium'}
                    onClick={() => router.push(`/banking/${id}/deposit`)}
                  />
                  <Button
                    label="송금"
                    size={'medium'}
                    onClick={handleTransferClick}
                  />
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* 거래 내역 표시 */}
      <div className={styles.transactionList}>
        <AnimatePresence>
          {historiesIsLoading ? (
            <TransactionHistorySkeleton />
          ) : histories && histories.length > 0 ? (
            histories.map((history, index) => (
              <motion.div
                key={index}
                className={styles.transactionItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className={styles.transactionDate}>
                  {formatDate(history.date)}
                </div>
                <div className={styles.detail}>{history.rqspeNm}</div>
                <div className={styles.transactionDetails}>
                  {history.rcvAm === 0 || history.rcvAm == null ? (
                    <div className={styles.payAmount}>
                      -{formatNumber(history.payAm)}원
                    </div>
                  ) : (
                    <div className={styles.rcvAmount}>
                      +{formatNumber(history.rcvAm)}원
                    </div>
                  )}
                  <div className={styles.balance}>
                    잔액: {formatNumber(history.balance)}원
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={styles.errorContainer}
            >
              <PaymentError
                message1={`${accountInfo?.product}에`}
                message2="거래 내역이 없어요."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
