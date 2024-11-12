'use client';

import Image from 'next/image';
import { Button } from './button';
import styles from './menu.module.css';
import { Tag } from './tag';
import { useState } from 'react';
import { BottomModal } from './modal';
import selectIcon from './assets/select.png';

interface MenuProps {
  className?: string;
}

export const Menu = ({ className, ...props }: MenuProps) => {
  const [isOpen, setIsOpen] = useState({
    period: false,
    member: false,
    sort: false,
  });
  const [selected, setSelected] = useState({
    period: '전체',
    member: '전체',
    sort: '최신순',
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
          <Tag
            label="최신순"
            size="small"
            type="select"
            onClick={() => handleModal('sort')}
          />
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
          <ul className={styles.list}>
            {['전체', '삼도삼', '진콩이', '호초루', '연콩이', '대장님'].map(
              (member) => (
                <li
                  key={member}
                  onClick={() => setSelected({ ...selected, member })}
                >
                  {member}
                  {selected.member === member && (
                    <Image
                      src={selectIcon}
                      alt="select"
                      width={25}
                      height={25}
                    />
                  )}
                </li>
              ),
            )}
          </ul>
        </BottomModal>
      )}
      {isOpen.period && (
        <BottomModal
          isOpen={isOpen.period}
          onClose={() => handleModal('period')}
          title="기간 설정"
        >
          <ul className={styles.list}>
            <li onClick={() => setSelected({ ...selected, period: '전체' })}>
              전체
              {selected.period === '전체' && (
                <Image src={selectIcon} alt="select" width={25} height={25} />
              )}
            </li>
            <li>
              시작일<span>2024.10.28</span>
            </li>
            <li>
              종료일<span>2024.10.28</span>
            </li>
          </ul>
        </BottomModal>
      )}
      {isOpen.sort && (
        <BottomModal
          isOpen={isOpen.sort}
          onClose={() => handleModal('sort')}
          title="정렬"
        >
          <ul className={styles.list}>
            {['최신순', '금액순'].map((sort) => (
              <li key={sort} onClick={() => setSelected({ ...selected, sort })}>
                {sort}
                {selected.sort === sort && (
                  <Image src={selectIcon} alt="select" width={25} height={25} />
                )}
              </li>
            ))}
          </ul>
        </BottomModal>
      )}
    </section>
  );
};
