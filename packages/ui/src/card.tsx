'use client';

import Image from 'next/image';
import styles from './card.module.css';
import { Tag } from './tag';

export interface CardProps {
  imageSrc?: string;
  time: string;
  comment: string;
  price: string;
  storeName: string;
}

export const Card = ({
  imageSrc,
  time,
  comment,
  price,
  storeName,
}: CardProps) => {
  return (
    <div className={styles.card}>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt="Card image"
          width={300}
          height={180}
          className={styles.image}
        />
      )}
      <div className={imageSrc ? styles.contentWithImage : styles.contentOnly}>
        <p className={styles.time}>{time}</p>
        <p className={styles.comment}>{comment}</p>
        <div className={styles.details}>
          <Tag label={price} />
          <Tag label={storeName} />
        </div>
      </div>
    </div>
  );
};

export default Card;
