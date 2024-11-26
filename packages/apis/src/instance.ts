import { auth } from '@withbee/auth-config';
import { ErrorResponse, SuccessResponse } from '@withbee/types';
import { ERROR_MESSAGES } from '@withbee/exception';

interface RequestOptions extends RequestInit {
  isMultipart?: boolean;
  requireAuth?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetchInstance = async <T = undefined>(
  url: string,
  options: RequestOptions = {},
): Promise<SuccessResponse<T> | ErrorResponse> => {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // auth 체크 및 토큰 추가
  if (options.requireAuth !== false) {
    // 기본적으로 인증이 필요하도록
    const session = await auth();
    const accessToken = session?.user!.accessToken;

    if (!accessToken) {
      throw new Error('Authentication required');
    }

    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const result = (await response.json()) as
      | SuccessResponse<T>
      | ErrorResponse;

    if (!response.ok) {
      const errorResult = result as ErrorResponse;
      console.error(ERROR_MESSAGES['FETCH-FAILED'], errorResult);
      return errorResult;
    }

    return result as SuccessResponse<T>;
  } catch (error) {
    console.error(ERROR_MESSAGES['FETCH-FAILED'], error);
    throw new Error(ERROR_MESSAGES['FETCH-FAILED']);
  }
};

export const instance = {
  get: async <T>(
    url: string,
    options: Omit<RequestOptions, 'body' | 'method'> = {},
  ) => {
    return fetchInstance<T>(url, { method: 'GET', ...options });
  },

  post: async <T>(
    url: string,
    options: Omit<RequestOptions, 'method'> = {},
  ) => {
    return fetchInstance<T>(url, { method: 'POST', ...options });
  },

  patch: async <T>(
    url: string,
    options: Omit<RequestOptions, 'method'> = {},
  ) => {
    return fetchInstance<T>(url, { method: 'PATCH', ...options });
  },

  put: async <T>(url: string, options: Omit<RequestOptions, 'method'> = {}) => {
    return fetchInstance<T>(url, { method: 'PUT', ...options });
  },

  delete: async <T>(
    url: string,
    options: Omit<RequestOptions, 'body' | 'method'> = {},
  ) => {
    return fetchInstance<T>(url, { method: 'DELETE', ...options });
  },
};
