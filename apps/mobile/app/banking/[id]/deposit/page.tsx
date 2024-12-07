'use client';
import { useEffect, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { deposit, getAccountInfo } from '@withbee/apis';
import { Button } from '@withbee/ui/button';
import { useToast } from '@withbee/hooks/useToast';
import { numberToKorean } from '@withbee/utils';

import { AccountInfo } from '@withbee/types';
import Keyboard from '@withbee/ui/keyboard';
import { ButtonBanking } from '@withbee/ui/banking-button';

export default function DepositPage() {
  const router = useRouter();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const myAccountId = params.id;

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
  const [amount, setAmount] = useState<string>('');

  const { showToast } = useToast();

  const MAX_DEPOSIT_AMOUNT = 500000000;

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

  const handleNumberPress = (num: string) => {
    if (num === 'backspace') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      const newAmount = amount + num;
      if (parseInt(newAmount) <= MAX_DEPOSIT_AMOUNT) {
        setAmount(newAmount);
      } else {
        showToast.error({ message: '최대 입금 가능 금액을 초과했어요.' });
      }
    }
  };

  const handleSendMoney = () => {
    if (!amount || amount === '0') {
      showToast.error({ message: '0원은 입금 할 수 없어요' });
      return;
    }

    startTransition(async () => {
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
        showToast.error({ message: '입금 중 오류 발생' });
      }
    });
  };

  return (
    <div className={styles.container}>
      <Title label="입금하기" />

      <main className={styles.main}>
        <motion.div
          className={styles.amountContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
      <div className={styles.numberContainer}>
        {Number(amount)
          .toLocaleString() // 콤마를 포함한 숫자 문자열로 변환
          .split('') // 문자별로 나누기
          .map((char, index) => (
            // 콤마가 아닌 숫자에 대해서만 애니메이션 적용
            char === ',' ? (
              <span key={`comma-${index}`} className={styles.comma}>
                ,
              </span>
            ) : (
              <AnimatePresence mode="popLayout" key={`number-${index}`}>
                <motion.span
                  key={`${index}-${char}`}
                  className={styles.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  }}
                >
                  {char}
                </motion.span>
              </AnimatePresence>
            )
          ))}
      </div>
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
</div>

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
            <ButtonBanking
              type="submit"
              label={isPending ? "입금 중..." : '입금하기'}
              onClick={handleSendMoney}
              disabled={!amount || isPending}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

