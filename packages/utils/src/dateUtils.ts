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
