'use client';
import React, { Suspense, useState } from 'react';
import TravelForm from '../../../components/TravelForm';
import { Title } from '@withbee/ui/title';
import { useSearchParams } from 'next/navigation';
import { createTravel, editTravel } from '@withbee/apis';
import './page.module.css';
import { useRouter, useParams } from 'next/navigation';
import { ERROR_MESSAGES } from '@withbee/exception';
import { getTravelHome } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import useSWR from 'swr';

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

    console.log(response);
    const { showToast } = useToast();
    if ('data' in response && response.data?.travelId) {
      showToast.success({
        message: '여행이 성공적으로 생성되었습니다.',
      });
      router.push(`/travel/${response.data.travelId}`);
    } else {
      showToast.error({
        message: '여행 생성에 실패했습니다. 다시 시도해주세요.',
      });
      throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
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

    if (response && 'travelId' in response) {
      router.push(`/travel/${response.travelId}`);
    } else {
      // 에러 처리 로직
      console.error('Travel edit failed');
    }
  };

  const handleTravelSelect = (travel: FormData) => {
    setEditedTravel(travel);
  };

  // 여행 편집 모드일 때 기존 데이터를 폼에 채워넣기
  const params = useParams();
  const travelId = Number(params.id);
  const { data: travelData, error } = useSWR('travelHome', () =>
    getTravelHome(travelId),
  );

  console.log(travelData);

  return (
    <div>
      <Title label={mode == 'edit' ? '여행 편집' : '여행 생성'} />
      <TravelForm
        mode={mode as 'create' | 'edit'}
        // travelData={travelData}
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
