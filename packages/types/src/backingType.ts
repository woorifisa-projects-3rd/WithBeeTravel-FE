export interface accountType {
  accountNumber: String;
  product: string;
}

export interface connectedAccountType {
  accountId: number;
  connectedAccountId: String;
  wibeeCardAccountId: string;
  isWibeeCard: boolean;
}
