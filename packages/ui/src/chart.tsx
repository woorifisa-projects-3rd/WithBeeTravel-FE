'use client';

import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useState, useEffect } from 'react';
import '@withbee/styles';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface ExpenseData {
  category: string;
  amount: number;
}

interface ExpenseChartProps {
  expenses?: ExpenseData[];
  ratio?: number;
}

export const BarChart = ({ expenses, ratio }: ExpenseChartProps) => {
  const [blueColor3, setBlueColor3] = useState('');
  const [blueColor9, setBlueColor9] = useState('');
  const [grayColor900, setGrayColor900] = useState('');

  // 가장 amount가 큰 카테고리의 인덱스
  const highlightIndex = expenses?.reduce(
    (acc, cur, index) => (cur.amount > expenses[acc]!.amount ? index : acc),
    0,
  );

  const options = {
    aspectRatio: ratio || 1.5,
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
        backgroundColor: currentExpenses.map((_, index) =>
          index === highlightIndex ? blueColor9 : blueColor3,
        ),
        hoverBackgroundColor: currentExpenses.map((_, index) =>
          index === highlightIndex ? blueColor9 : blueColor3,
        ),
        hoverBorderColor: currentExpenses.map((_, index) =>
          index === highlightIndex ? blueColor9 : blueColor3,
        ),
      },
    ],
  };

  // CSS 변수 값 가져오기
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setBlueColor3(rootStyles.getPropertyValue('--color-blue-3').trim());
    setBlueColor9(rootStyles.getPropertyValue('--color-blue-9').trim());
    setGrayColor900(rootStyles.getPropertyValue('--color-gray-900').trim());
  }, []);

  return <Bar data={data} options={options} />;
};

export const PieChart = ({ expenses, ratio }: ExpenseChartProps) => {
  const [blueColors, setBlueColors] = useState<string[]>([]);
  const [grayColor900, setGrayColor900] = useState('');

  const normalizeExpenses = (
    rawExpenses: ExpenseData[] = [],
  ): ExpenseData[] => {
    return rawExpenses.filter((expense) => expense.amount > 0);
  };

  const currentExpenses = normalizeExpenses(expenses!);

  const options = {
    aspectRatio: ratio || 1.5,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: grayColor900,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const data = {
    labels: currentExpenses.map((expense) => expense.category),
    datasets: [
      {
        data: currentExpenses.map((expense) => expense.amount),
        backgroundColor: blueColors,
        borderWidth: 0,
      },
    ],
  };

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setGrayColor900(rootStyles.getPropertyValue('--color-gray-900').trim());

    // Get multiple blue colors for the pie chart
    const colors = Array.from({ length: 9 }, (_, i) =>
      rootStyles.getPropertyValue(`--color-blue-${i + 1}`).trim(),
    );
    setBlueColors(colors);
  }, []);

  return <Pie data={data} options={options} />;
};
