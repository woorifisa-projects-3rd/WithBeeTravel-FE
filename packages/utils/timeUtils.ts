export const formatTime = (time: { hour: number; minute: number }): string => {
  return `${time.hour}:${time.minute}`;
};
