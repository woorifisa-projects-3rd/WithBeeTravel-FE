import { Modal } from './modal';
import styles from './record-modal.module.css';
import {
  SharedPaymentRecordRequest,
  SharedPaymentRecordResponse,
} from '@withbee/types';
import { useState } from 'react';
import Image from 'next/image';
import plusIcon from './assets/plus.png';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  travelId: string;
  sharedId: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  travelId,
  sharedId,
}) => {
  const [record, setRecord] = useState<SharedPaymentRecordResponse>({
    paymentImage: null,
    paymentComment: undefined,
    isMainImage: false,
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFileChange = () => {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="기록 추가"
      closeLabel="입력 완료"
      onSubmit={onSubmit}
    >
      <div>
        <div>
          <input
            id="paymentImageFileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.paymentImage}
          />
          <label
            htmlFor="paymentImageFileInput"
            className={styles.paymentImageBox}
          >
            {imageSrc === null ? (
              <Image
                src={plusIcon}
                alt="이미지를 선택하세요"
                className={styles.imagePreview}
                width={18}
                height={18}
              />
            ) : (
              <Image
                src={imageSrc}
                alt="업로드된 이미지 미리보기"
                className={styles.imagePreview}
                layout="fill"
                objectFit="cover"
              />
            )}
          </label>
        </div>
        <div></div>
        <textarea
          value={record.paymentComment}
          onChange={(e) =>
            setRecord({
              ...record,
              paymentComment: e.target.value,
            })
          }
          placeholder="문구를 작성해주세요."
          className={styles.recordComment}
          maxLength={100}
        />
      </div>
    </Modal>
  );
};
