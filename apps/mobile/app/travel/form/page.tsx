'use client';
import React, { useState } from 'react';
import TravelForm from '../../../components/TravelForm';
import { Title } from '@withbee/ui/title';
import { useSearchParams } from 'next/navigation';
import { createTravel } from '@withbee/apis';
import './page.module.css';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [editedTravel, setEditedTravel] = useState<any | null>(null); // 편집할 여행 데이터 (기본값은 null)

  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();

  // api연결
  const handleCreateTravel = async (formData: any) => {
    const {
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    } = formData;

    const response = await createTravel(
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    );

    if (response && response.travelId) {
      router.push(`/travel/${response.travelId}`);
    }
  };

  // 여행 선택 시 데이터 세팅
  const handleTravelSelect = (travel: any) => {
    setEditedTravel(travel); // 여행 선택 시 데이터 세팅
  };

  const travelData =
    mode === 'edit'
      ? {
          travelName: '기존 여행 이름',
          isDomesticTravel: true,
          travelCountries: ['프랑스', '이탈리아'],
          travelStartDate: '2024-10-28',
          travelEndDate: '2024-11-02',
        }
      : undefined;

  return (
    <div>
      <Title label={mode == 'edit' ? '여행 편집' : '여행 생성'} />
      {/* 여행 생성/편집 폼 렌더링 */}
      <TravelForm
        mode={mode as 'create' | 'edit'}
        travelData={travelData}
        onSubmit={handleCreateTravel}
      />
    </div>
  );
}
