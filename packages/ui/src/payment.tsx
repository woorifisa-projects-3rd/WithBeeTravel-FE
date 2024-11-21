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
import { SharedPayment } from '@withbee/types';
import dayjs from 'dayjs';

import 'dayjs/locale/ko'; // 한글 로케일 import

dayjs.locale('ko'); // 한글 로케일 설정

const friends = [1, 2, 3, 4, 5, 7, 9, 6];

interface PaymentProps {
  paymentInfo: SharedPayment;
}

export const Payment = ({ paymentInfo }: PaymentProps) => {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // 정산 인원 선택 모달 열기/닫기
  const [selectedFriends, setSelectedFriends] = useState<number[]>(friends);

  const handleSelectFriend = (friend: number) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends((prev) => prev.filter((f) => f !== friend));
    } else {
      setSelectedFriends((prev) => [...prev, friend]);
    }
  };

  // width > 390px일 때는 5명까지, 그 이하는 4명까지 보여줌
  const visibleFriendsLength =
    paymentInfo.participatingMembers.length > 4
      ? windowWidth > 390
        ? 5
        : 4
      : paymentInfo.participatingMembers.length;

  useEffect(() => {
    // 초기 윈도우 너비 설정
    setWindowWidth(window.innerWidth);
  }, []);

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
            {selectedFriends.slice(0, visibleFriendsLength).map((friend) => (
              <FriendImage key={friend} src={''} size={35} />
            ))}
            <motion.button className={styles.plusButton}>
              <button className={styles.moreFriends}>
                {/* {selectedFriends.length > visibleFriendsLength &&
                  selectedFriends.length - visibleFriendsLength} */}
                {paymentInfo.participatingMembers.length}명
              </button>
            </motion.button>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <Item
            label={paymentInfo.exchangeRate + 'KRW/' + paymentInfo.unit}
            size="small"
          />
          <div className={styles.optionsWrapper}>
            <button className={styles.option}>기록 추가</button>
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`정산을 함께 할 <br />
            그룹원을 선택해주세요!`}
          closeLabel="확인"
        >
          <div className={styles.friendsModal}>
            {friends.map((friend) => (
              <div
                className={styles.friendRow}
                key={friend}
                onClick={() => handleSelectFriend(friend)}
              >
                <div className={styles.friendInfo}>
                  <FriendImage key={friend} src={''} size={35} />
                  <span>콩이</span>
                </div>
                {selectedFriends.includes(friend) ? (
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
