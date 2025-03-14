'use client';
import React, { Suspense } from 'react';
import TravelForm from '../../../components/TravelForm';
import { Title } from '@withbee/ui/title';
import { useSearchParams, useRouter } from 'next/navigation';
import { createTravel } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { mutate } from 'swr';

function TravelFormContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();
  const { showToast } = useToast();

  const handleCreateTravel = async (formData: any) => {
    const response = await createTravel(
      formData.travelName,
      formData.isDomesticTravel,
      formData.travelCountries,
      formData.travelStartDate,
      formData.travelEndDate,
    );

    if ('data' in response && response.data?.travelId) {
      mutate((key: string) => key.startsWith('travelList'));
      showToast.success({ message: '여행이 성공적으로 생성되었습니다.' });
      router.push(`/travel/${response.data.travelId}`);
    } else {
      showToast.error({
        message: '여행 생성에 실패했습니다. 다시 시도해주세요.',
      });
      throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
    }
  };

  return (
    <div>
      <Title label="여행 생성" />
      <TravelForm mode="create" onSubmit={handleCreateTravel} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <TravelFormContent />
    </Suspense>
  );
}
