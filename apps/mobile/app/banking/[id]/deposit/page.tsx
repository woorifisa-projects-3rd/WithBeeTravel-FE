'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { deposit, getAccountInfo } from '@withbee/apis';
import { Button } from '@withbee/ui/button';
import { useToast } from '@withbee/hooks/useToast';

interface AccountInfo {
  accountId: number;
  accountNumber: string;
  product: string;
  balance: number;
}

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
      setAmount((prev) => prev + num); // 숫자 추가
    }
  };

  // 입금 버튼 클릭 시 처리
  const handleSendMoney = async () => {
    if (!amount || amount == '0') {
      showToast.error({ message: '0원은 입금 할 수 없어요' });
      return;
    }

    const DepositRequest = {
      amount: amount,
      rqspeNm: '입금',
    };
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

  const renderKeyboard = () => (
    <motion.div
      className={styles.keyboard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }} // Slight delay for smooth entry
    >
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←'].map(
        (key) => (
          <button
            key={key}
            className={styles.keyboardKey}
            onClick={() => handleNumberPress(key === '←' ? 'backspace' : key)}
          >
            {key}
          </button>
        ),
      )}
    </motion.div>
  );

  const renderAmountInput = () => (
    <motion.div
      className={styles.amountContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} // Smooth animation for amount input
    >
      <div className={styles.accountInfo}>
        <h2>내 계좌</h2>
        {accountInfo ? (
          <motion.p
            className={styles.balance}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {accountInfo.product}{' '}
            <motion.span
              className={styles.balanceAmount}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              ₩ {accountInfo.balance.toLocaleString()}
            </motion.span>
          </motion.p>
        ) : (
          <p style={{ height: '32px' }}> </p>
        )}
      </div>

      <div className={styles.amountDisplay}>
        {amount ? (
          <>
            <span className={styles.currency}>₩</span>
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
      </div>
    </motion.div>
  );

  return (
    <div className={styles.container}>
      <Title label="입금하기" />

      <main className={styles.main}>{renderAmountInput()}</main>

      <div className={styles.actions}>{renderKeyboard()}</div>

      <div className={styles.handleSendMoney}>
        {amount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button label="입금하기" onClick={handleSendMoney} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
