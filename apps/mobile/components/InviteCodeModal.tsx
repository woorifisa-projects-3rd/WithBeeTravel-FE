// components/InviteCodeModal.tsx
import React, { useState } from 'react';
import { Modal } from '@withbee/ui/modal';
import styles from './InviteCodeModal.module.css';

interface InviteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (inviteCode: string, travelId: number) => void;
  travelId: number;
}

export const InviteCodeModal: React.FC<InviteCodeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  travelId,
}) => {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = () => {
    onSubmit(inviteCode, travelId);
    setInviteCode(''); // 입력 값 초기화
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="초대코드를 입력해주세요."
      closeLabel="입력 완료"
      onSubmit={handleSubmit}
    >
      <p className={styles.subtitle}>초대 코드를 입력하여 그룹에 가입하세요.</p>
      <input
        id="inviteCode"
        type="text"
        className={styles.input}
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        placeholder="초대코드"
      />
    </Modal>
  );
};
