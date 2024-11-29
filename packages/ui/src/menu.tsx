'use client';

import Image from 'next/image';
import { Button } from './button';
import styles from './menu.module.css';
import { Item } from './item';
import { useState } from 'react';
import { BottomModal } from './modal';
import selectIcon from './assets/select.png';
import DatePickerModal from './date-picker-modal';
import { formatDate, getDateObject } from '@withbee/utils';
import { DateObject, TravelHome, TravelMember } from '@withbee/types';
import { usePaymentParams } from '@withbee/hooks/usePaymentParams';
import { useRouter } from 'next/navigation';

interface MenuProps {
  travelInfo: TravelHome;
  className?: string;
  travelId: string;
}

const AllMembers: TravelMember = {
  id: 0,
  name: '전체',
  profileImage: 0,
};

export const Menu = ({ travelInfo, className, ...props }: MenuProps) => {
  const { params, updateParam } = usePaymentParams();
  const { startDate, endDate, memberId } = params;
  const [isOpen, setIsOpen] = useState({
    period: false,
    member: false,
    sort: false,
    start: false,
    end: false,
  });
  const {
    id: travelId,
    travelStartDate,
    travelEndDate,
    travelMembers,
  } = travelInfo;

  const [isFilter, setIsFilter] = useState(false); // 필터 메뉴인지 여부

  const dateRange = {
    start: startDate || travelStartDate,
    end: endDate || travelEndDate,
  };

  // 모달 열기/닫기 핸들러
  const handleModal = (key: keyof typeof isOpen) => {
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 정렬 변경 핸들러
  const handleSort = (sort: '최신순' | '금액순') => {
    updateParam('sortBy', sort === '최신순' ? 'latest' : 'amount');
    handleModal('sort');
  };

  // 전체 기간 선택 핸들러
  const handleSelectAllDate = () => {
    updateParam('startDate', travelStartDate);
    updateParam('endDate', travelEndDate);
    handleModal('period');
  };

  // 시작일/종료일 선택 핸들러
  const handleDateSelect = (type: 'start' | 'end') => {
    handleModal(type);
  };

  // DatePickerModal의 onSelectDate 처리
  const handleDateChange = (type: 'start' | 'end', date: DateObject) => {
    updateParam(type === 'start' ? 'startDate' : 'endDate', formatDate(date));
    // handleDateSelect(type);
    // handleModal('period');
  };

  // 멤버 선택 핸들러
  const handleMemberSelect = (member: TravelMember) => {
    updateParam('memberId', member.id);
    handleModal('member');
  };

  const selected = {
    sort: params.sortBy === 'latest' ? '최신순' : '금액순',
    period: params.startDate && params.endDate ? '기간' : '전체',
    member:
      travelMembers?.find((m) => m.id === params.memberId)?.name || '전체',
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
              <span>{dateRange.start?.replace(/-/g, '.')}</span>
            </li>
            <li onClick={() => handleDateSelect('end')}>
              종료일
              <span>{dateRange.end?.replace(/-/g, '.')}</span>
            </li>
          </ul>
        </BottomModal>
      )}

      {/* 시작일 선택 모달 */}
      {isOpen.start && (
        <DatePickerModal
          isOpen={isOpen.start}
          initialDate={getDateObject(dateRange.start)}
          onSelectDate={(date) => handleDateChange('start', date)}
          onClose={() => handleModal('start')}
          title={'시작일'}
        />
      )}

      {/* 종료일 선택 모달 */}
      {isOpen.end && (
        <DatePickerModal
          isOpen={isOpen.end}
          initialDate={getDateObject(dateRange.end)}
          onSelectDate={(date) => handleDateChange('end', date)}
          onClose={() => handleModal('end')}
          title={'종료일'}
        />
      )}

      {/* 정렬 선택 모달 */}
      {isOpen.sort && (
        <BottomModal
          isOpen={isOpen.sort}
          onClose={() => handleModal('sort')}
          title="정렬"
        >
          <ul className={styles.list}>
            {['최신순', '금액순'].map((sort) => (
              <li
                key={sort}
                onClick={() => handleSort(sort as '최신순' | '금액순')}
              >
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
