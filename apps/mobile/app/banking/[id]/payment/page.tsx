'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import { useParams, useRouter } from 'next/navigation';
import {
  checkWibee,
  getAccountInfo,
  getUserState,
  instance,
  registerPayment,
} from '@withbee/apis';
import PinNumberModal from '../../../../components/PinNumberModal';
import { Button } from '@withbee/ui/button';
import { useToast } from '@withbee/hooks/useToast';
import {
  AccountInfo,
  HistoryRequest,
  PinNumberResponse,
  WibeeCardResponse,
} from '@withbee/types';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const myAccountId = params.id; // 계좌 ID를 파라미터로 받음

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
  const [payAm, setPayAm] = useState<string>(''); // 거래 금액 상태
  const [rqspeNm, setRqspeNm] = useState<string>(''); // 거래 내역(상호명) 상태
  const [isWibeeCard, setIsWibeeCard] = useState<
    WibeeCardResponse | undefined
  >(); // 위비 카드 연결 여부
  const [isWibeeCardCheckbox, setIsWibeeCardCheckbox] =
    useState<boolean>(false); // 위비 카드 결제 상태
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // PinNumberModal 열기/닫기 상태

  const { showToast } = useToast();

  const [loading, setLoading] = useState<boolean>(true);

  // 내 계좌 정보 가져오기
  useEffect(() => {
    if (myAccountId) {
      (async () => {
        const response = await getAccountInfo(Number(myAccountId));
        if ('data' in response) {
          setLoading(false);
          setAccountInfo(response.data);
        } else {
          // TODO: 에러 페이지로 이동시키기
          router.push(`/mypage`);
          console.error(response.message);
        }
      })();

      (async () => {
        const response = await checkWibee(Number(myAccountId));
        if ('data' in response) {
          setIsWibeeCard(response.data);
        } else {
          console.error(response.message);
        }
      })();
    }
  }, [myAccountId]);

  if (loading) {
    return null;
  }

  // 등록하기 버튼 클릭 시 처리
  const handleSubmit = async () => {
    if (!payAm || payAm === '0') {
      showToast.error({ message: '금액을 입력해주세요!' }); // 금액 입력 오류 메시지
      return;
    }

    if (!rqspeNm) {
      showToast.error({ message: '거래 내역(상호명)을 입력해주세요!' }); // 상호명 입력 오류 메시지
      return;
    }

    if (accountInfo?.balance === undefined) {
      showToast.error({ message: '계좌 정보가 없습니다!' }); // 계좌 정보 오류 메시지
      return;
    }

    if (Number(payAm) > accountInfo.balance) {
      showToast.error({ message: '계좌에 잔액 부족!' }); // 잔액 부족 오류 메시지
      return;
    }

    const response = await getUserState();
    if (Number(response.status) !== 200) {
      showToast.error({ message: '핀번호 재 설정 후 이용 가능' }); // 핀번호 설정 오류 메시지
      return;
    }

    // 모달을 열어 PIN 번호 입력 받기
    setIsModalOpen(true);
  };

  // PIN 번호 입력 완료 후 처리
  const handlePinSubmit = async (pin: string) => {
    // PIN 번호 확인 후 결제 요청
    try {
      const historyRequest: HistoryRequest = {
        payAm: parseInt(payAm),
        rqspeNm,
        isWibeeCard: isWibeeCardCheckbox,
      };

      await registerPayment(
        Number(myAccountId),
        parseInt(payAm),
        rqspeNm,
        isWibeeCardCheckbox,
      );
      showToast.success({ message: '거래내역 등록 완료!' });

      router.push(`/banking/`);
    } catch (error) {
      console.error('결제 내역 추가 중 오류 발생:', error);
    } finally {
      // 모달을 닫음
      setIsModalOpen(false);
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

  // 등록하기 버튼 활성화/비활성화 체크
  const isSubmitDisabled = !payAm || !rqspeNm || payAm === '0';

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

        {/* 위비 카드 결제 버튼 (위비 카드 연결되어 있을 때만 보임) */}
        {isWibeeCard?.connectedWibeeCard && (
          <div className={styles.wibeeCardButtonGroup}>
            <Button
              label="위비 카드"
              size="medium"
              className={`${styles.wibeeCardButton} ${isWibeeCardCheckbox ? styles.active : ''}`}
              onClick={() => setIsWibeeCardCheckbox(true)} // 위비 카드 결제 활성화
            />
            <Button
              label="일반 카드"
              size="medium"
              className={`${styles.wibeeCardButton} ${!isWibeeCardCheckbox ? styles.active : ''}`}
              onClick={() => setIsWibeeCardCheckbox(false)} // 위비 카드 결제 비활성화
            />
          </div>
        )}

        {/* 등록하기 버튼 */}
        {!isSubmitDisabled && (
          <Button
            label="등록하기"
            className={styles.submitButton}
            onClick={handleSubmit}
          />
        )}
      </div>

      {/* PinNumberModal 컴포넌트 호출 */}
      <PinNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        onSubmit={handlePinSubmit} // PIN 입력 후 제출 처리
      />
    </div>
  );
}
