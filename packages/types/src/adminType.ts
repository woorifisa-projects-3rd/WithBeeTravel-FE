export interface LoginLog {
  logId: number;
  createdAt: string;
  description: string;
  ipAddress: string;
  logType: string;
  userId: number;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}

export interface LoginLogResponse {
  content: LoginLog[];
  pageable: Pageable;
}

export interface DashboardResponse {
  loginCount: number;
  totalUser: number;
  totalTravel: number;
}

export interface User {
  userId: number;
  userEmail: string;
  userName: string;
  userPinLocked: boolean;
  userRoleType: string;
  createAt: string;
  recentLogin: string;
}

export interface UserResponse {
  userId: number;
  userEmail: string;
  userName: string;
  userPinLocked: boolean;
  userRoleType: string;
  createAt: string | number | Date;
  recentLogin: string | number | Date;
  content: User[];
  pageable: Pageable;
}
