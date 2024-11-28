'use client';

import Image from 'next/image';
import { Button } from './button';
import styles from './menu.module.css';
import { Item } from './item';
import { useState } from 'react';
import { BottomModal } from './modal';
import selectIcon from './assets/select.png';
import DatePickerModal from './date-picker-modal';
import { usePaymentStore, useTravelStore } from '@withbee/stores';
import { getDateObject } from '@withbee/utils';
import { TravelMember } from '@withbee/types';
import { useRouter } from 'next/navigation';

interface MenuProps {
  // travelMembers: TravelMember[];
  className?: string;
  travelId: string;
}

const AllMembers: TravelMember = {
  id: 0,
  name: '전체',
  profileImage: 0,
};

export const Menu = ({ className, travelId, ...props }: MenuProps) => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sortBy,
    setSortBy,
    setIsDateFiltered,
    memberId,
    setMemberId,
  } = usePaymentStore();
  const [isOpen, setIsOpen] = useState({
    period: false,
    member: false,
    sort: false,
    start: false,
    end: false,
  });
  const [selected, setSelected] = useState({
    period: '전체',
    member: '전체',
    sort: sortBy === 'latest' ? '최신순' : '금액순',
  });

  const [isFilter, setIsFilter] = useState(false); // 필터 메뉴인지 여부

  const { travelMembers } = useTravelStore();

  // 모달 열기/닫기 핸들러
  const handleModal = (key: 'period' | 'member' | 'sort' | 'start' | 'end') => {
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 정렬 변경 핸들러
  const handleSort = () => {
    handleModal('sort');
    setSortBy(selected.sort === '최신순' ? 'latest' : 'amount');
  };

  // 전체 기간 선택 핸들러
  const handleSelectAllDate = () => {
    setIsDateFiltered(false);
    setSelected({ ...selected, period: '전체' });
  };

  // 시작일/종료일 선택 핸들러
  const handleDateSelect = (type: 'start' | 'end') => {
    setIsDateFiltered(true);
    handleModal(type);
    setSelected({ ...selected, period: '기간' });
  };

  // 멤버 선택 핸들러
  const handleMemberSelect = (member: TravelMember) => {
    setSelected({ ...selected, member: member.id.toString() });
    setMemberId(member.id);
    // handleModal('member');
  };

  const router = useRouter();

  // 직접 결제 내역 추가 페이지 이동 핸들러
  const handleRouteManualSharedPaymentPage = () => {
    router.push(`/travel/${travelId}/manual`);
  };

  return (
    <section className={[styles.menu, className].join(' ')} {...props}>
      <Image
        src="/setting.png"
        alt="edit"
        width={28}
        height={28}
        onClick={() => setIsFilter((prev) => !prev)}
      />
      {isFilter ? (
        <div className={styles.filterContainer}>
          <div className={styles.filter}>
            <Item
              label="기간 설정"
              size="small"
              type="select"
              onClick={() => handleModal('period')}
            />
            <Item
              label="결제 멤버"
              size="small"
              type="select"
              onClick={() => handleModal('member')}
            />
          </div>
          <Item
            label={selected.sort}
            size="small"
            type="select"
            onClick={() => handleModal('sort')}
          />
        </div>
      ) : (
        <div className={styles.default}>
          <Button label="불러오기" size={'small'} />
          <Button
            label="직접 추가"
            size={'small'}
            primary={false}
            onClick={handleRouteManualSharedPaymentPage}
          />
        </div>
      )}

      {/* 멤버 선택 모달 */}
      {isOpen.member && (
        <BottomModal
          isOpen={isOpen.member}
          onClose={() => handleModal('member')}
          title="결제 멤버"
        >
          <ul className={styles.list}>
            {[AllMembers, ...travelMembers!].map((member) => (
              <li key={member.id} onClick={() => handleMemberSelect(member)}>
                {member.name}
                {memberId === member.id && (
                  <Image src={selectIcon} alt="select" width={25} height={25} />
                )}
              </li>
            ))}
          </ul>
        </BottomModal>
      )}

      {/* 기간 선택 모달 */}
      {isOpen.period && (
        <BottomModal
          isOpen={isOpen.period}
          onClose={() => handleModal('period')}
          title="기간 설정"
        >
          <ul className={styles.list}>
            <li onClick={handleSelectAllDate}>
              전체
              {selected.period === '전체' && (
                <Image src={selectIcon} alt="select" width={25} height={25} />
              )}
            </li>
            <li onClick={() => handleDateSelect('start')}>
              시작일
              <span>{startDate.replace(/-/g, '.')}</span>
            </li>
            <li onClick={() => handleDateSelect('end')}>
              종료일
              <span>{endDate.replace(/-/g, '.')}</span>
            </li>
          </ul>
        </BottomModal>
      )}

      {/* 시작일 선택 모달 */}
      {isOpen.start && (
        <DatePickerModal
          isOpen={isOpen.start}
          initialDate={getDateObject(startDate)}
          onSelectDate={setStartDate}
          onClose={() => handleModal('start')}
          title={'시작일'}
        />
      )}

      {/* 종료일 선택 모달 */}
      {isOpen.end && (
        <DatePickerModal
          isOpen={isOpen.end}
          initialDate={getDateObject(endDate)}
          onSelectDate={setEndDate}
          onClose={() => handleModal('end')}
          title={'종료일'}
        />
      )}

      {/* 정렬 선택 모달 */}
      {isOpen.sort && (
        <BottomModal isOpen={isOpen.sort} onClose={handleSort} title="정렬">
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
