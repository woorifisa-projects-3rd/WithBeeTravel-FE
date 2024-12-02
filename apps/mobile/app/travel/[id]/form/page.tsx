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
import { TravelFormData } from '@withbee/types';

function TravelFormContent() {
  const [editedTravel, setEditedTravel] = useState<TravelFormData | null>(null);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();

  // 편집 api
  const handleEditTravel = async (formData: TravelFormData) => {
    const {
      travelId,
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    } = formData;

    const response = await editTravel(
      Number(params.id),
      travelName,
      isDomesticTravel,
      travelCountries,
      travelStartDate,
      travelEndDate,
    );

    if (response) {
      showToast.success({ message: '여행이 편집이 완료되었습니다.' });
      router.push(`/travel/${params.id}`);
    } else {
      showToast.error({
        message: '여행 편집에 실패했습니다. 다시 시도해주세요.',
      });
      throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
    }
  };

  const handleTravelSelect = (travel: TravelFormData) => {
    setEditedTravel(travel);
  };

  // 여행 편집 get

  const { data: travelData, isLoading } = useSWR(
    mode === 'edit' ? `${params.id}` : null,
    () => getTravelHome(Number(params.id)),
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={`${styles.loadingDot}`}
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeOut', // 부드러운 자연스러움
          }}
        ></motion.div>
        <motion.div
          className={`${styles.loadingDot}`}
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.3, // 딜레이를 주어 각 점의 동기화를 다르게 함
          }}
        ></motion.div>
        <motion.div
          className={`${styles.loadingDot}`}
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.6, // 딜레이를 주어 각 점의 동기화를 다르게 함
          }}
        ></motion.div>
      </div>
    );
  }

  const formattedTravelData =
    travelData && 'data' in travelData && travelData.data
      ? {
          travelId: travelData.data.travelId,
          travelName: travelData.data.travelName,
          isDomesticTravel: travelData.data.isDomesticTravel,
          travelCountries: travelData.data.countries || [],
          travelStartDate: travelData.data.travelStartDate,
          travelEndDate: travelData.data.travelEndDate,
        }
      : undefined;

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
