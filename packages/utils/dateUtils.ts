// Date를 year-month-day 형식으로 변환
export const formatDate = (date: {
  year: number;
  month: number;
  day: number;
}): string => {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
};

// Date 객체를 { year, month, day } 형식으로 변환
export const dateObject = (dateString: string) => {
  const date = new Date(dateString);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};
