'use client';

import { Modal } from '@withbee/ui/modal';
import { cancelSettlement } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { useRouter } from 'next/navigation';
import { ERROR_MESSAGES } from '@withbee/exception';
import styles from './../app/travel/[id]/settlement/page.module.css';

export default function ModalWrapper({ travelId }: { travelId: number }) {
  const { showToast } = useToast();
  const router = useRouter();

  const handleCancelSettlement = async () => {
    const response = await cancelSettlement(travelId);

    if ('code' in response) {
      showToast.warning({
        message: ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES],
      });

      showToast.error({
        message: ERROR_MESSAGES['COMMON'],
      });
    }
    router.push(`/travel/${travelId}/settlement/canceled`);
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => router.push(`/travel/${travelId}/settlement`)} // 모달 닫기
      title="정산을 취소하시겠습니까?"
      closeLabel="정산 취소하기"
      onSubmit={handleCancelSettlement} // 정산 취소 처리
    >
      <p className={styles.subtitle}>
        정산 취소는 되돌릴 수 없으며,
        <br />
        모든 그룹원에게 알림이 전송됩니다.
      </p>
    </Modal>
  );
}
