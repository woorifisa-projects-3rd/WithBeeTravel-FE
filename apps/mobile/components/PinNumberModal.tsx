import React, { useState, useEffect } from 'react';
import styles from './PinNumberModal.module.css';
import { instance } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';

interface PinNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
}

interface PinNumberRequest{
  pinNumber:string;
}

interface PinNumberResponse{
  failedPinCount:number;
  pinLocked:boolean;
}

const PinNumberModal: React.FC<PinNumberModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [pin, setPin] = useState<string>(''); // 비밀번호 저장 상태
  const [error, setError] = useState<string | null>(''); // error 초기값을 빈 문자열로 설정
  const [failCnt, setFailCnt] = useState<number>();

  const {showToast} = useToast();
  // 모달이 닫힐 때 PIN 초기화
  useEffect(() => {
    if (!isOpen) {
      setPin(''); // 모달이 닫히면 PIN을 초기화
      setError(''); // 에러도 초기화
    }

    if(isOpen){
      const fetchUserState = async () =>{
        const response = await instance.get<PinNumberResponse>('/verify/user-state');
        if('data' in response){
          if(response.data?.failedPinCount!=0){
            setError(`5회 틀릴 시 Pin번호 재설정 필요. ${response.data?.failedPinCount}/5`)
          }
          setFailCnt(response.data?.failedPinCount);
        } else{
          showToast.error({message:`핀번호 5회이상 틀렸습니다.\n
            핀번호 재 설정 후 이용가능!`})
            // TODO : 마이페이지로 리다이렉트? 할지 고민
            onClose();
        }
                
      }
      fetchUserState();

    }

    if(failCnt!=0){
    }

  
  }, [isOpen]); // isOpen이 변경될 때마다 초기화

  // 비밀번호 입력 처리
  const handleSubmit = async() => {
    const pinNumberRequest:PinNumberRequest = {
      pinNumber: pin,
    };

      const response = await instance.post(`/verify/pin-number`,{
        body: JSON.stringify(pinNumberRequest),
      }) 

      if(Number(response.status)===200){
        onSubmit(pin);  // 올바른 PIN이면 제출
        onClose();       // 모달 닫기
      } else{
        setFailCnt(Number(failCnt)+1);
        setError(`5회 틀릴 시 Pin번호 재설정 필요. ${Number(failCnt)+1}/5`);
        setTimeout(() => {
          setPin(''); // PIN을 초기화
        }, 500); // 500ms 후에 PIN과 에러 메시지 초기화
        if(Number(failCnt)>=4){
          alert("송금 할 수 없습니다. \nPin번호 재설정 필요");
          onClose();
        }
      }

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  // 숫자 버튼 클릭 처리
  const handleNumberPress = (key: string) => {
    if (key === 'backspace') {
      setPin(pin.slice(0, -1)); // 백스페이스 처리
    } else if (key === 'clear') {
      setPin(''); // 비밀번호 초기화
    } else if (pin.length < 6) {
      setPin(pin + key); // 숫자 추가
    }
  };

  // 가상 키보드 렌더링
  const renderKeyboard = () => (
    <div className={styles.keyboard}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', '←'].map((key) => (
        <button
          key={key}
          className={styles.keyboardKey}
          onClick={() =>
            handleNumberPress(key === '←' ? 'backspace' : key === 'X' ? 'clear' : key)
          }
        >
          {key}
        </button>
      ))}
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

  // 자동 검증 처리: 4자리 PIN 입력 시 자동으로 검증
  useEffect(() => {
    if (pin.length === 6) {
      handleSubmit();
    }
  }, [pin]); // pin이 변경될 때마다 자동 검증

  return (
    isOpen && (
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.closeButton} onClick={onClose}>←</div>
          <h2 className={styles.inputPinNumberText}>핀번호 입력</h2>
          {renderPinInput()}

          {/* 에러 메시지가 있을 때만 텍스트를 변경하고, 없으면 빈 공간을 차지 */}
          <p className={`${styles.error} ${error ? '' : styles.hidden}`}>{error}</p>

          {renderKeyboard()}
        </div>
      </div>
    )
  );
};

export default PinNumberModal;
