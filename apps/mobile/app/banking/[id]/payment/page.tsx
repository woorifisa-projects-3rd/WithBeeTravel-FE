'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import { instance } from '@withbee/apis';

interface HistoryRequest {
  payAm: number;
  rqspeNm: string;
  isWibeeCard: boolean;
}

interface AccountInfo {
  accountId: number;
  accountNumber: string;
  product: string;
  balance: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const myAccountId = params.id; // 계좌 ID를 파라미터로 받음

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
  const [payAm, setPayAm] = useState<string>(''); // 거래 금액 상태
  const [rqspeNm, setRqspeNm] = useState<string>(''); // 거래 내역(상호명) 상태
  const [isWibeeCard, setIsWibeeCard] = useState<boolean>(false); // 위비 카드 연결 여부 (계좌 정보에서 확인)
  const [isWibeeCardCheckbox, setIsWibeeCardCheckbox] = useState<boolean>(false); // 체크박스 상태 (결제 내역에서 사용)

  // 내 계좌 정보 가져오기
  useEffect(() => {
    if (myAccountId) {
      (async () => {
        const response = await instance.get<AccountInfo>(`/accounts/${myAccountId}/info`);
        if ('data' in response) {
          setAccountInfo(response.data);
        } else {
          console.error(response.message);
        }
      })();

      (async () => {
        const response = await instance.get<boolean>(`/accounts/${myAccountId}/check-wibee`);
        if ('data' in response) {
          //@ts-ignore
          if (response.data.connectedWibeeCard) {
            setIsWibeeCard(true); // 위비 카드 연결 여부 설정
          }
        }
      })();
    }
  }, [myAccountId]);

  // 등록하기 버튼 클릭 시 처리
  const handleSubmit = async () => {
    if (!payAm || payAm === '0') {
      alert('금액을 입력해주세요!');
      return;
    }

    if (!rqspeNm) {
      alert('거래 내역(상호명)을 입력해주세요!');
      return;
    }

    //@ts-ignore
    if(payAm > accountInfo?.balance){
        alert('계좌에 잔액 부족!')
        return;
    }

    const historyRequest: HistoryRequest = {
      payAm: parseInt(payAm),
      rqspeNm,
      isWibeeCard: isWibeeCardCheckbox, 
    };

    try {
      await instance.post(`/accounts/${myAccountId}/payment`, {
        body: JSON.stringify(historyRequest),
      });
      alert('결제 내역이 등록되었습니다.');
      router.push(`/banking/`); 
      return;
    } catch (error) {
      console.error('결제 내역 추가 중 오류 발생:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const renderAmountInput = () => (
    
    <div className={styles.inputGroup}>
      <label>거래 금액</label>
      <input
        type="text"
        value={payAm}
        onChange={(e) => setPayAm(e.target.value.replace(/\D/g, ''))} // 숫자만 입력되도록
        placeholder="금액 입력"
        className={styles.input}
      />
    </div>
  );

  const renderTransactionNameInput = () => (
    <div className={styles.inputGroup}>
      <label>거래 내역(상호명)</label>
      <input
        type="text"
        value={rqspeNm}
        onChange={(e) => setRqspeNm(e.target.value)}
        placeholder="상호명을 입력해주세요"
        className={styles.input}
      />
    </div>
  );

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <div className={styles.container}>
      <Title label="결제 내역 추가" />
      <div className={styles.accountInfo}>
        <h2>내 계좌</h2>
        {accountInfo ? (
          <p className={styles.balance}>
            {accountInfo.product} 잔액 {formatNumber(accountInfo.balance)} 원
          </p>
        ) : (
          <p>계좌 정보를 불러오는 중입니다...</p>
        )}
      </div>

      <div className={styles.form}>
        {renderTransactionNameInput()}
        {renderAmountInput()}

        {/* 위비 카드 결제 체크박스 (위비 카드 연결되어 있을 때만 보임) */}
        {isWibeeCard && (
          <div className={styles.inputGroup}>
            <label>
              <input
                type="checkbox"
                checked={isWibeeCardCheckbox}
                onChange={() => setIsWibeeCardCheckbox((prev) => !prev)} // 체크박스 상태 반전
              />
              위비 카드 결제
            </label>
          </div>
        )}

        {/* 등록하기 버튼 */}
        <button className={styles.submitButton} onClick={handleSubmit}>
          등록하기
        </button>
      </div>
    </div>
  );
}
