'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';

interface AccountInfo {
  accountNumber: string;
  accountName: string;
  balance: number;
}

export default function DepositPage() {
  const router = useRouter();
  const params = useParams();
  const myAccountId = params.id; // 계좌 ID를 파라미터로 받음

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null); // 내 계좌 정보 상태
  const [amount, setAmount] = useState<string>(''); // 송금 금액 상태

  // 내 계좌 정보 가져오기
  useEffect(() => {
    if (myAccountId) {
      fetch(`http://localhost:8080/accounts/${myAccountId}/info`)
        .then((response) => response.json())
        .then((data) => {
          const formatData: AccountInfo = {
            accountNumber: data.accountNumber,
            accountName: data.product, // 백엔드에서 'product'로 반환된 이름을 사용
            balance: data.balance,
          };
          setAccountInfo(formatData); // 내 계좌 정보 상태 업데이트
        })
        .catch((error) => {
          console.error('내 계좌 정보 가져오기 실패:', error);
        });
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
      alert('금액을 입력해주세요!');
      return;
    }

    alert(`₩${amount}를 입금합니다.`);
    // 입금 로직 api
    const DepositRequest = {
      amount: amount,
      rqspeNm: '입금',
    };
    try {
      const response = await fetch(
        `http://localhost:8080/accounts/${myAccountId}/deposit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(DepositRequest),
        },
      );
      const result = await response.json();
      alert('입금 완료');
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
            {accountInfo.accountName} ({accountInfo.accountNumber}) - ₩
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

      {amount && (
        <button className={styles.nextButton} onClick={handleSendMoney}>
          입금하기
        </button>
      )}
    </div>
  );
}
