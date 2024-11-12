/* eslint-disable no-redeclare */
import Image from 'next/image';
import styles from './friend-image.module.css';

interface FriendImageProps {
  number: number;
  size?: number;
}

export const FriendImage = ({ number, size = 40 }: FriendImageProps) => {
  // 1-10 사이의 숫자로 제한
  const safeNumber = Math.max(1, Math.min(10, number));

  return (
    <Image
      src={`/friends/${safeNumber}.png`}
      alt={`Friend ${safeNumber}`}
      width={size}
      height={size}
      className={styles.friend}
    />
  );
};
