'use client'
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css'
import { Title } from "@withbee/ui/title"
import { useEffect, useState } from 'react';
import { Button } from '@withbee/ui/button';

interface AccountInfo {
  accountNumber: string;
  accountName: string;
  balance: number;
}

export default function TransferPage() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id;

  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null); // 초기값을 null로 설정
  const [targetAccount, setTargetAccount] = useState(''); // 송금할 계좌번호 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태

  // 계좌 정보 가져오기
  useEffect(() => {
    if (accountId) {
      fetch(`http://localhost:8080/accounts/${accountId}/info`)
        .then((response) => response.json())
        .then((data) => {
          const formatData = {
            accountNumber: data.accountNumber,
            accountName: data.product,
            balance: data.balance,
          };
          setAccountInfo(formatData);
        });
    }
  }, [accountId]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 계좌번호 검증 후 금액 설정 페이지로 이동
  const handleNextClick = () => {
    if (targetAccount.length < 10) {
      alert('계좌번호가 너무 짧아용~');
      return;
    }
    
    // 계좌번호 검증 (예: 서버에 확인 요청)
    fetch(`http://localhost:8080/accounts/verify/${targetAccount}`)
      .then((response) => {
        if (response.ok) {
          setErrorMessage('');
          alert('계좌번호가 있어용~ 얼마 보낼지 알아볼까요?');
          localStorage.setItem('targetAccountNumber',targetAccount);
          router.push((`/banking/${accountId}/transfer/detail`))

        } else {
          alert('ㅋㅋ 엥 없는 번혼데?!?^^');
        }
      })
      .catch(() => {
        alert('엥?? 없는 계좐뎅????');
      });
  };

  // 가상 키보드 생성
  const renderKeyboard = () => (
    <div className={styles.keyboard}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '←'].map((key) => (
        <button
          key={key}
          className={styles.keyboardKey}
          onClick={() => handleNumberPress(key === '←' ? 'backspace' : key === 'X' ? 'clear' : key)}
        >
          {key}
        </button>
      ))}
    </div>
  );

  // 숫자 버튼 클릭 처리
  const handleNumberPress = (key: string) => {
    if (key === 'backspace') {
      setTargetAccount(targetAccount.slice(0, -1)); // 백스페이스 처리
    } else if (key === 'clear') {
      setTargetAccount(''); // X 누르면 전체 삭제
    } else {
      setTargetAccount(targetAccount + key); // 숫자 추가
    }
  };

  // 계좌번호 입력 부분 렌더링
  const renderAccountInput = () => (
    <div className={styles.amountContainer}>
      <div className={styles.accountInfo}>
        <h2>내 계좌</h2>
        {accountInfo ? (
          <p className={styles.balance}>
            {accountInfo.accountName} 잔액 {formatNumber(accountInfo.balance)} 원
          </p>
        ) : (
          <p>계좌 정보를 불러오는 중입니다...</p>
        )}
      </div>

      <div className={styles.targetAccount}>
        <h3 className={styles.text}>송금할 계좌</h3>

        {/* 사용자가 직접 입력 가능하도록 수정 */}
        <input
          type="tel"
          className={styles.input}
          value={targetAccount}
          onChange={handleAccountChange} // onChange 핸들러 수정
          placeholder="계좌번호 입력"
        />
        
        {/* 오류 메시지 출력 */}
        <p className={`${styles.error} ${errorMessage ? 'visible' : ''}`}>{errorMessage}</p>
      </div>
    </div>
  );

  // onChange 핸들러: 숫자만 입력하도록 필터링
  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // 숫자만 허용하는 정규 표현식
    const numericValue = inputValue.replace(/[^0-9]/g, ''); // 숫자가 아닌 모든 문자는 제거

    setTargetAccount(numericValue); // 상태 업데이트
  };

  return (
    <div className={styles.container}>
      <Title label="송금하기" />
      {/* {accountInfo && (
        <div className={styles.accountDetails}>
          <div>{accountInfo.accountName}</div>
          <div>{accountInfo.accountNumber}</div>
          <div>{formatNumber(accountInfo.balance)} 원</div>
        </div>
      )} */}

      {renderAccountInput()}
      {renderKeyboard()}

      <div className={styles.submitContainer}>
        <Button
          label="다음"
          size="large"
          onClick={handleNextClick} // 계좌번호 검증 후 금액 설정 페이지로 이동
        />
      </div>
    </div>
  );
}
