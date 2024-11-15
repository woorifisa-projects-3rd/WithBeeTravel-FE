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

export default function TransferDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [targetAccountNumber, setTargetAccountNumber] = useState<string | null>(
    null,
  ); // 초기값을 null로 설정
  const myAccountId = params.id; // 계좌 ID를 파라미터로 받음

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null); // 내 계좌 정보 상태
  const [amount, setAmount] = useState<string>(''); // 송금 금액 상태
  const [targetAccount, setTargetAccount] = useState<{ targetName: string }>({
    targetName: '',
  }); // 타겟 계좌 정보

  // 클라이언트에서만 localStorage 접근
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAccountNumber = localStorage.getItem('targetAccountNumber');
      setTargetAccountNumber(storedAccountNumber); // localStorage에서 가져온 계좌 번호 설정
    }
  }, []); // 빈 배열로 설정하여 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 함

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

  // 타겟 계좌의 사용자 이름 가져오기
  useEffect(() => {
    if (targetAccountNumber) {
      fetch(`http://localhost:8080/accounts/find-user/${targetAccountNumber}`) // URL 수정
        .then((response) => response.json()) // 응답을 JSON 형식으로 처리
        .then((data) => {
          setTargetAccount({ targetName: data.name }); // 응답에서 이름을 가져와서 상태 업데이트
          const targetName = data.name;
        })
        .catch((error) => {
          console.error('계좌 이름 가져오기 실패:', error);
        });
    }
  }, [targetAccountNumber]); // targetAccountNumber가 변경될 때마다 호출

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
    if (accountInfo !== null && parseInt(amount) >= accountInfo!.balance) {
      // accountInfo가 null일 수도 있어서
      alert('아니 돈도 없으면서 송금을 하시겠다??');
      return;
    }

    alert(`${targetAccount.targetName}님에게 ₩${amount}를 송금합니다.`);

    const TransferRequest = {
      accountId: myAccountId,
      amount: amount,
      accountNumber: targetAccountNumber,
      rqspeNm: targetAccount.targetName,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/accounts/${myAccountId}/transfer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(TransferRequest),
        },
      );
      if (!response.ok) {
        //TODO: 에러 처리 추가 예정
        alert('송금 실패');
      }
      const result = await response.json();
      alert('송금 완료');
      // 송금 완료되면 페이지 이동되야됨
      router.push(`/banking/`);

      return;
    } catch (error) {
      console.error('오류: ', error);

      alert('송금 중 오류 발생');
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
        <h2>내 계좌</h2>
        {accountInfo ? (
          <p className={styles.balance}>
            {accountInfo.accountName} ({accountInfo.accountNumber}) - ₩
            {accountInfo.balance.toLocaleString()}
          </p>
        ) : (
          <p>내 계좌 정보를 불러오는 중...</p>
        )}
      </div>

      <div className={styles.targetAccount}>
        <h3>송금할 계좌</h3>
        <p className={styles.accountNumber}>
          {targetAccount.targetName} {targetAccountNumber}
        </p>
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
          <span className={styles.placeholder}>얼마나 옮길까요?</span>
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <Title label="송금하기" />

      <main className={styles.main}>{renderAmountInput()}</main>

      <div className={styles.actions}>{renderKeyboard()}</div>

      {amount && (
        <button className={styles.nextButton} onClick={handleSendMoney}>
          송금하기
        </button>
      )}
    </div>
  );
}
