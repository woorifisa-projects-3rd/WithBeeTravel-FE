import Image from 'next/image';
import styles from './item.module.css';
import deleteIcon from './assets/close.png';
import arrowIcon from './assets/arrow_down.png';

interface ItemProps {
  label: string;
  size?: 'small' | 'medium';
  type?: 'default' | 'select' | 'delete';
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

export const Item = ({
  label,
  size = 'medium',
  type = 'default',
  onDelete,
  onClick,
  className = '',
}: ItemProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };
  return (
    <i
      className={[styles.item, styles[size], className].join(' ')}
      onClick={onClick}
    >
      {label}
      <button onClick={type === 'delete' ? handleDeleteClick : undefined}>
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
