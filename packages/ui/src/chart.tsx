'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';
import "@withbee/styles"

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseData {
  category: string;
  amount: number;
}

interface ExpenseChartProps {
  expenses?: ExpenseData[];
  highlightIndex?: number; // 강조할 막대의 인덱스
}

export const BarChart = ({ expenses, highlightIndex = 1 }: ExpenseChartProps) => {
  const [blueColor3, setBlueColor3] = useState('');
  const [blueColor9, setBlueColor9] = useState('');
  const [grayColor900, setGrayColor900] = useState('');

  // CSS 변수 값 가져오기
  useEffect(() => {
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
          color: grayColor900,
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

  // 기본 데이터 (API 응답이 없을 경우를 대비)
  const defaultExpenses: ExpenseData[] = [
    { category: '교통', amount: 10 },
    { category: '식비', amount: 20 },
    { category: '숙박', amount: 6 },
    { category: '항공', amount: 12 },
    { category: '기타', amount: 10 },
  ];

  const currentExpenses = expenses || defaultExpenses;

  const data = {
    labels: currentExpenses.map((expense) => expense.category),
    datasets: [
      {
        base: 0,
        data: currentExpenses.map((expense) => expense.amount),
        backgroundColor: currentExpenses.map((_, index) => (index === highlightIndex ? blueColor9 : blueColor3)),
        hoverBackgroundColor: currentExpenses.map((_, index) => (index === highlightIndex ? blueColor9 : blueColor3)),
        hoverBorderColor: currentExpenses.map((_, index) => (index === highlightIndex ? blueColor9 : blueColor3)),
      },
    ],
  };

  return <Bar data={data} options={options} />;
};