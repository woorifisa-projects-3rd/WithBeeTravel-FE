'use client';

import Image from 'next/image';
import { Button } from './button';
import styles from './menu.module.css';
import { Tag } from './tag';
import { useState } from 'react';

interface MenuProps {
  className?: string;
}

export const Menu = ({ className, ...props }: MenuProps) => {
  const [isFilter, setIsFilter] = useState(false);

  const handleFilter = () => {
    setIsFilter(!isFilter);
  };

  return (
    <section className={[styles.menu, className].join(' ')} {...props}>
      <Image
        src="/setting.png"
        alt="edit"
        width={28}
        height={28}
        onClick={handleFilter}
      />
      {isFilter ? (
        <div className={styles.filterContainer}>
          <div className={styles.filter}>
            <Tag label="전체 기간" size="small" type="select" />
            <Tag label="결제 멤버" size="small" type="select" />
          </div>
          <Tag label="최신순" size="small" type="select" />
        </div>
      ) : (
        <div className={styles.default}>
          <Button label="불러오기" size={'small'} />
          <Button label="직접 추가" size={'small'} primary={false} />
        </div>
      )}
    </section>
  );
};
