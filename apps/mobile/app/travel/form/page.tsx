'use client';
import React, { useState, useEffect } from 'react';
import TravelForm from '../../../components/TravelForm';
import { Title } from '@withbee/ui/title';
import { useSearchParams } from 'next/navigation';
import './page.module.css';

export default function Page() {
  const [editedTravel, setEditedTravel] = useState<any | null>(null); // 편집할 여행 데이터 (기본값은 null)

  const searchParams = useSearchParams(); // 쿼리 파라미터 가져오기
  const mode = searchParams.get('mode');

  // 여행 선택 시 데이터 세팅
  const handleTravelSelect = (travel: any) => {
    setEditedTravel(travel); // 여행 선택 시 데이터 세팅
  };

  const travelData =
    mode === 'edit'
      ? {
          title: '기존 여행 이름',
          location: 'overseas',
          countries: ['프랑스', '이탈리아'],
          startDate: '2024-10-28',
          endDate: '2024-11-02',
        }
      : undefined;

  return (
    <div>
      <Title label={mode == 'edit' ? '여행 편집' : '여행 생성'} />
      {/* 여행 생성/편집 폼 렌더링 */}
      <TravelForm mode={mode as 'create' | 'edit'} travelData={travelData} />
    </div>
  );
}
