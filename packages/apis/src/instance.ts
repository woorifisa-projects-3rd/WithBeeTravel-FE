import { auth } from '@withbee/auth-config';
import { ErrorResponse, SuccessResponse } from '@withbee/types';
import { ERROR_MESSAGES } from '@withbee/exception';
import { redirect } from 'next/dist/server/api-utils';

interface RequestOptions extends RequestInit {
  isMultipart?: boolean;
  requireAuth?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetchInstance = async <T = undefined>(
  url: string,
  options: RequestOptions = {},
): Promise<SuccessResponse<T> | ErrorResponse> => {
  try {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // auth 체크 및 토큰 추가
    if (options.requireAuth !== false) {
      try {
        const session = await auth();
        const accessToken = session?.user?.accessToken;

        if (!accessToken) {
          console.error('No access token found');
          throw new Error('Authentication required');
        }

        headers.Authorization = `Bearer ${accessToken}`;
      } catch (authError) {
        console.error('Auth error:', authError);
        throw new Error('Authentication failed');
      }
    }

    if (options.body instanceof FormData) {
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = 'application/json';
      if (typeof options.body === 'object') {
        options.body = JSON.stringify(options.body);
      }
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      // cache: 'no-store',  // 필요한 경우 캐시 설정
    });

    // 응답 타입 체크
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error('Unexpected content type:', contentType);
      const text = await response.text();
      console.error('Response text:', text);
      throw new Error('Invalid response format');
    }

    const result = (await response.json()) as
      | SuccessResponse<T>
      | ErrorResponse;

    if (!response.ok) {
      const errorResult = result as ErrorResponse;
      console.error('API Error:', errorResult);
      return errorResult;
    }

    return result;
  } catch (error) {
    console.error('Fetch error:', error);

    // 적절한 에러 응답 반환
    return {
      status: '500',
      message: ERROR_MESSAGES['FETCH-FAILED'],
      code: 'FETCH-FAILED',
    } as ErrorResponse;
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
