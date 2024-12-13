'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import {
  getAccountInfo,
  getAccountOwnerName,
  instance,
  transfer,
} from '@withbee/apis';
import PinNumberModal from '../../../../../components/PinNumberModal';
import { useToast } from '@withbee/hooks/useToast';
import { Button } from '@withbee/ui/button';
import { AccountInfo, TargetName } from '@withbee/types';
import { motion, AnimatePresence } from 'framer-motion';
import Keyboard from '@withbee/ui/keyboard';
import { numberToKorean } from '@withbee/utils';
import { ButtonBanking } from '@withbee/ui/banking-button';

export default function TransferDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [targetAccountNumber, setTargetAccountNumber] = useState<string | null>(
    null,
  );
  const myAccountId = params.id;

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(
    undefined,
  );
  const [amount, setAmount] = useState<string>('');
  const [targetAccount, setTargetAccount] = useState<TargetName | undefined>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { showToast } = useToast();

  const MAX_AMOUNT = accountInfo?.balance || 500000000;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAccountNumber = localStorage.getItem('targetAccountNumber');
      setTargetAccountNumber(storedAccountNumber);
    }
  }, []);

  useEffect(() => {
    if (myAccountId) {
      (async () => {
        const response = await getAccountInfo(Number(myAccountId));
        if ('data' in response) {
          setLoading(false);
          setAccountInfo(response.data);
        } else {
          router.push(`/mypage`);
          console.error(response.message);
        }
      })();
    }
  }, [myAccountId]);

  useEffect(() => {
    if (targetAccountNumber) {
      (async () => {
        const response = await getAccountOwnerName(targetAccountNumber);
        if ('data' in response) {
          setTargetAccount(response.data);
        } else {
          console.error(response.message);
        }
      })();
    }
  }, [targetAccountNumber]);

  const handleNumberPress = (num: string) => {
    if (num === 'backspace') {
      setAmount((prev) => prev.slice(0, -1));
    } else {
      setAmount((prev) => {
        if (prev === '0' && num !== '0') {
          return num;
        } else if (prev === '0' && num === '0') {
          return prev;
        } else {
          const newAmount = prev + num;
          if (parseInt(newAmount) > MAX_AMOUNT) {
            showToast.error({ message: '최대 송금 가능 금액을 초과했어요.' });
            return prev;
          }
          return newAmount;
        }
      });
    }
  };

  const handleSendMoney = async () => {
    if (!amount || amount === '0') {
      showToast.error({ message: '0원은 송금할 수 없어요!' });
      return;
    }

    if (accountInfo && parseInt(amount) > accountInfo.balance) {
      showToast.error({ message: '잔액이 부족해요!' });
      return;
    }

    if (!targetAccount) {
      alert('타겟 계좌 정보가 잘못되었습니다.');
      return;
    }

    setIsModalOpen(true);
  };

  const handlePinSubmit = async (pin: string) => {
    const transferRequest = {
      accountId: myAccountId,
      amount: amount,
      accountNumber: targetAccountNumber,
      rqspeNm: targetAccount?.name,
    };

    try {
      const response = await transfer(
        Number(myAccountId),
        Number(amount),
        String(targetAccountNumber),
        String(targetAccount?.name),
      );

      showToast.success({
        message: `${targetAccount?.name}님에게
        \n${transferRequest.amount}원 송금 완료`,
      });
      router.replace('/banking/');
    } catch (error) {
      console.error('송금 오류:', error);
      showToast.error({ message: `${error}` });
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return null;
  }
  const formatAccountNumber = (accountNumber: string) => {
    // 계좌번호가 13자리인 경우에만 적용
    if (accountNumber.length === 13) {
      return `${accountNumber.slice(0, 4)}-${accountNumber.slice(4, 7)}-${accountNumber.slice(7)}`;
    }
    return accountNumber; // 13자리가 아닐 경우 그대로 반환
  };

  return (
    <div className={styles.container}>
      <Title label="송금하기" />
      <main className={styles.main}>
        <motion.div
          className={styles.amountContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.accountInfo}>
            <h2>
              내 {accountInfo?.product} 계좌<span>에서</span>
            </h2>
            {accountInfo ? (
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
                  잔액: {accountInfo.balance.toLocaleString()}원
                </motion.span>
              </motion.p>
            ) : (
              <p style={{ height: '36px' }}> </p>
            )}
          </div>

          <div className={styles.targetAccount}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className={styles.text}>
                {targetAccount?.name}
                <span>님에게</span>
              </h3>
              <p className={styles.accountNumber}>
                {formatAccountNumber(String(targetAccountNumber))}
              </p>
            </motion.div>
          </div>

          <div className={styles.amountDisplay}>
            {amount ? (
              <>
                <span className={styles.currency}>₩</span>
                <div className={styles.numberContainer}>
                  <AnimatePresence mode="popLayout">
                    {Number(amount)
                      .toLocaleString()
                      .split('')
                      .reverse()
                      .map((digit, index, array) => (
                        <motion.span
                          key={array.length - 1 - index}
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
                          {digit}
                        </motion.span>
                      ))
                      .reverse()}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <motion.span
                className={styles.placeholder}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                얼마나 보낼까요?
              </motion.span>
            )}
          </div>
          <p className={styles.won}>{numberToKorean(Number(amount))}</p>
        </motion.div>
      </main>

      <div className={styles.keyboardContainer}>
        <div className={styles.actions}>
          <Keyboard onKeyPress={handleNumberPress} />
        </div>

        <motion.div
          className={styles.handleSendMoney}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <ButtonBanking
            label="송금하기"
            size="medium"
            onClick={handleSendMoney}
            disabled={!amount}
          />
        </motion.div>
      </div>

      <PinNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePinSubmit}
      />
    </div>
  );
}
