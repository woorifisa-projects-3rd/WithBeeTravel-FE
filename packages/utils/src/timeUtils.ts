export const formatTime = (time: {
  amPm: string;
  hour: string;
  minute: string;
}): string => {
  return `${time.amPm} ${time.hour}:${time.minute}`;
};

export const getTimeObject = (
  timeString: string,
): {
  amPm: string | undefined;
  hour: string | undefined;
  minute: string | undefined;
} => {
  const amPmMatch = timeString.match(/(오전|오후)/);
  const amPm = amPmMatch ? amPmMatch[0] : undefined;

  // 시간과 분을 추출
  const timePart = timeString
    .replace(/(오전|오후)/, '')
    .trim()
    .split(':')
    .map(String);
  const hour = timePart ? timePart[0] : undefined;
  const minute = timePart ? timePart[1] : undefined;

  return {
    amPm,
    hour,
    minute,
  };
};
