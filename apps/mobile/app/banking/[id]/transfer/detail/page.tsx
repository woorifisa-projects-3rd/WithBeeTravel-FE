'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { instance } from '@withbee/apis';
import PinNumberModal from '../../../../../components/PinNumberModal';
import { useToast } from '@withbee/hooks/useToast';
import { Button } from '@withbee/ui/button';

interface AccountInfo {
  accountId: number;
  accountNumber: string;
  product: string;
  balance: number;
}

interface TargetName {
  name: string;
}

export default function TransferDetailPage() {
  const MAX_AMOUNT = 500000000;
  const router = useRouter();
  const params = useParams();
  const [targetAccountNumber, setTargetAccountNumber] = useState<string | null>(
    null,
  ); // 초기값을 null로 설정
  const myAccountId = params.id; // 계좌 ID를 파라미터로 받음

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>(
    undefined,
  );
  const [amount, setAmount] = useState<string>(''); // 송금 금액 상태
  const [targetAccount, setTargetAccount] = useState<TargetName | undefined>(); // 타겟 계좌 정보
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 열기/닫기 상태

  const { showToast } = useToast();
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
      (async () => {
        const response = await instance.get<AccountInfo>(
          `/api/accounts/${myAccountId}/info`,
        );
        if ('data' in response) {
          setAccountInfo(response.data);
        } else {
          console.error(response.message);
        }
      })();
    }
  }, [myAccountId]);

  // 타겟 계좌의 사용자 이름 가져오기
  useEffect(() => {
    if (targetAccountNumber) {
      const AccountNumberRequest = { accountNumber: targetAccountNumber };
      (async () => {
        const response = await instance.post<TargetName>(
          '/api/accounts/find-user',
          {
            body: JSON.stringify(AccountNumberRequest),
          },
        );
        if ('data' in response) {
          setTargetAccount(response.data);
        } else {
          console.error(response.message);
        }
      })();
    }
  }, [targetAccountNumber]);

  // 숫자 입력 처리
  const handleNumberPress = (num: string) => {
    if (num === 'backspace') {
      setAmount((prev) => prev.slice(0, -1)); // 마지막 문자 제거
    } else {
      // 새로운 금액을 계산하기 전, 현재 금액에 num을 추가해본 후, 5억을 초과하는지 확인
      const newAmount = amount + num;
      if (parseInt(newAmount) > MAX_AMOUNT) {
        showToast.error({ message: '1회 최대 이체 한도는 5억원 입니다!' });
        return; // 5억 원 이상은 입력되지 않도록 함
      }
      setAmount(newAmount); // 5억 미만일 경우 정상적으로 금액을 추가
    }
  };

  // 송금 버튼 클릭 시 처리
  const handleSendMoney = async () => {
    // 금액 유효성 검사
    if (!amount || amount === '0') {
      showToast.error({ message: '0원은 송금할 수 없어요!' });
      return;
    }

    // 잔액 검증
    if (accountInfo && parseInt(amount) > accountInfo.balance) {
      showToast.error({ message: '잔액이 부족해요!' });
      return;
    }

    // 타겟 계좌 정보가 없을 때
    if (!targetAccount) {
      alert('타겟 계좌 정보가 잘못되었습니다.');
      return;
    }

    // 모달 열기
    setIsModalOpen(true);
  };

  // PIN 번호 제출 처리
  const handlePinSubmit = async (pin: string) => {
    const transferRequest = {
      accountId: myAccountId,
      amount: amount,
      accountNumber: targetAccountNumber,
      rqspeNm: targetAccount?.name,
    };

    try {
      const response = await instance.post(
        `/api/accounts/${myAccountId}/transfer`,
        { body: JSON.stringify(transferRequest) },
      );

      showToast.success({
        message: `${targetAccount?.name}님이게
        \n${transferRequest.amount}원 송금 완료`,
      });

      router.push('/banking/');
    } catch (error) {
      console.error('송금 오류:', error);
      showToast.error({ message: `${error}` });
    } finally {
      setIsModalOpen(false); // 송금 후 모달 닫기
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
            ₩{accountInfo.balance.toLocaleString()}원
          </p>
        ) : (
          <p>내 계좌 정보를 불러오는 중...</p>
        )}
      </div>

      <div className={styles.targetAccount}>
        <h3 className={styles.text}>송금할 계좌</h3>
        <p className={styles.accountNumber}>
          {targetAccountNumber} - {targetAccount?.name}
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
        <div className={styles.buttonLocation}>
          <Button label="송금하기" size="medium" onClick={handleSendMoney} />
        </div>
      )}

      {/* PinNumberModal 컴포넌트 호출 */}
      <PinNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        onSubmit={handlePinSubmit} // PIN 입력 후 제출 처리
      />
    </div>
  );
}
