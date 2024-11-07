'use client'; // Chart.js 라이브러리를 사용하기 위해 client로 설정

import { Button } from '@withbee/ui/button';
import { Tag } from '@withbee/ui/tag';
import styles from './page.module.css';
import { Title } from '@withbee/ui/title';
import Image from 'next/image';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

export default function Page() {
  // TODO: Chart, Friends 컴포넌트화 필요
  // React 상태로 CSS 변수 값을 저장
  const [blueColor3, setBlueColor3] = useState('');
  const [blueColor9, setBlueColor9] = useState('');
  const [grayColor900, setGrayColor900] = useState('');

  useEffect(() => {
    // CSS 변수 값 가져오기
    const rootStyles = getComputedStyle(document.documentElement);
    setBlueColor3(rootStyles.getPropertyValue('--color-blue-3').trim());
    setBlueColor9(rootStyles.getPropertyValue('--color-blue-9').trim());
    setGrayColor900(rootStyles.getPropertyValue('--color-gray-900').trim());
  }, []);

  const options = {
    aspectRatio: 1.5,
    layout: {
      padding: {
        top: 28,
        bottom: 30,
      },
    },
    scales: {
      x: {
        position: 'top' as const,
        ticks: {
          color: grayColor900, // 가져온 CSS 변수로 설정
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      bar: {
        borderRadius: [8, 8, 8, 8],
      },
    },
  };

  const data = {
    labels: ['교통', '식비', '숙박', '항공', '기타'],
    datasets: [
      {
        base: 0,
        data: [10, 20, 6, 12, 10],
        backgroundColor: [blueColor3, blueColor9, blueColor3, blueColor3, blueColor3],
        hoverBackgroundColor: [blueColor3, blueColor9, blueColor3, blueColor3, blueColor3],
        hoverBorderColor: [blueColor3, blueColor9, blueColor3, blueColor3, blueColor3],
      },
    ],
  };

  return (
    <div className={styles.container}>
      <Title label="여행 홈" />
      <div className={styles.subContainer}>
        <div className={styles.subtitleContainer}>
          <p className={styles.date}>2022/12/25 ~ 2023/01/01</p>
          <div className={styles.subtitleWrapper}>
            <h2 className={styles.subtitle}>팀 호초루의 여행</h2>
            <Image src="/edit.png" alt="edit" width={19} height={17.94} />
          </div>
        </div>
        <div className={styles.imgWrapper}>{/* <Image /> */}</div>
        <div className={styles.tagWrapper}>
          <Tag label="오스트리아" />
          <Tag label="포르투갈" />
          <Tag label="스위스" />
        </div>
        <div className={styles.friendsWrapper}>
          <Image src="/friends/1.png" alt="map" width={40} height={40} className={styles.friends} />
          <Image src="/friends/2.png" alt="map" width={40} height={40} className={styles.friends} />
          <Image src="/friends/3.png" alt="map" width={40} height={40} className={styles.friends} />
          <Image src="/friends/4.png" alt="map" width={40} height={40} className={styles.friends} />
          <Image src="/friends/5.png" alt="map" width={40} height={40} className={styles.friends} />
        </div>
      </div>
      <div className={styles.btnWrapper}>
        <Button label="그룹 결제 내역" />
        <Button label="친구 초대" primary={false} />
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}
