import Image from 'next/image';
import backIcon from './assets/back.png';
import styles from './title.module.css';

interface TitleProps {
  label: string;
  onClick?: () => void;
}

export const Title = ({ label, onClick }: TitleProps) => {
  return (
    <nav className={styles.nav}>
      <Image
        src={backIcon}
        alt="뒤로 가기"
        width={7}
        height={13}
        onClick={onClick}
      />
      <h1 className={styles.label}>{label}</h1>
    </nav>
  );
};
