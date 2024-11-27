//순수한 유효성 검사 로직만
export interface DateValidationResult {
  isValid: boolean;
  error?: 'EXCEED_DURATION' | 'INVALID_ORDER';
}

export const validators = {
  // 날짜 검증 함수는 검증 결과와 에러 타입만 반환
  travelDates: (startDate: string, endDate: string): DateValidationResult => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (end < start) {
      return { isValid: false, error: 'INVALID_ORDER' };
    }

    if (diffDays > 30) {
      return { isValid: false, error: 'EXCEED_DURATION' };
    }

    return { isValid: true };
  },

  travelName: (name: string): boolean => {
    return name.length >= 3 && name.length <= 20;
  },

  paymentDates: (
    startDate: string | undefined,
    endDate: string | undefined,
  ): DateValidationResult => {
    if (startDate === undefined || endDate === undefined)
      return { isValid: true };

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (end < start) {
      return { isValid: false, error: 'INVALID_ORDER' };
    }

    return { isValid: true };
  },
};
