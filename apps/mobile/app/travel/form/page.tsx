'use client'
import React, { useState } from 'react';
import TravelForm from '../../../components/TravelForm';
import { Title } from "@withbee/ui/title";

export default function TravelHome() {
  const [editedTravel, setEditedTravel] = useState<any | null>(null); // 편집할 여행 데이터 (기본값은 null)

  const handleTravelSelect = (travel: any) => {
    setEditedTravel(travel); // 여행 선택 시 데이터 세팅
  };

  return (
    <div>
      <Title label={editedTravel ? "여행 편집하기" : "여행 생성하기"} />
      {/* 여행 생성/편집 폼 렌더링 */}
      <TravelForm mode={editedTravel ? 'edit' : 'create'} travelData={editedTravel} />
    </div>
  );
}
