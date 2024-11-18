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

export default formatDateToKorean;
