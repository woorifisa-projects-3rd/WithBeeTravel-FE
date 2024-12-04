'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@withbee/ui/modal';
import styles from './InviteCodeModal.module.css';
import Image from 'next/image';
import { useToast } from '@withbee/hooks/useToast';
import { Kakao, InviteCodeModalProps } from '@withbee/types';

declare global {
  interface Window {
    Kakao?: Kakao;
  }
}

export const InviteCodeModal: React.FC<InviteCodeModalProps> = ({
  isOpen,
  onClose,
  modalState,
  onSubmit,
}) => {
  const { isCopyMode, inviteCode = '' } = modalState;
  const [inputValue, setInputValue] = useState(inviteCode);

  const isReadOnly = modalState.closeLabel === '닫기' || isCopyMode;

  useEffect(() => {
    // Kakao SDK 로드
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Kakao SDK 초기화 (your Kakao JavaScript 앱 키로 대체)
      if (window.Kakao && !(window.Kakao as Kakao).isInitialized()) {
        (window.Kakao as Kakao).init('39295272243b35bf220357208c1ca580');
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isOpen && isCopyMode) {
      setInputValue(inviteCode);
    }
  }, [isOpen, isCopyMode, inviteCode]);

  const { showToast } = useToast();

  const handleSubmit = () => {
    if (inputValue.trim() === '') {
      showToast.error({
        message: '초대 코드를 입력해주세요.',
      });
      return;
    }

    if (onSubmit) {
      onSubmit(inputValue);
    }
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      showToast.success({
        message: '초대 코드가 복사되었습니다.',
      });
    } catch (err) {
      showToast.error({
        message: '복사에 실패했습니다. 다시 시도해주세요.',
      });
    }
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      showToast.error({
        message: '카카오 공유 기능을 사용할 수 없습니다.',
      });
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: `초대 코드: ${inputValue}\n\n📋 아래 버튼을 눌러 초대 코드를 복사하세요.`,
        link: {
          // 웹페이지 링크 (선택사항)
          webUrl: window.location.href,
          mobileWebUrl: window.location.href,
        },
        buttons: [
          {
            title: '초대 코드 입력하러 가기',
            link: {
              webUrl: window.location.href,
              mobileWebUrl: window.location.href,
              ...((window.Kakao?.Share as any)?.androidExecutionParams && {
                androidExecutionParams: `copyCode=${inputValue}`,
                iosExecutionParams: `copyCode=${inputValue}`,
              }),
            } as any, // 타입 단언 사용
          },
        ],
      });
    } catch (error) {
      console.error('카카오톡 공유 중 오류 발생:', error);
      showToast.error({
        message: '카카오톡 공유에 실패했습니다.',
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalState.title}
      closeLabel={modalState.closeLabel}
      onSubmit={handleSubmit}
    >
      <p className={styles.subtitle}>{modalState.subtitle}</p>
      <div className={`${isCopyMode ? styles.copyButtonWrap : ''}`}>
        <input
          id="inviteCode"
          type="text"
          className={`${styles.input} ${isCopyMode ? styles.inputCopyMode : ''}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={modalState.placeholder || '초대코드'}
          readOnly={isReadOnly}
        />
        {isCopyMode && (
          <div className={styles.btnWrap}>
            <button aria-label="공유하기" onClick={handleKakaoShare}>
              <Image
                src="/imgs/travelform/share.png"
                alt="공유하기"
                width={25}
                height={25}
              />
            </button>
            <button
              className={`${styles.copyButton} ${isCopyMode ? styles.copyButtonActive : ''}`}
              onClick={handleCopy}
              aria-label="복사하기"
            >
              <Image
                src="/copy.png"
                alt="복사하기"
                width={22}
                height={24}
                quality={100}
              />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
