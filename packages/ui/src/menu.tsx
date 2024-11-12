'use client';

import Image from 'next/image';
import { Button } from './button';
import styles from './menu.module.css';
import { Tag } from './tag';
import { useState } from 'react';
import { BottomModal } from './modal';

interface MenuProps {
  className?: string;
}

export const Menu = ({ className, ...props }: MenuProps) => {
  const [isOpen, setIsOpen] = useState({
    period: false,
    member: false,
    sort: false,
  });
  const [isFilter, setIsFilter] = useState(false);

  const handleFilter = () => {
    setIsFilter(!isFilter);
  };

  const handleModal = (key: 'period' | 'member' | 'sort') => {
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
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
            <Tag
              label="전체 기간"
              size="small"
              type="select"
              onClick={() => handleModal('period')}
            />
            <Tag
              label="결제 멤버"
              size="small"
              type="select"
              onClick={() => handleModal('member')}
            />
          </div>
          <Tag label="최신순" size="small" type="select" />
        </div>
      ) : (
        <div className={styles.default}>
          <Button label="불러오기" size={'small'} />
          <Button label="직접 추가" size={'small'} primary={false} />
        </div>
      )}
      {isOpen.member && (
        <BottomModal
          isOpen={isOpen.member}
          onClose={() => handleModal('member')}
          title="결제 멤버"
        >
          <ul className={styles.memberList}>
            <li>삼도삼</li>
            <li>진콩이</li>
            <li>호초루</li>
            <li>연콩이</li>
            <li>대장님</li>
          </ul>
        </BottomModal>
      )}
    </section>
  );
};
