'use client';

import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import NextImage from 'next/image';
import { Button } from '@withbee/ui/button';
import { HoneyCapsule } from '@withbee/types';
import { useEffect, useState, useRef } from 'react';
import { getHoneyCapsule } from '@withbee/apis';
import { useToast } from '@withbee/hooks/useToast';
import { ERROR_MESSAGES } from '@withbee/exception';
import { HoneyCapsuleBox } from '@withbee/ui/honey-capsule';
import dayjs from 'dayjs';
import { toSvg } from 'html-to-image';
import { HoneyCapsuleSkeleton } from '@withbee/ui/honey-capsule-skeleton';

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

    if (response.data) {
      setHoneyCapsuleData(response.data);
      setIsLoading(false);
    }
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
      const svgDataUrl = await toSvg(downloadComponentRef.current);
      const image = new Image();
      image.src = svgDataUrl;

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2; // 해상도를 2배로 설정
        const padding = 50; // 좌우 여백 (픽셀 단위)
        const contentWidth = image.width * scale;
        const contentHeight = image.height * scale;

        // 캔버스 크기를 여백 포함으로 설정
        canvas.width = contentWidth + padding * 2;
        canvas.height = contentHeight;

        const context = canvas.getContext('2d');
        if (context) {
          // 배경색 추가 (옵션)
          context.fillStyle = '#FFFFFF'; // 흰색 배경
          context.fillRect(0, 0, canvas.width, canvas.height);

          // 이미지 그리기 (중앙 정렬)
          context.scale(scale, scale);
          context.drawImage(image, padding / scale, 0); // 좌우 여백만큼 이동

          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `honeycapsule-${id}.png`;
          link.click();
        }
      };
    } catch (error) {
      showToast.warning({ message: `허니캡슐 다운에 실패했습니다.` });
    }
  };

  return (
    <div>
      <Title label="HONEY CAPSULE" />
      <div className={styles.container}>
        <div className={styles.downloadWrapper}>
          <div className={styles.imageWrap}>
            <NextImage
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
          <Button label="허니캡슐 생성하기" onClick={handleDownload} />
        </div>
        {isLoading ? (
          <HoneyCapsuleSkeleton />
        ) : (
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
        )}
      </div>
    </div>
  );
}
