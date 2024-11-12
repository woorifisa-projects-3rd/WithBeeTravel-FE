type AuthErrorCodes =
  `AUTH-${'001' | '002' | '003' | '004' | '005' | '006' | '007' | '008' | '009'}`;
type PaymentErrorCodes = `PAYMENT-${'001' | '002'}`;
type SettlementErrorCodes =
  `SETTLEMENT-${'001' | '002' | '003' | '004' | '005'}`;
type TravelErrorCodes = `TRAVEL-${'001' | '002' | '003'}`;
type ValidationErrorCodes = `VALIDATION-${'001' | '002' | '003'}`;

type CustomErrorCode =
  | AuthErrorCodes
  | PaymentErrorCodes
  | SettlementErrorCodes
  | TravelErrorCodes
  | ValidationErrorCodes;

export const ERROR_MESSAGES: Record<CustomErrorCode, string> = {
  'AUTH-001': '사용자 인증에 실패하였습니다.',
  'AUTH-002': '관리자 권한이 필요합니다.',
  'AUTH-003': '잘못된 이메일 또는 비밀번호입니다.',
  'AUTH-004': '존재하지 않는 이메일입니다.',
  'AUTH-005': '서비스 이용 약관에 동의하지 않았습니다.',
  'AUTH-006': '이미 가입된 이메일입니다.',
  'AUTH-007': '비밀번호 정책을 충족하지 않았습니다.',
  'AUTH-008': '잘못된 이메일 형식입니다.',
  'AUTH-009': 'PIN 번호가 일치하지 않습니다.',
  'PAYMENT-001': 'SHARED PAYMENT ID에 해당하는 공동 결제 내역이 없습니다.',
  'PAYMENT-002': '해당 공동 결제 내역에 대한 수정 권한이 없습니다.',
  'SETTLEMENT-001': '정산 동의 권한이 없습니다.',
  'SETTLEMENT-002': 'SETTLEMENT ID에 해당하는 정산 요청 정보가 없습니다.',
  'SETTLEMENT-003': '이미 동의한 정산입니다.',
  'SETTLEMENT-004': '정산 취소 권한이 없습니다.',
  'SETTLEMENT-005': '아직 정산이 완료 되지 않습니다.',
  'TRAVEL-001': 'TRAVEL ID에 해당하는 여행 정보가 없습니다.',
  'TRAVEL-002': '여행 정보 접근 권한이 없습니다.',
  'TRAVEL-003': '존재하지 않는 카테고리입니다.',
  'VALIDATION-001': '필수 입력값이 누락되었습니다.',
  'VALIDATION-002': '유효하지 않은 날짜 형식입니다.',
  'VALIDATION-003': '날짜 범위가 잘못되었습니다.',
};
