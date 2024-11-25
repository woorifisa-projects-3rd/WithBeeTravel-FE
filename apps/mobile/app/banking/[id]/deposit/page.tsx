'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { instance } from '@withbee/apis';
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
        const response = await instance.get<AccountInfo>(
          `/api/accounts/${myAccountId}/info`,
        );
        console.log(response);

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

  // 송금 버튼 클릭 시 처리
  const handleSendMoney = async () => {
    if (!amount || amount == '0') {
      showToast.error({ message: '0원은 입금 할 수 없어요' });
      return;
    }

    // 입금 로직 api
    const DepositRequest = {
      amount: amount,
      rqspeNm: '입금',
    };
    try {
      const response = await instance.post(
        `/api/accounts/${myAccountId}/deposit`,
        {
          body: JSON.stringify(DepositRequest),
        },
      );
      showToast.success({
        message: `${parseInt(amount).toLocaleString()}원 입금 완료!`,
      });
      // 송금 완료되면 페이지 이동되야됨
      router.push(`/banking/`);

      return;
    } catch (error) {
      console.error('오류: ', error);

      alert('입금 중 오류 발생');
    }
  };

  const renderKeyboard = () => (
    <div className={styles.keyboard}>
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
    </div>
  );

  const renderAmountInput = () => (
    <div className={styles.amountContainer}>
      <div className={styles.accountInfo}>
        <h2>입금 할 계좌</h2>
        {accountInfo ? (
          <p className={styles.balance}>
            {accountInfo.product} ({accountInfo.accountNumber}) - ₩
            {accountInfo.balance.toLocaleString()}
          </p>
        ) : (
          <p>내 계좌 정보를 불러오는 중...</p>
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
          <span className={styles.placeholder}>얼마나 입금할까요?</span>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Title label="입금하기" />

      <main className={styles.main}>{renderAmountInput()}</main>

      <div className={styles.actions}>{renderKeyboard()}</div>

      <div className={styles.handleSendMoney}>
        {amount && <Button label="입금하기" onClick={handleSendMoney} />}
      </div>
    </div>
  );
}
