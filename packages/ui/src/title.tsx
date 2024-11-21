'use client';

import Image from 'next/image';
import backIcon from './assets/back.png';
import alarm from './assets/title/bell.png';
import styles from './title.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      <Link href="/notification">
        <Image
          src={alarm}
          alt="알림"
          width={20}
          height={20}
          className={styles.alarm}
        />
      </Link>
    </nav>
  );
};
