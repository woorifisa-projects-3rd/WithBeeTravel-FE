'use client';
import React, { useState, useEffect } from 'react';
import styles from './PinNumberModal.module.css';
import { getUserState, verifyPin } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';

interface PinNumberModalProps {
  isRegister?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
}

const PinNumberModal: React.FC<PinNumberModalProps> = ({
  isRegister = false,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [pin, setPin] = useState<string>(''); // 비밀번호 저장 상태
  const [error, setError] = useState<string | null>(''); // error 초기값을 빈 문자열로 설정
  const [failCnt, setFailCnt] = useState<number>();
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const { showToast } = useToast();

  // 모달이 닫힐 때 PIN 초기화
  useEffect(() => {
    if (!isOpen) {
      setPin(''); // 모달이 닫히면 PIN을 초기화
      setError(''); // 에러도 초기화
    }

    if (isOpen && !isRegister) {
      const fetchUserState = async () => {
        const response = await getUserState();
        if ('data' in response) {
          if (response.data?.failedPinCount !== 0) {
            setError(
              `5회 이상 잘못 입력 시 재설정 필요 ${response.data?.failedPinCount}/5`,
            );
          }
          setFailCnt(response.data?.failedPinCount);
        } else {
          showToast.error({
            message:
              'PIN 번호를 5회 이상 잘못 입력하셨습니다. PIN 번호를 재설정한 후 이용 가능합니다.',
          });
          onClose();
        }
      };
      fetchUserState();
    }
  }, [isOpen]);

  // 비밀번호 입력 처리
  const handleSubmit = async () => {
    if (!isRegister) {
      const response = await verifyPin(pin);

      if (Number(response.status) === 200) {
        onSubmit(pin); // 올바른 PIN이면 제출
        onClose(); // 모달 닫기
      } else {
        setFailCnt(Number(failCnt) + 1);
        setError(`5회 이상 잘못 입력 시 재설정 필요 ${Number(failCnt) + 1}/5`);
        setTimeout(() => {
          setPin(''); // PIN을 초기화
        }, 500); // 500ms 후에 PIN과 에러 메시지 초기화
        if (Number(failCnt) >= 4) {
          showToast.error({ message: '핀번호 재설정 필요' });
          onClose();
        }
      }
    } else {
      onSubmit(pin); // PIN 설정이면 제출
      onClose(); // 모달 닫기
    }
  };

  const handleNumberPress = (key: string) => {
    if (key === 'backspace') {
      setPin(pin.slice(0, -1));
      setActiveKeys(['←']);
      setTimeout(() => setActiveKeys([]), 100);
      return;
    }

    if (key === 'clear') {
      setPin('');
      setActiveKeys(['X']);
      setTimeout(() => setActiveKeys([]), 100);
      return;
    }

    if (pin.length < 6) {
      setPin(pin + key);

      // 랜덤한 두 개의 추가 버튼 선택
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].filter(
        (n) => n !== key,
      );
      const randomNumbers = numbers.sort(() => Math.random() - 0.5).slice(0, 2);

      // 활성화할 키들 설정
      setActiveKeys([key, ...randomNumbers]);
      setTimeout(() => setActiveKeys([]), 100);
    }
  };

  const renderKeypadButton = (key: string) => {
    const isActive = activeKeys.includes(key);
    const actualKey = key === '←' ? 'backspace' : key === 'X' ? 'clear' : key;

    return (
      <button
        key={key}
        className={`${styles.keyboardKey} ${isActive ? styles.customActive : ''}`}
        onClick={() => handleNumberPress(actualKey)}
      >
        {key}
      </button>
    );
  };

  // 자동 검증 처리: 6자리 PIN 입력 시 자동으로 검증
  useEffect(() => {
    if (pin.length === 6) {
      handleSubmit();
    }
  }, [pin]); // pin이 변경될 때마다 자동 검증

  return (
    isOpen && (
      <>
        <div className={styles.modal} onClick={onClose} />
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose} />
          <h2 className={styles.inputPinNumberText}>
            PIN 번호 {isRegister ? '설정' : '입력'}
          </h2>

          {/* PIN 입력 */}
          <div className={styles.pinInputContainer}>
            <div className={styles.pinInput}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.pinCircle} ${pin.length > index ? styles.filled : ''}`}
                />
              ))}
            </div>
          </div>

          {/* 에러 메시지가 있을 때만 텍스트를 변경하고, 없으면 빈 공간을 차지 */}
          <p className={`${styles.error} ${error ? '' : styles.hidden}`}>
            {error}
          </p>

          {/* 키패드 */}
          <div className={styles.keyboard}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '←'].map(
              renderKeypadButton,
            )}
          </div>
        </div>
      </>
    )
  );
};

export default PinNumberModal;
