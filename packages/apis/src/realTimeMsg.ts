import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';

export const connectSSE = (
  url: string,
  onMessage: (data: any) => void,
  onConnect?: () => void,
  onError?: (error: any) => void,
  token?: string,
) => {
  return new Promise<EventSourcePolyfill>((resolve, reject) => {
    if (!token) {
      reject(new Error('Authentication required'));
      return;
    }

    const eventSourceOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      withCredentials: true, // 중요: 크로스 오리진 요청 시 인증 정보 포함
      heartbeatTimeout: 30000,
    };

    const EventSource = EventSourcePolyfill || NativeEventSource;
    const eventSource = new EventSource(url, eventSourceOptions);
    // 연결 성공 이벤트
    eventSource.addEventListener('sse', () => {
      console.log('SSE Connection Opened');
      onConnect?.();
      resolve(eventSource);
    });

    // 연결 실패 처리
    eventSource.addEventListener('error', (error) => {
      console.error('SSE Error:', error);
      onError?.(error);
      eventSource.close();
      reject(error);
    });

    // 메시지 수신 이벤트
    eventSource.addEventListener('message', (event) => {
      onMessage(event.data);
    });

    return eventSource;
  });
};
