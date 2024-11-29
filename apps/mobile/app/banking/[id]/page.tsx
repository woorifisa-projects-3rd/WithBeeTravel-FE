'use client';

import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence from framer-motion
import styles from './page.module.css';
import { Button } from '@withbee/ui/button';
import {
  getAccountHistories,
  getAccountInfo,
  getUserState,
  instance,
} from '@withbee/apis';
import { AnimatedBalance } from '../../../components/TotalBalanceCountUp';

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

interface PinNumberResponse {
  failedPinCount: number;
  pinLocked: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [histories, setHistories] = useState<AccountHistory[] | undefined>([]);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [error, setError] = useState<boolean>(false); // 에러 상태 추가

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // 계좌 정보 가져오기
          const responseInfo = await getAccountInfo(Number(id));
          console.log('Account Info Response:', responseInfo);  // Log API response
          if (Number(responseInfo.status) !== 200) {
            setError(true);
            router.push('/mypage'); // 오류 발생 시 리디렉션
            return;
          }
          if ('data' in responseInfo) {
            setAccountInfo(responseInfo.data);
          }

          // 거래 내역 가져오기
          const responseHistory = await getAccountHistories(Number(id));
          console.log('Transaction History Response:', responseHistory); // Log API response
          if (Number(responseHistory.status) !== 200) {
            setError(true);
            router.push('/mypage'); // 오류 발생 시 리디렉션
            return;
          }
          if ('data' in responseHistory) {
            setHistories(responseHistory.data);
          }
        } catch (err) {
          setError(true);
          console.error('Error fetching data:', err);  // Log error
          router.push('/mypage'); // 오류 발생 시 리디렉션
        } finally {
          setLoading(false); // 데이터 가져오기가 끝났으면 로딩 상태를 false로 변경
        }
      };

      fetchData();
    }
  }, [id]);

  // 로딩 중이거나 오류가 발생한 경우 렌더링을 하지 않음
  if (loading || error) {
    return null;
  }

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

      {/* 계좌 정보 표시 */}
      <AnimatePresence>
        {accountInfo && (
          <motion.div
            className={styles.accountDetails}
            initial={{ opacity: 0, y: 0.4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.accountInfo}>
              <div className={styles.productAndButton}>
                <div className={styles.productName}>{accountInfo.product}</div>
                <div className={styles.addHistory}>
                  <Button
                    primary={false}
                    label="+ 내역"
                    size="xsmall"
                    onClick={() => router.push(`/banking/${id}/payment`)}
                  />
                </div>
              </div>
              <div className={styles.accountNumber}>
                {accountInfo.accountNumber}
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
                  onClick={() => handleTransferClick()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 거래 내역 표시 */}
      <div className={styles.transactionList}>
        <AnimatePresence>
          {histories && histories.length > 0 ? (
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
                    잔액 : {formatNumber(history.balance)}원
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              텅.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
