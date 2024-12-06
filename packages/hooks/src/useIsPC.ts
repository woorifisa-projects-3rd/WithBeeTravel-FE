// hooks/useIsPC.ts
import { useEffect, useState } from 'react';

const isPCDevice = (): boolean => {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  // 모바일 및 태블릿과 관련된 패턴을 체크
  const mobileRegex = /Mobi|Android|Tablet|iPad|iPhone|iPod/i;
  return !mobileRegex.test(userAgent); // 모바일/태블릿이 아니면 PC로 판단
};

export const useIsPC = (): boolean => {
  const [isPC, setIsPC] = useState<boolean>(true);

  useEffect(() => {
    setIsPC(isPCDevice());
  }, []);

  return isPC;
};
