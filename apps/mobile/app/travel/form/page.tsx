'use client';
import React, { Suspense, useState } from 'react';
import TravelForm from '../../../components/TravelForm';
import { Title } from '@withbee/ui/title';
import { useSearchParams } from 'next/navigation';
import { createTravel, editTravel } from '@withbee/apis';
import './page.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  travelName: string;
  isDomesticTravel: boolean;
  travelCountries: string[];
  travelStartDate: string;
  travelEndDate: string;
}

// useSearchParams를 사용하는 컴포넌트를 분리
function TravelFormContent() {
  const [editedTravel, setEditedTravel] = useState<FormData | null>(null);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();

  const handleCreateTravel = async (formData: FormData) => {
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

    if ('data' in response && response.data?.travelId) {
      router.push(`/travel/${response.data.travelId}`);
    } else {
      // 에러 처리 로직
      console.error('Travel creation failed');
    }
  };

  // 편집 api
  const handleEditTravel = async (formData: any) => {
    const {
      travelId,
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    } = formData;

    const response = await editTravel(
      travelId,
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    );

    if ('data' in response && response.data?.travelId) {
      router.push(`/travel/${response.data.travelId}`);
    } else {
      // 에러 처리 로직
      console.error('Travel edit failed');
    }
  };

  const handleTravelSelect = (travel: FormData) => {
    setEditedTravel(travel);
  };

  const travelData =
    mode === 'edit'
      ? {
          travelId: 12,
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
      <TravelForm
        mode={mode as 'create' | 'edit'}
        travelData={travelData}
        onSubmit={mode === 'create' ? handleCreateTravel : handleEditTravel}
      />
    </div>
  );
}

// 메인 컴포넌트
export default function Page() {
  return (
    // 빌드 에러로 인해 수정 - useSearchParams를 사용하는 컴포넌트는 Suspense로 감싸야 함
    <Suspense fallback={<div>Loading...</div>}>
      <TravelFormContent />
    </Suspense>
  );
}
