'use client';

import styles from './page.module.css';
import Image from 'next/image';
import { Button } from '@withbee/ui/button';
import { HoneyCapsule } from '@withbee/types';
import { useEffect, useState, useRef } from 'react';
import { getHoneyCapsule } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { HoneyCapsuleBox } from '@withbee/ui/honey-capsule';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';

interface HoneyCapsuleProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: HoneyCapsuleProps) {
  const { id } = params;
  const { showToast } = useToast();
  const [honeyCapsuleData, setHoneyCapsuleData] = useState<HoneyCapsule[]>();
  const downloadComponentRef = useRef<HTMLDivElement>(null);

  const handleGetHoneyCapsule = async () => {
    const response = await getHoneyCapsule(id);

    if ('code' in response) {
      showToast.warning({
        message:
          ERROR_MESSAGES[response.code as keyof typeof ERROR_MESSAGES] ||
          'Unknown Error',
      });

      throw new Error(response.code);
    }

    if (response.data) setHoneyCapsuleData(response.data);
  };

  useEffect(() => {
    handleGetHoneyCapsule();
  }, []);

  // 날짜별로 허니캡슐을 그룹화하는 함수
  const groupPaymentsByDate = (capsules: HoneyCapsule[]) => {
    return capsules.reduce((acc: Record<string, HoneyCapsule[]>, capsule) => {
      const date = dayjs(capsule.paymentDate).format('YYYY년 MM월 DD일');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(capsule);
      return acc;
    }, {});
  };

  const handleDownload = async () => {
    if (!downloadComponentRef.current) return;

    try {
      // DOM 요소를 캔버스로 렌더링
      const canvas = await html2canvas(downloadComponentRef.current);

      // 캔버스를 이미지로 변환
      const dataURL = canvas.toDataURL('image/png');

      // 이미지 다운로드
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `honeycapsule-${id}.png`;
      link.click();
    } catch (error) {
      showToast.warning({ message: `Error generating PNG: ${error}` });
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.downloadWrapper}>
          <div className={styles.imageWrap}>
            <Image
              src="/imgs/travelselect/withbee_friends.png"
              alt="위비프렌즈친구들"
              className={styles.withbeeFriendsImg}
              width={500}
              height={500}
            />
          </div>
          <span className={styles.comment}>
            여행 기록을 간직해보세요!
            <br />
            결제 내역에 남긴 기록을 모아 이미지로 생성해드립니다.
          </span>
          <Button
            label="허니캡슐 생성하기"
            onClick={handleDownload}
            size="xlarge"
          />
        </div>
        <div className={styles.pcRecord}>
          <div ref={downloadComponentRef} className={styles.record}>
            {honeyCapsuleData &&
              Object.entries(groupPaymentsByDate(honeyCapsuleData)).map(
                ([date, capsules]) => (
                  <div key={date} className={styles.recordWrapper}>
                    <span className={styles.date}>{date}</span>
                    {capsules.map((capsule) => (
                      <HoneyCapsuleBox
                        key={capsule.sharedPaymentId}
                        data={capsule}
                      />
                    ))}
                  </div>
                ),
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
