'use client';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useEffect, useState } from 'react';
import { Button } from '@withbee/ui/button';
import { getAccountInfo, verifyAccount } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { AccountInfo } from '@withbee/types';
import { motion, AnimatePresence } from 'framer-motion';
import Keyboard from '@withbee/ui/keyboard';
import { ButtonBanking } from '@withbee/ui/banking-button';

export default function TransferPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id;

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
  const [targetAccount, setTargetAccount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (accountId) {
      (async () => {
        const response = await getAccountInfo(Number(accountId));
        if ('data' in response) {
          setLoading(false);
          setAccountInfo(response.data);
        } else {
          console.error(response.message);
          router.push('/mypage');
        }
      })();
    }
  }, [accountId]);

  if (loading) {
    return null;
  }

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  const handleNextClick = async () => {
    if (targetAccount.length < 10) {
      showToast.error({ message: '계좌번호는 10자리 이상이에요!' });
      return;
    }

    if (targetAccount === accountInfo?.accountNumber) {
      showToast.error({ message: '동일 계좌로는 송금 할 수 없어요.' });
      return;
    }

    localStorage.setItem('targetAccountNumber', targetAccount);

    try {
      const response = await verifyAccount(targetAccount);
      if (Number(response.status) === 200) {
        router.replace(`/banking/${accountId}/transfer/detail`);
      } else {
        showToast.error({ message: '존재 하지 않는 계좌번호예요!' });
      }
    } catch (error) {
      console.error('계좌번호 검증 중 오류 발생:', error);
      showToast.error({ message: '계좌번호 검증에 실패했습니다.' });
    }
  };

  const handleNumberPress = (key: string) => {
    if (key === 'backspace') {
      setTargetAccount(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setTargetAccount('');
    } else if (targetAccount.length < 13) {
      setTargetAccount(prev => prev + key);
    }
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 13) {
      setTargetAccount(numericValue);
    }
  };

  return (
    <div className={styles.container}>
      <Title label="송금하기" />

      <motion.div
        className={styles.amountContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.accountInfo}>
          <h2>내 {accountInfo?.product} 계좌</h2>
          {accountInfo && (
            <motion.p
              className={styles.balance}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                잔액: {formatNumber(accountInfo.balance)}원
              </motion.span>
            </motion.p>
          )}
        </div>

        <div className={styles.targetAccount}>
          <h3 className={styles.text}>송금할 계좌</h3>
          <div className={styles.numberContainer}>
            <input
              type="tel"
              className={styles.input}
              value={targetAccount}
              onChange={handleAccountChange}
              placeholder="계좌번호 입력"
              maxLength={13}
            />
            <AnimatePresence mode="popLayout">
              {targetAccount ? (
                targetAccount.split('').map((digit, index) => (
                  <motion.span
                    key={index}
                    className={styles.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1
                    }}
                  >
                    {digit}
                  </motion.span>
                ))
              ) : (
                <span className={styles.placeholder}>계좌번호 입력</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className={styles.keyboardContainer}>
        <div className={styles.actions}>
          <Keyboard
            onKeyPress={handleNumberPress}
            keypadType="pin"
          />
        </div>

        <motion.div
          className={styles.buttonLocation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <ButtonBanking
            label="다음"
            size="medium"
            onClick={handleNextClick}
            disabled={!targetAccount}
          />
        </motion.div>
      </div>
    </div>
  );
}

