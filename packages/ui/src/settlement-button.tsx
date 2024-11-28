'use client';

import { TravelHome } from '@withbee/types';
import { AnimatedButton } from './animated-button';
import { useRouter } from 'next/navigation';
import { requestSettlement } from '@withbee/apis';

interface SettlementButtonProps {
  travelInfo: TravelHome;
}

export function SettlementButton({ travelInfo }: SettlementButtonProps) {
  const router = useRouter();

  const getButtonProps = () => {
    if (travelInfo.settlementStatus === 'PENDING') {
      if (travelInfo.captain) {
        return {
          label: '정산 시작하기',
          variant: 'attentionSeek' as const,
          onClick: async () => {
            router.push(`/travel/${travelInfo.id}/settlement`);
            await requestSettlement(travelInfo.id);
          },
        };
      }
      return {
        label: '정산 대기 중',
        disabled: true,
      };
    }
    if (travelInfo.settlementStatus === 'ONGOING') {
      return {
        label: travelInfo.isAgreed ? '정산 현황 확인' : '정산 동의하러 가기',
        onClick: () => {
          router.push(`/travel/${travelInfo.id}/settlement`);
        },
      };
    }
    return {
      label: '정산 내역 확인',
    };
  };

  return <AnimatedButton {...getButtonProps()} />;
}
