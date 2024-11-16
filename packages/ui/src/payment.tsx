'use client';

import { useState } from 'react';
import { FriendImage } from './friend-image';
import styles from './payment.module.css';
import { Tag } from './item';
import { motion } from 'framer-motion';
import { Modal } from './modal';
import notSelectIcon from './assets/not_select.png';
import selectIcon from './assets/select.png';
import Image from 'next/image';

const width = window?.innerWidth;

// width > 390px일 때는 5명까지, 그 이하는 4명까지 보여줌
const visibleFriendsLength = width > 390 ? 5 : 4;

const friends = [1, 2, 3, 4, 5, 7, 9, 6];

export const Payment = () => {
  const [isOpen, setIsOpen] = useState(false); // 정산 인원 선택 모달 열기/닫기
  const [selectedFriends, setSelectedFriends] = useState<number[]>(friends);

  const handleSelectFriend = (friend: number) => {
    if (selectedFriends.includes(friend)) {
      setSelectedFriends((prev) => prev.filter((f) => f !== friend));
    } else {
      setSelectedFriends((prev) => [...prev, friend]);
    }
  };

  console.log('selectedFriends', selectedFriends);

  return (
    <article className={styles.payment}>
      <FriendImage
        number={1 + Math.round(8 * Math.random())}
        size={50}
        className={styles.friendImage}
      />
      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <div className={styles.info}>
            <span className={styles.time}>10:48</span>
            <b className={styles.price}>21,948원 (6 EUR)</b>
            <span className={styles.location}>최가네 김밥</span>
          </div>
          <div
            className={styles.friends}
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            {selectedFriends.slice(0, visibleFriendsLength).map((friend) => (
              <FriendImage key={friend} number={friend} size={35} />
            ))}
            <motion.button className={styles.plusButton}>
              <button className={styles.moreFriends}>
                {/* {selectedFriends.length > visibleFriendsLength &&
                  selectedFriends.length - visibleFriendsLength} */}
                {selectedFriends.length}명
              </button>
            </motion.button>
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <Tag label="1,491.33 KRW/EUR" size="small" />
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
                  <FriendImage key={friend} number={friend} size={35} />
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
