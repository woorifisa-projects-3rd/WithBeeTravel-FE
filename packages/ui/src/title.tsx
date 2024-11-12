'use client';

import Image from 'next/image';
import backIcon from './assets/back.png';
import styles from './title.module.css';
import { useRouter } from 'next/navigation';

interface TitleProps {
  label: string;
}

export const Title = ({ label }: TitleProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <nav className={styles.nav}>
      <Image
        src={backIcon}
        alt="뒤로 가기"
        width={7}
        height={13}
        onClick={handleClick}
        className={styles.back}
      />
      <h1 className={styles.label}>{label}</h1>
    </nav>
  );
};
