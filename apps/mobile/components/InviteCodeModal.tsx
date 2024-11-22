// components/InviteCodeModal.tsx
import React, { useState } from 'react';
import { Modal } from '@withbee/ui/modal';
import styles from './InviteCodeModal.module.css';

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inviteCode: string) => void;
  modalState: {
    title: string;
    closeLabel?: string;
    placeholder?: string;
    subtitle?: string;
  };
}

export const InviteCodeModal: React.FC<InviteCodeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  modalState,
}) => {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = () => {
    onSubmit(inviteCode);
    setInviteCode(''); // 입력 값 초기화
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalState.title}
      closeLabel={modalState.closeLabel}
      onSubmit={handleSubmit}
    >
      {modalState.subtitle && (
        <p className={styles.subtitle}>{modalState.subtitle}</p>
      )}
      <input
        id="inviteCode"
        type="text"
        className={styles.input}
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        placeholder={modalState.placeholder || '초대코드'}
      />
    </Modal>
  );
};
