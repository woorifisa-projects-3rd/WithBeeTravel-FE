type AuthErrorCodes =
  `AUTH-${'001' | '002' | '003' | '004' | '005' | '006' | '007' | '008' | '009' | '010' | '011' | '012' | '013' | '014' | '015' | '016' | '017' | '018'}`;
type PaymentErrorCodes = `PAYMENT-${'001' | '002' | '003' | '004' | '005'}`;
type BankingErrorCodes =
  `BANKING-${'001' | '002' | '003' | '004' | '005' | '006' | '007' | '008' | '009' | '010'}`;
type SettlementErrorCodes =
  `SETTLEMENT-${'002' | '003' | '005' | '006' | '007' | '008' | '009' | '010' | '011' | '012'}`;
type TravelErrorCodes =
  `TRAVEL-${'001' | '002' | '003' | '004' | '005' | '006' | '007' | '008'}`;
type ValidationErrorCodes =
  `VALIDATION-${'001' | '002' | '003' | '004' | '005'}`;

type CustomErrorCode =
  | 'COMMON'
  | 'FETCH-FAILED'
  | AuthErrorCodes
  | PaymentErrorCodes
  | BankingErrorCodes
  | SettlementErrorCodes
  | TravelErrorCodes
  | ValidationErrorCodes;

export const ERROR_MESSAGES: Record<CustomErrorCode, string> = {
  COMMON: '알 수 없는 오류가 발생했습니다.',
  'FETCH-FAILED': '데이터를 불러오는 중 오류가 발생했습니다.',
  'AUTH-001': '사용자 인증에 실패하였습니다.',
  'AUTH-002': '관리자 권한이 필요합니다.',
  'AUTH-003': '잘못된 이메일 또는 비밀번호입니다.',
  'AUTH-004': '존재하지 않는 이메일입니다.',
  'AUTH-005': '서비스 이용 약관에 동의하지 않았습니다.',
  'AUTH-006': '이미 가입된 이메일입니다.',
  'AUTH-007': '비밀번호 정책을 충족하지 않았습니다.',
  'AUTH-008': '잘못된 이메일 형식입니다.',
  'AUTH-009': 'PIN 번호가 일치하지 않습니다.',
  'AUTH-010': '잘못된 비밀번호입니다.',
  'AUTH-011': '잘못된 JWT 토큰입니다.',
  'AUTH-012': '만료된 JWT 토큰입니다.',
  'AUTH-013': '지원되지 않는 JWT 토큰입니다.',
  'AUTH-014': '빈 JWT 토큰입니다.',
  'AUTH-015': '리프레시 토큰이 없습니다.',
  'AUTH-016': '잘못된 리프레시 토큰입니다.',
  'AUTH-017': '사용자를 찾을 수 없습니다.',
  'AUTH-018': '유효성 검사에 실패하였습니다.',
  'BANKING-001': '계좌 잔액이 부족합니다.',
  'BANKING-002': '존재하지 않는 계좌번호입니다.',
  'BANKING-003': '하루 이체 한도를 초과하였습니다.',
  'BANKING-004': '위비 카드를 발급받지 않은 회원입니다.',
  'BANKING-005': '요청하신 거래 내역을 찾을 수 없습니다.',
  'BANKING-006': '해당 거래 내역의 접근 권한이 부족합니다.',
  'BANKING-007': '이미 추가된 결제 내역입니다.',
  'BANKING-008': '관리자 계좌의 잔액이 부족합니다.',
  'BANKING-009': '잘못된 핀 번호 입니다.',
  'BANKING-010': '계정이 잠겼습니다. PIN 재설정이 필요합니다.',
  'PAYMENT-001': '해당하는 공동 결제 내역이 존재하지 않습니다.',
  'PAYMENT-002': '해당 공동 결제 내역에 대한 수정 권한이 없습니다.',
  'PAYMENT-003': '해당 공동 결제 내역에 대한 정보 접근 권한이 없습니다.',
  'PAYMENT-004': '여행 멤버가 아닌 유저가 포함되어 있습니다.',
  'PAYMENT-005': '정렬 기준은 최신순 또는 금액순만 가능합니다.',
  'SETTLEMENT-002': 'SETTLEMENT ID에 해당하는 정산 요청 정보가 없습니다.',
  'SETTLEMENT-003': '이미 동의한 정산입니다.',
  'SETTLEMENT-005': '아직 정산이 완료 되지 않습니다.',
  'SETTLEMENT-006': '정산 관리 권한이 없습니다.',
  'SETTLEMENT-007': '해당하는 여행 멤버 정산 내역이 없습니다.',
  'SETTLEMENT-008': '진행 중인 정산 요청이 아닙니다.',
  'SETTLEMENT-009': '이미 모든 정산원이 동의한 정산 요청입니다.',
  'SETTLEMENT-010': '여행멤버의 잔액 부족으로 인해 정산 처리가 불가합니다.',
  'SETTLEMENT-011': '진행 중인 정산 요청이 이미 존재합니다.',
  'SETTLEMENT-012': '정산 정리 요청 스케줄링 중 오류가 발생했습니다.',
  'TRAVEL-001': 'TRAVEL ID에 해당하는 여행 정보가 없습니다.',
  'TRAVEL-002': '여행 정보 접근 권한이 없습니다.',
  'TRAVEL-003': '존재하지 않는 카테고리입니다.',
  'TRAVEL-004': '여행 생성 권한이 없습니다.',
  'TRAVEL-005': '존재하지 않는 초대 코드입니다.',
  'TRAVEL-006': '여행 멤버 정원이 초과되었습니다.',
  'TRAVEL-007': '여행장 정보가 없습니다.',
  'TRAVEL-008': '이미 가입된 여행입니다.',
  'VALIDATION-001': '필수 입력값이 누락되었습니다.',
  'VALIDATION-002': '유효하지 않은 날짜 형식입니다.',
  'VALIDATION-003': '날짜 범위가 잘못되었습니다.',
  'VALIDATION-004': '이미지 처리 중 오류가 발생했습니다.',
  'VALIDATION-005': '유효하지 않은 통화 단위입니다.',
};
