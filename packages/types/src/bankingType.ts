export interface AccountInfo {
  accountId: number;
  accountNumber: string;
  product: string;
  balance: number;
}

export interface PinNumberResponse {
  failedPinCount: number;
  pinLocked: boolean;
}

export interface ProductOption {
  label: string;
  value: string;
}

export interface AccountHistory {
  date: string;
  rcvAm: number;
  payAm: number;
  balance: number;
  rqspeNm: string;
}

export interface TargetName {
  name: string;
}

export interface HistoryRequest {
  payAm: number;
  rqspeNm: string;
  isWibeeCard: boolean;
}

export interface WibeeCardResponse {
  connectedWibeeCard: boolean;
}

export interface CreateAccount {
  product: string;
}

export interface PinNumberRequest {
  pinNumber: string;
}

export interface PinNumberResponse {
  failedPinCount: number;
  pinLocked: boolean;
}

export interface DepositRequest {
  amount: number;
  rqspeNm: string;
}

export interface AccountNumberRequest {
  accountNumber: string;
}

export interface connectedAccountType {
  accountId: number;
  connectedAccountId: String;
  wibeeCardAccountId: string;
  isWibeeCard: boolean;
}

export interface accountType {
  accountNumber: String;
  product: string;
}
