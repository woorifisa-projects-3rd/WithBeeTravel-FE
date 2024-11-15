// import { auth } from '@/auth';

interface SuccessResponse<T> {
  status: string;
  message: string;
  data?: T;
}

interface ErrorResponse {
  status: string;
  name: string;
  code: string;
  message: string;
}

interface RequestOptions extends RequestInit {
  isMultipart?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetchInstance = async <T = undefined>(
  url: string,
  options: RequestOptions = {},
): Promise<SuccessResponse<T> | ErrorResponse> => {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
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
      console.error('Fetch Error:', errorResult);
      return errorResult;
    }

    return result as SuccessResponse<T>;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
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
