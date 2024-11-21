'use client';

import { useEffect, useState } from 'react';
import { FriendImage } from './friend-image';
import styles from './payment.module.css';
import { Item } from './item';
import { motion } from 'framer-motion';
import { Modal } from './modal';
import notSelectIcon from './assets/not_select.png';
import selectIcon from './assets/select.png';
import Image from 'next/image';
import {
  ParticipatingMember,
  SharedPayment,
  TravelMember,
} from '@withbee/types';
import { useToast } from '@withbee/hooks/useToast';
import dayjs from 'dayjs';

import 'dayjs/locale/ko'; // 한글 로케일 import
import { chooseParticipants } from '@withbee/apis';

dayjs.locale('ko'); // 한글 로케일 설정

interface PaymentProps {
  travelId: number;
  travelMembers: TravelMember[];
  paymentInfo: SharedPayment;
}

export const Payment = ({
  travelId,
  travelMembers,
  paymentInfo,
}: PaymentProps) => {
  const { showToast } = useToast();
  const [windowWidth, setWindowWidth] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // 정산 인원 선택 모달 열기/닫기
  const [selectedMembers, setSelectedMembers] = useState<ParticipatingMember[]>(
    paymentInfo.participatingMembers,
  );
  const [tempSelectedMembers, setTempSelectedMembers] =
    useState<ParticipatingMember[]>(selectedMembers);

  const handleSelectMember = (member: ParticipatingMember) => {
    // 선택된 멤버가 이미 선택된 경우 제거
    if (
      tempSelectedMembers.some(
        (selectedMember) => selectedMember.id === member.id,
      )
    ) {
      if (tempSelectedMembers.length === 1) {
        showToast.warning({
          message: '최소 1명은 선택되어야 합니다.',
        });
        return;
      }

      setTempSelectedMembers((prev) =>
        prev.filter((selectedMember) => selectedMember.id !== member.id),
      );
    } else {
      setTempSelectedMembers((prev) => [...prev, member]);
    }
  };

  const handleSubmit = async () => {
    // 정산 인원 선택 API 호출
    await chooseParticipants({
      travelId: travelId,
      paymentId: paymentInfo.id,
      travelMembersId: selectedMembers.map((member) => member.id),
    });
    setSelectedMembers(tempSelectedMembers);
    showToast.success({
      message: '정산 인원이 변경되었습니다.',
    });
  };

  // width > 390px일 때는 5명까지, 그 이하는 4명까지 보여줌
  const visibleMembersLength =
    paymentInfo.participatingMembers.length > 4
      ? windowWidth > 390
        ? 5
        : 4
      : selectedMembers.length;

  useEffect(() => {
    // 초기 윈도우 너비 설정
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedMembers([...selectedMembers]);
    }
  }, [isOpen]);

  return (
    <article className={styles.payment}>
      <FriendImage
        src={paymentInfo.adderProfileIcon}
        size={50}
        className={styles.friendImage}
      />
      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <div className={styles.info}>
            <span className={styles.time}>
              {dayjs(paymentInfo.paymentDate).format('HH:mm')}
            </span>
            <b className={styles.price}>
              {paymentInfo.paymentAmount}원 ({paymentInfo.foreignPaymentAmount}
              {paymentInfo.unit})
            </b>
            <span className={styles.location}>{paymentInfo.storeName}</span>
          </div>
          <div
            className={styles.friends}
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            {/* 정산 참여 멤버들을 보여주는 부분 */}
            {selectedMembers.slice(0, visibleMembersLength).map((member) => (
              <FriendImage
                key={member.id}
                src={member.profileImage}
                size={35}
              />
            ))}
            <motion.button className={styles.plusButton}>
              <button className={styles.moreFriends}>
                {selectedMembers.length}명
              </button>
            </motion.button>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          {paymentInfo.unit !== 'KRW' ? (
            <Item
              label={paymentInfo.exchangeRate + 'KRW/' + paymentInfo.unit}
              size="small"
            />
          ) : (
            <Item label="국내 여행" size="small" />
          )}
          <div className={styles.optionsWrapper}>
            <button className={styles.option}>기록 추가</button>
          </div>
        </div>
      </div>

      {/* 정산인원선택 모달 */}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
          title={`정산을 함께 할 <br />
            그룹원을 선택해주세요!`}
          closeLabel="확인"
        >
          <div className={styles.friendsModal}>
            {travelMembers.map((member) => (
              <div
                className={styles.friendRow}
                key={member.id}
                onClick={() => handleSelectMember(member)}
              >
                <div className={styles.friendInfo}>
                  <FriendImage src={member.profileImage} size={35} />
                  <span>{member.name}</span>
                </div>
                {tempSelectedMembers.some(
                  (selectedMember) => selectedMember.id === member.id,
                ) ? (
                  <Image
                    src={selectIcon}
                    alt="select"
                    width="30"
                    height="30"
                    className={styles.selectIcon}
                  />
                ) : (
                  <Image
                    src={notSelectIcon}
                    alt="not select"
                    width="30"
                    height="30"
                    className={styles.notSelectIcon}
                  />
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </article>
  );
};
