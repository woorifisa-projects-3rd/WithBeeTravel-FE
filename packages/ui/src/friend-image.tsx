/* eslint-disable no-redeclare */
import Image from 'next/image';
import styles from './friend-image.module.css';
import { HTMLAttributes } from 'react';

interface FriendImageProps extends HTMLAttributes<HTMLImageElement> {
  number: number;
  size?: number;
  className?: string;
}

export const FriendImage = ({
  number,
  size = 40,
  className,
}: FriendImageProps) => {
  // 1-10 사이의 숫자로 제한
  const safeNumber = Math.max(1, Math.min(10, number));

  return (
    <Image
      src={`/friends/${safeNumber}.png`}
      alt={`Friend ${safeNumber}`}
      width={size}
      height={size}
      className={[styles.friend, className].join(' ')}
    />
  );
};
