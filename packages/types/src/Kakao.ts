// types/kakao.d.ts 파일을 프로젝트의 types 디렉토리에 생성

// Kakao SDK의 타입 정의
export interface KakaoShare {
  sendDefault: (options: {
    objectType: string;
    text: string;
    link: {
      webUrl: string;
      mobileWebUrl: string;
    };
    buttons?: Array<{
      title: string;
      link: {
        webUrl: string;
        mobileWebUrl: string;
      };
    }>;
  }) => void;
}

export interface Kakao {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: KakaoShare;
}

// Window 인터페이스 확장
export interface Window {
  Kakao?: Kakao;
}
