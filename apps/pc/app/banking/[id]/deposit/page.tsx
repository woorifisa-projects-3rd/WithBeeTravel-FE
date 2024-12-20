'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import styles from './page.module.css';
import { useParams, useRouter } from 'next/navigation';
import { deposit, getAccountInfo } from '@withbee/apis';
import { Button } from '@withbee/ui/button';
import { useToast } from '@withbee/hooks/useToast';
import Keyboard from '@withbee/ui/keyboard';
import { AccountInfo } from '@withbee/types';
import { numberToKorean } from '@withbee/utils';

const MAX_DEPOSIT_AMOUNT = 500000000; // 최대 입금 가능 금액

export default function DepositPage() {
  const router = useRouter();
  const params = useParams();
  const myAccountId = params.id; // 계좌 ID를 파라미터로 받음

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(); // 내 계좌 정보 상태
  const [amount, setAmount] = useState<string>(''); // 송금 금액 상태

  const { showToast } = useToast();

  // 내 계좌 정보 가져오기
  useEffect(() => {
    if (myAccountId) {
      (async () => {
        const response = await getAccountInfo(Number(myAccountId));
        if ('data' in response) {
          setAccountInfo(response.data);
        } else {
          console.error(response.message);
        }
      })();
    }
  }, [myAccountId]);

  // 숫자 입력 처리
  const handleNumberPress = (num: string) => {
    if (num === 'backspace') {
      setAmount((prev) => prev.slice(0, -1)); // 마지막 문자 제거
    } else {
      const newAmount = amount + num;
      if (parseInt(newAmount) <= MAX_DEPOSIT_AMOUNT) {
        setAmount(newAmount); // 5억원 이하일 경우 입력
      } else {
        showToast.error({ message: '최대 입금 가능 금액을 초과했어요.' });
      }
    }
  };

  // 입금 버튼 클릭 시 처리
  const handleSendMoney = async () => {
    if (!amount || amount == '0') {
      showToast.error({ message: '0원은 입금 할 수 없어요' });
      return;
    }

    try {
      const response = await deposit(
        Number(myAccountId),
        Number(amount),
        '입금',
      );
      showToast.success({
        message: `${parseInt(amount).toLocaleString()}원 입금 완료!`,
      });
      router.push(`/banking/`);
    } catch (error) {
      console.error('오류: ', error);
      alert('입금 중 오류 발생');
    }
  };

  return (
    <div className={styles.container}>
      {/* <h2 className="title">입금하기</h2> */}

      <main className={styles.main}>
        <motion.div
          className={styles.amountContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} // Smooth animation for amount input
        >
          <div className={styles.accountInfo}>
            <h2>
              내 {accountInfo?.product} 계좌<span>에</span>
            </h2>
            {accountInfo ? (
              <motion.p
                className={styles.balance}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className={styles.balanceAmount}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  잔액: {accountInfo.balance.toLocaleString()}원
                </motion.span>
              </motion.p>
            ) : (
              <p style={{ height: '32px' }}> </p>
            )}
          </div>
          <div className={styles.amountDisplay}>
            {amount ? (
              <>
                <span className={styles.currency}>₩ </span>
                <span className={styles.amount}>
                  {parseInt(amount).toLocaleString()}
                </span>
              </>
            ) : (
              <motion.span
                className={styles.placeholder}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                얼마나 입금할까요?
              </motion.span>
            )}
            <p className={styles.won} style={{ height: '36px' }}>
              {numberToKorean(Number(amount))}
            </p>
          </div>{' '}
          {/* 한글 변환 결과 */}
        </motion.div>
      </main>

      <div className={styles.keyboardContainer}>
        <Keyboard onKeyPress={handleNumberPress} />
        <div className={styles.handleSendMoney}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button
              label="입금하기"
              onClick={handleSendMoney}
              disabled={!amount}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
