'use client';

import { FriendImage } from './friend-image';
import styles from './payment.module.css';
import { Tag } from './item';
import { motion } from 'framer-motion';

const friends = [1, 2, 3, 4, 5, 7, 9, 6];

export const Payment = () => {
  const width = window !== undefined ? window.innerWidth : 0;

  // width > 390px일 때는 5명까지, 그 이하는 4명까지 보여줌
  const visibleFriendsLength = width > 390 ? 5 : 4;

  return (
    <article className={styles.payment}>
      <FriendImage
        number={Math.round((friends.length - 1) * Math.random())}
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
          <div className={styles.friends}>
            {friends.slice(0, visibleFriendsLength).map((friend) => (
              <FriendImage key={friend} number={friend} size={35} />
            ))}
            {friends.length > visibleFriendsLength && (
              <motion.button className={styles.plusButton}>
                <button className={styles.moreFriends}>
                  +{friends.length - visibleFriendsLength}
                </button>
              </motion.button>
            )}
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <Tag label="1,491.33 KRW/EUR" size="small" />
          <div className={styles.optionsWrapper}>
            <button className={styles.option}>기록 추가</button>
          </div>
        </div>
      </div>
    </article>
  );
};
