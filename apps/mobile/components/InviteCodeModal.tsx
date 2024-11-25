// components/InviteCodeModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@withbee/ui/modal';
import styles from './InviteCodeModal.module.css';
import Image from 'next/image';

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (inviteCode: string) => void;
  modalState: {
    title: string;
    closeLabel?: string;
    placeholder?: string;
    subtitle?: string;
    isCopyMode?: boolean;
    inviteCode?: string;
  };
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
    if (isOpen && isCopyMode) {
      setInputValue(inviteCode);
    }
  }, [isOpen, isCopyMode, inviteCode]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(inputValue);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inputValue);
      alert('초대 코드가 복사되었습니다.');
    } catch (err) {
      alert('복사에 실패했습니다. 다시 시도해주세요.');
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
          <button
            className={`${styles.copyButton} ${isCopyMode ? styles.copyButtonActive : ''}`}
            onClick={handleCopy}
            aria-label="복사하기"
          >
            <Image src="/copy.png" alt="복사하기" width={24} height={24} />
          </button>
        )}
      </div>
    </Modal>
  );
};
