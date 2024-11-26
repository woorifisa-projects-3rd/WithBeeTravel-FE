import { ImgHTMLAttributes } from 'react';
import styles from './record-image.module.css';
import Image from 'next/image';

interface recordImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  imageUrl?: string;
}

export const RecordImage = ({
  imageUrl = '/imgs/travelselect/wibee_gray.png',
}: recordImageProps) => {
  return (
    <Image
      src={imageUrl}
      alt="여행 기록 사진"
      width={280}
      height={207}
      objectFit="cover"
      className={styles.recordImage}
    />
  );
};
