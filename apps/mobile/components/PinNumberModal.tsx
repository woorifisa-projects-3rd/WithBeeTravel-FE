import React, { useState, useEffect } from 'react';
import styles from './PinNumberModal.module.css';
import { instance } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';

interface PinNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
}

interface PinNumberRequest {
  pinNumber: string;
}

interface PinNumberResponse {
  failedPinCount: number;
  pinLocked: boolean;
}

const PinNumberModal: React.FC<PinNumberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [pin, setPin] = useState<string>(''); // 비밀번호 저장 상태
  const [error, setError] = useState<string | null>(''); // error 초기값을 빈 문자열로 설정
  const [failCnt, setFailCnt] = useState<number>();

  const { showToast } = useToast();

  // 모달이 닫힐 때 PIN 초기화
  useEffect(() => {
    if (!isOpen) {
      setPin(''); // 모달이 닫히면 PIN을 초기화
      setError(''); // 에러도 초기화
    }

    if (isOpen) {
      const fetchUserState = async () => {
        const response =
          await instance.get<PinNumberResponse>('/api/verify/user-state');
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
    const pinNumberRequest: PinNumberRequest = {
      pinNumber: pin,
    };

    const response = await instance.post(`/api/verify/pin-number`, {
      body: JSON.stringify(pinNumberRequest),
    });

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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  const handleNumberPress = (key: string) => {
    if (key === 'backspace') {
      setPin(pin.slice(0, -1));
      // 백스페이스 버튼만 활성화
      const element = document.getElementById('←');
      if (element) {
        element.classList.add(styles.customActive ?? '');
        setTimeout(() => {
          element.classList.remove(styles.customActive ?? '');
        }, 100);
      }
      return;
    }

    if (key === 'clear') {
      setPin('');
      // X 버튼만 활성화
      const element = document.getElementById('X');
      if (element) {
        element.classList.add(styles.customActive ?? '');
        setTimeout(() => {
          element.classList.remove(styles.customActive ?? '');
        }, 100);
      }
      return;
    }

    if (pin.length < 6) {
      setPin(pin + key);

      // 숫자 버튼일 경우에만 랜덤한 두 개의 추가 버튼 활성화
      const randomKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      const randomIndices: (string | number)[] = [];

      while (randomIndices.length < 2) {
        const randIndex = Math.floor(Math.random() * randomKeys.length);
        if (
          !randomIndices.includes(randIndex) &&
          randomKeys[randIndex] !== key
        ) {
          randomIndices.push(randIndex);
        }
      }

      const activeKeys = [
        key,
        randomKeys[Number(randomIndices[0])],
        randomKeys[Number(randomIndices[1])],
      ];

      // active 상태 처리
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((k) => {
        const element = document.getElementById(k);
        if (element) {
          if (activeKeys.includes(k)) {
            element.classList.add(styles.customActive ?? '');
          } else {
            element.classList.remove(styles.customActive ?? '');
          }
        }
      });

      setTimeout(() => {
        activeKeys.forEach((k) => {
          const element = document.getElementById(k ?? '');
          if (element) {
            element.classList.remove(styles.customActive ?? '');
          }
        });
      }, 100);
    }
  };

  // 가상 키보드 렌더링
  const renderKeyboard = () => (
    <div className={styles.keyboard}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '←'].map(
        (key) => (
          <button
            key={key}
            id={key}
            className={styles.keyboardKey}
            onClick={() =>
              handleNumberPress(
                key === '←' ? 'backspace' : key === 'X' ? 'clear' : key,
              )
            }
            onTouchStart={(e) => e.preventDefault()} // 터치 시작 시 기본 동작 방지
          >
            {key}
          </button>
        ),
      )}
    </div>
  );

  // PIN 입력
  const renderPinInput = () => {
    return (
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
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.closeButton} onClick={onClose}>
            ←
          </div>
          <h2 className={styles.inputPinNumberText}>핀번호 입력</h2>
          {renderPinInput()}

          {/* 에러 메시지가 있을 때만 텍스트를 변경하고, 없으면 빈 공간을 차지 */}
          <p className={`${styles.error} ${error ? '' : styles.hidden}`}>
            {error}
          </p>

          {renderKeyboard()}
        </div>
      </div>
    )
  );
};

export default PinNumberModal;
