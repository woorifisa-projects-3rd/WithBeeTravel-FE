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
import { AccountInfo, HistoryRequest, WibeeCardResponse } from '@withbee/types';
import { motion } from 'framer-motion';
import { ButtonBanking } from '@withbee/ui/banking-button';

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const myAccountId = params.id;

  const [accountInfo, setAccountInfo] = useState<AccountInfo | undefined>();
  const [payAm, setPayAm] = useState<string>(''); // 거래 금액 상태
  const [rqspeNm, setRqspeNm] = useState<string>(''); // 거래 내역(상호명) 상태
  const [isWibeeCard, setIsWibeeCard] = useState<
    WibeeCardResponse | undefined
  >(); // 위비 카드 연결 여부
  const [isWibeeCardCheckbox, setIsWibeeCardCheckbox] =
    useState<boolean>(true);
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

  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 등록하기 버튼 활성화/비활성화 체크
  const isSubmitDisabled = !payAm || !rqspeNm || payAm === '0';

  return (
    <div className={styles.container}>
      <Title label="결제 내역 추가" />

      <motion.div
        className={styles.form}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={styles.inputContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label htmlFor="password">거래 내역(상호명)</label>
          <input
            type="text"
            value={rqspeNm}
            onChange={(e) => setRqspeNm(e.target.value)}
            placeholder="상호명을 입력해주세요"
            className={styles.input}
          />
        </motion.div>

        <motion.div
          className={styles.inputContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label htmlFor="password">거래 금액</label>
          <input
            type="tel"
            value={payAm}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ''); // 숫자만 추출
              setPayAm(value ? parseInt(value, 10).toLocaleString() : '');
            }}
            placeholder="금액 입력"
            className={styles.input}
            maxLength={13}
          />
        </motion.div>

        {/* 위비 카드 결제 버튼 */}
        {isWibeeCard?.connectedWibeeCard && (
          <motion.div
            className={styles.wibeeCardInfo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <label htmlFor="password">카드 선택</label>
            <div className={styles.wibeeCardButtonGroup}>
              <ButtonBanking
                primary={isWibeeCardCheckbox}
                label="위비 카드"
                size="medium"
                onClick={() => setIsWibeeCardCheckbox(true)}
              />
              <ButtonBanking
                primary={!isWibeeCardCheckbox}
                label="일반 카드"
                size="medium"
                onClick={() => setIsWibeeCardCheckbox(false)}
              />
            </div>
          </motion.div>
        )}

        <motion.div
          className={styles.accountInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {accountInfo ? (
            <motion.p
              className={styles.balance}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              {accountInfo.product} 잔액: {formatNumber(accountInfo.balance)}원
            </motion.p>
          ) : (
            <p>계좌 정보를 불러오는 중입니다...</p>
          )}
        </motion.div>

        {/* 등록하기 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <ButtonBanking
            label="등록하기"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          />
        </motion.div>
      </motion.div>

      {/* PinNumberModal 컴포넌트 유지 */}
      <PinNumberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePinSubmit}
      />
    </div>
  );
}
