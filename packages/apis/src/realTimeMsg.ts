import { EventSourcePolyfill } from 'event-source-polyfill';

export const connectSSE = (
  url: string,
  onMessage: (data: string) => void,
  onConnect?: () => void,
  onError?: (error: any) => void,
  token?: string,
) => {
  const eventSource = new EventSourcePolyfill(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Connection: 'keep-alive',
      Accept: 'text/event-stream',
    },
    heartbeatTimeout: 30000,
  });

  // 연결 성공 이벤트
  eventSource.addEventListener('connect', (event: any) => {
    const { data } = event;
    if (data === 'SSE 연결이 완료되었습니다.') {
      console.log('SSE CONNECTED');
      onConnect?.();
    }
  });

  // 메시지 수신 이벤트
  (eventSource as EventSource).addEventListener(
    'message',
    (event: MessageEvent) => {
      onMessage(event.data);
    },
  );

  // 에러 처리
  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    onError?.(error);
    eventSource.close();
  };

  return eventSource; // 이벤트 소스를 반환
};
