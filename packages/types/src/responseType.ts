export interface SuccessResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export interface ErrorResponse {
  status: string;
  name: string;
  code: string;
  message: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // 현재 페이지
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
