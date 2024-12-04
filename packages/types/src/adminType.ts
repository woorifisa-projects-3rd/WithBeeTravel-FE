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
