'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export type ParamKey =
  | 'sortBy'
  | 'startDate'
  | 'endDate'
  | 'memberId'
  | 'category';
export type ParamValue = string | number | undefined;

export function usePaymentParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const updateParam = (key: ParamKey, value: ParamValue) => {
    const params = new URLSearchParams(searchParams);

    switch (key) {
      case 'memberId':
        if (value && Number(value) !== 0) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;

      case 'category':
        if (value && value !== '전체') {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;

      case 'sortBy':
        if (value && value !== 'latest') {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;

      case 'startDate':
      case 'endDate':
        if (value) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
        break;
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return {
    params: {
      sortBy: searchParams.get('sortBy') || 'latest',
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      memberId: Number(searchParams.get('memberId')) || 0,
      category: searchParams.get('category') || '전체',
    },
    updateParam,
  };
}
