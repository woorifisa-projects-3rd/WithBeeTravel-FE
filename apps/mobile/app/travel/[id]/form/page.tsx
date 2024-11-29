'use client';
import React, { Suspense, useState } from 'react';
import TravelForm from '../../../../components/TravelForm';
import { Title } from '@withbee/ui/title';
import { useSearchParams } from 'next/navigation';
import { editTravel } from '@withbee/apis';
import './page.module.css';
import { useRouter, useParams } from 'next/navigation';
import { getTravelHome } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import useSWR from 'swr';

interface FormData {
  travelName: string;
  isDomesticTravel: boolean;
  travelCountries: string[];
  travelStartDate: string;
  travelEndDate: string;
}

function TravelFormContent() {
  const [editedTravel, setEditedTravel] = useState<FormData | null>(null);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();

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
      showToast.success({ message: '여행이 성공적으로 생성되었습니다.' });
      router.push(`/travel/${response.data.travelId}`);
    } else {
      showToast.error({
        message: '여행 생성에 실패했습니다. 다시 시도해주세요.',
      });
      throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
    }
  };

  const handleTravelSelect = (travel: FormData) => {
    setEditedTravel(travel);
  };

  const { showToast } = useToast();

  // 여행 데이터 가져오기
  const params = useParams();

  const { data: travelData, isLoading } = useSWR(
    mode === 'edit' ? `${params.id}` : null,
    () => getTravelHome(Number(params.id)),
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  const formattedTravelData =
    travelData && 'data' in travelData && travelData.data
      ? {
          travelName: travelData.data.travelName,
          isDomesticTravel: travelData.data.isDomesticTravel,
          travelCountries: travelData.data.countries || [],
          travelStartDate: travelData.data.travelStartDate,
          travelEndDate: travelData.data.travelEndDate,
        }
      : undefined;

  console.log(formattedTravelData);

  return (
    <div>
      <Title label="여행 편집" />
      <TravelForm
        mode={mode as 'create' | 'edit'}
        travelData={formattedTravelData}
        onSubmit={handleEditTravel}
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
