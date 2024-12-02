// app/travel/[id]/invite-code-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@withbee/ui/button';
import { InviteCodeModal } from '../../../components/InviteCodeModal';
import { getInviteCode } from '@withbee/apis';

export function InviteCodeButton({ travelId }: { travelId: number }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '초대 코드를 공유하세요.',
    closeLabel: '닫기',
    subtitle: '초대 코드를 복사하여 친구를 초대하세요.',
    isCopyMode: false,
    inviteCode: '',
  });

  const handleGetInviteCode = async () => {
    const response = await getInviteCode(travelId);

    if ('code' in response) {
      alert(response.message);
      return;
    }

    if ('data' in response && response.data) {
      setModalState((prevState) => ({
        ...prevState,
        isOpen: true,
        isCopyMode: true,
        inviteCode: response.data!.inviteCode,
      }));
    }
  };

  return (
    <>
      <Button label="친구 초대" primary={false} onClick={handleGetInviteCode} />
      <InviteCodeModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        modalState={modalState}
      />
    </>
  );
}
