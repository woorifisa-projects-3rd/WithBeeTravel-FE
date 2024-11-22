// components/InviteCodeModal.tsx
import React, { useState } from 'react';
import { Modal } from '@withbee/ui/modal';
import styles from './InviteCodeModal.module.css';

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
}) => {
  const { isCopyMode, inviteCode = '' } = modalState;
  const [inputValue, setInputValue] = useState(inviteCode);

  React.useEffect(() => {
    if (isOpen && isCopyMode) {
      setInputValue(inviteCode);
    }
  }, [isOpen, isCopyMode, inviteCode]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalState.title}
      closeLabel={modalState.closeLabel}
    >
      <p className={styles.subtitle}>{modalState.subtitle}</p>
      <input
        id="inviteCode"
        type="text"
        className={styles.input}
        value={inviteCode}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={modalState.placeholder || '초대코드'}
        readOnly={isCopyMode}
      />
    </Modal>
  );
};
