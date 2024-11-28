'use client';

import { Modal } from './modal';
import styles from './record-modal.module.css';
import {
  SharedPaymentRecordRequest,
  SharedPaymentRecordResponse,
} from '@withbee/types';
import { useState } from 'react';
import Image from 'next/image';
import notSelectIcon from './assets/not_select.png';
import selectIcon from './assets/select.png';
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      setRecord({ ...record, paymentImage: e.target.files[0] });
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="기록 추가"
      closeLabel="입력 완료"
      onSubmit={onSubmit}
    >
      <div className={styles.record}>
        <div className={styles.image}>
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
        <div
          className={styles.isMainImage}
          onClick={() =>
            setRecord({
              ...record,
              isMainImage: !record.isMainImage,
            })
          }
        >
          {record.isMainImage ? (
            <Image
              src={selectIcon}
              alt="select"
              width="18"
              height="18"
              className={styles.selectIcon}
            />
          ) : (
            <Image
              src={notSelectIcon}
              alt="not select"
              width="18"
              height="18"
              className={styles.notSelectIcon}
            />
          )}
          <span>그룹 대표 이미지로 설정</span>
        </div>
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
