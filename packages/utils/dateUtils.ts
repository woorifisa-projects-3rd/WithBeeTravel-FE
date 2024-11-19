// utils/date.ts
export const formatDate = (date: {
  year: number;
  month: number;
  day: number;
}): string => {
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
};
