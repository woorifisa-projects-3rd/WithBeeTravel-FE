import Image from 'next/image';
import styles from './tag.module.css';
import deleteIcon from './assets/close.png';
import arrowIcon from './assets/arrow_down.png';

interface TagProps {
  label: string;
  size?: 'small' | 'medium';
  type?: 'default' | 'select' | 'delete';
}

// 컴포넌트 이름이 애매함
export const Tag = ({ label, size = 'medium', type = 'default' }: TagProps) => {
  return (
    <i className={[styles.tag, styles[size]].join(' ')}>
      {label}
      <button>
        {type === 'delete' && (
          <Image src={deleteIcon} alt="delete" width={14} height={14} />
        )}
        {type === 'select' && (
          <Image src={arrowIcon} alt="select" width={16.5} height={9} />
        )}
      </button>
    </i>
  );
};
