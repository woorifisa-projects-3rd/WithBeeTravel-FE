export interface JoinRequest {
  email: string;
  password: string;
  name: string;
  pinNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MyPageInfoResponse {
  profileImage: number;
  username: string;
  accountProduct: string | null;
  accountNumber: string | null;
}
