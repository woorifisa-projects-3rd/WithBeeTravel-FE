import dayjs from 'dayjs';

// utils/date.ts
export const formatDate = (date: {
  year: number;
  month: number;
  day: number;
}): string => {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
};

// 현재 선택된 날짜를 DatePickerModal의 initialDate 형식으로 변환하는 함수
export const getDateObject = (dateString: string) => {
  const date = new Date(dateString);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

export function formatDateToKorean(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace('.', '년 ')
    .replace('.', '월 ')
    .replace('.', '일');
}

export const formatDateWithSlash = (date: string) =>
  dayjs(date).format('YYYY/MM/DD');

export default formatDateToKorean;
