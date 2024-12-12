'use client';

import { Modal } from './modal';
import styles from './record-modal.module.css';
import {
  SharedPaymentRecordRequest,
  SharedPaymentRecordResponse,
} from '@withbee/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import notSelectIcon from './assets/not_select.png';
import selectIcon from './assets/select.png';
import plusIcon from './assets/plus.png';
import {
  getSharedPaymentRecord,
  updateSharedPaymentRecord,
} from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { RecordModalSkeleton } from './record-modal-skeleton';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelId: string;
  sharedPaymentId: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  travelId,
  sharedPaymentId,
}) => {
  const [record, setRecord] = useState<SharedPaymentRecordRequest>({
    paymentImage: null,
    paymentComment: '',
    isMainImage: false,
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      setRecord({ ...record, paymentImage: e.target.files[0] });
      setImageSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGetSharedPaymentRecord = async () => {
    const response = await getSharedPaymentRecord(travelId, sharedPaymentId);

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }

    if ('data' in response) {
      if (response.data?.paymentImage) setImageSrc(response.data.paymentImage);
      setRecord((prevRecord) => ({
        ...prevRecord,
        paymentComment:
          response.data?.paymentComment || prevRecord.paymentComment,
        isMainImage: response.data?.mainImage || prevRecord.isMainImage,
      }));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetSharedPaymentRecord();
  }, [isOpen === true]);

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append(
      'paymentImage',
      record.paymentImage ? record.paymentImage : new Blob(),
    );
    formDataToSend.append('paymentComment', record.paymentComment);
    formDataToSend.append('isMainImage', record.isMainImage.toString());
    const response = await updateSharedPaymentRecord(
      travelId,
      sharedPaymentId,
      formDataToSend,
    );

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="캡슐 만들기"
      closeLabel="입력 완료"
      onSubmit={handleSubmit}
    >
      {isLoading ? (
        <RecordModalSkeleton />
      ) : (
        <div className={styles.record} data-cy="record-modal">
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
      )}
    </Modal>
  );
};
