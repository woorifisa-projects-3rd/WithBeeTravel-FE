'use client';

import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useState, useEffect } from 'react';
import '@withbee/styles';
import { allCategories } from '@withbee/utils';

// Register chart.js components
ChartJS.register(...registerables);

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
    (acc, cur, index) =>
      cur.amount > (expenses[acc]?.amount ?? 0) ? index : acc,
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
        position: 'bottom' as const,
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
      datalabels: {
        display: true,
        formatter: (value: number) => `${value}%`, // 퍼센트 표시
        color: grayColor900,
        font: {
          size: 12,
        },
        align: 'end', // 막대 위에 레이블 위치
        anchor: 'end', // 레이블을 막대의 끝에 고정
        offset: 0, // 막대와의 간격 조정
      },
    },
    elements: {
      bar: {
        borderRadius: [8, 8, 8, 8],
      },
    },
  };

  // expenses 데이터 정규화 함수
  const normalizeExpenses = (
    rawExpenses: ExpenseData[] = [],
  ): ExpenseData[] => {
    if (rawExpenses.length >= 4) return rawExpenses;

    const filteredCategories = allCategories.filter((c) => c !== '전체');

    // 현재 expenses에 없는 카테고리들 추출
    const usedCategories = new Set(rawExpenses.map((e) => e.category));
    const availableCategories = filteredCategories.filter(
      (c) => !usedCategories.has(c),
    );

    // 필요한 만큼의 카테고리를 순서대로 가져와서 amount를 0으로 설정
    const additionalExpenses: ExpenseData[] = availableCategories
      .slice(0, 4 - rawExpenses.length)
      .map((category) => ({
        category,
        amount: 0.5,
      }));

    return [...rawExpenses, ...additionalExpenses];
  };

  const currentExpenses = normalizeExpenses(expenses);

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

  useEffect(() => {
    ChartJS.register(...registerables);
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

  const currentExpenses = normalizeExpenses(expenses);

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

  useEffect(() => {
    ChartJS.register(...registerables);
  }, []);

  return <Pie data={data} options={options} />;
};
